class Api::CalendarEventsController < ApiController
  PER_PAGE = 20

  def index
    @calendar_events = CalendarEvent.all

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