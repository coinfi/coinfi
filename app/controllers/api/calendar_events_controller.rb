class Api::CalendarEventsController < ApiController
  PER_PAGE = 20

  before_action :detect_calendar_feature

  def index
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    q = params[:q] || {}

    coin_ids = q[:coinIDs]
    coin_ids = Coin.where(name: q[:coins]).pluck(:id) if q[:coins]
    coin_ids = Coin.top(20).ids unless coin_ids # no such requirement for events?

    @calendar_events = CalendarEvent.all

    # no coin data in calendar events yet
    # @calendar_events = @calendar_events.joins(:calendar_event_coins).where(calendar_event_coins: { coin_id: coin_ids })

    if q[:categories].present?
      @calendar_events = @calendar_events.where(news_categories: { name: q[:categories] })
    end

    if q[:id].present?
      if q[:publishedUntil].present?
        @calendar_events = @calendar_events.where('date_event < ? AND id < ?', q[:publishedUntil], q[:id])
      end

      if q[:publishedSince].present?
        @calendar_events = @calendar_events.where('date_event > ? AND id > ?', q[:publishedSince], q[:id])
      end
    end

    if q[:events] == 'Past events'
      @calendar_events = @calendar_events.where('date_event < ?', Time.now).order('date_event DESC, id DESC')
    else
      @calendar_events = @calendar_events.where('date_event > ?', Time.now).order('date_event ASC, id ASC')
    end

    @calendar_events = @calendar_events.includes(:coins, :news_categories).limit(PER_PAGE)

    respond_success serialized(@calendar_events)
  end

  private

  def serialized(obj)
    obj.as_json(
      only: %i[id name description date_event status source_url screenshot_url],
      methods: %i[coin_link_data categories]
    )
  end
end