class ExchangeListingsController < ApplicationController
  before_action :apply_feature_flag
  before_action :set_body_class

  def index
    # These fields are used to populate the filters;
    # needs to be of the format { value, label }
    @quote_symbols = Coin.symbols.map { |symbol| { "value" => symbol, "label" => symbol }}
    @exchanges = Exchange.order(:name).select("name as label", "slug as value").as_json(except: :id)

    @listings = ExchangeListing.includes(:exchange).order_by_detected.limit(25).as_json(
      only: %i[id symbol quote_symbol exchange_id exchange_name detected_at],
      methods: %i[exchange_id exchange_name]
    )
  end

  def show
    @listing = ExchangeListing.find(params[:id])
    @coin = Coin.listed.legit.find_by_symbol(@listing.quote_symbol)

    respond_to do |format|
      format.js { render layout: false }
    end
  end

protected

  def apply_feature_flag
    return render_404 if !has_listings_feature?
  end

  def set_body_class
    @body_class = 'page page--fullscreen'
  end
end
