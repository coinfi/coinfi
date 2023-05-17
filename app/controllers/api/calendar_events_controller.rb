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

    case q[:eventStatuses]
    when "Confirmed only"
      @calendar_events = @calendar_events.where(status: "confirmed")
    when "Pending"
      @calendar_events = @calendar_events.where(status: "pending")
    end

    # confidence pending
    if q[:confidence].present?
      puts q[:confidence]
    end

    if q[:publishedUntil].present?
      @calendar_events = @calendar_events.where('date_event < ?', q[:publishedUntil])
    end

    if q[:publishedSince].present?
      @calendar_events = @calendar_events.where('date_event > ?', q[:publishedSince])
    end

    past = q[:events] == 'Past events'

    if q[:id].present?
      if past
        @calendar_events = @calendar_events.where('id < ?',  q[:id])
      else
        @calendar_events = @calendar_events.where('id < ?',  q[:id])
      end
    end

    if past
      @calendar_events = @calendar_events.where('date_event < ?', Time.now).order(date_event: :desc, id: :desc)
    else
      @calendar_events = @calendar_events.where('date_event > ?', Time.now).order(:date_event, :id)
    end

    # if have to pluck, maybe better to apply all other filters first
    # no coin data in calendar events yet
    # @calendar_events = @calendar_events.joins(:calendar_event_coins).where(calendar_event_coins: { coin_id: coin_ids })

    # no categories yet. this query results in an error
    # if q[:categories].present?
    #   @calendar_events = @calendar_events.includes(:news_categories).where(news_categories: { name: q[:categories] }).references(:news_categories)
    # end

    @calendar_events = @calendar_events.includes(:coins, :news_categories).limit(PER_PAGE)

    respond_success serialized(@calendar_events)
  end

  private

  def serialized(obj)
    obj.as_json(
      only: %i[id name description date_event status source_url screenshot_url],
      methods: %i[coin_link_data coin_symbols categories]
    )
  end
end