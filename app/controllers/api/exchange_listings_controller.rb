class Api::ExchangeListingsController < ApiController
  def index
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    q = params[:q] || {}

    @listings = ExchangeListing.all

    if q[:detectedSince].present?
      @listings = @listings.where('detected_at > ?', q[:detectedSince].to_datetime)
    end

    if q[:detectedUntil].present?
      @listings = @listings.where('detected_at < ?', q[:detectedUntil].to_datetime)
    end

    @listings = @listings.order_by_detected.limit(20)

    respond_success index_serializer(@listings)
  end

  def show
    @listing = ExchangeListing.find(params[:id])
    respond_success show_serializer(@listing)
  end

  private

  def index_serializer(listings)
    listings.as_json(
      only: %i[id symbol quote_symbol exchange_id exchange_name detected_at],
      methods: %i[exchange_id exchange_name]
    )
  end

  def show_serializer(listing)
    listing.as_json(
      only: %i[id name image_url symbol slug price_usd],
      methods: %i[prices_data news_data market_info is_being_watched]
    )
  end
end
