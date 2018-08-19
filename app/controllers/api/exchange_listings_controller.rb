class Api::ExchangeListingsController < ApiController
  PER_PAGE = 25

  def index
    # Ensure fresh response on every request
    headers['Last-Modified'] = Time.now.httpdate

    @listings = ExchangeListing.includes(:exchange).all

    if params[:detectedSince].present?
      @listings = @listings.where('detected_at > ?', params[:detectedSince].to_datetime)
    end

    if params[:detectedUntil].present?
      @listings = @listings.where('detected_at < ?', params[:detectedUntil].to_datetime)
    end

    @listings = @listings.order_by_detected.limit(PER_PAGE)

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
