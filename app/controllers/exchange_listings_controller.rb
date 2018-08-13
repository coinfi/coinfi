class ExchangeListingsController < ApplicationController
  before_action :apply_feature_flag

  def index
    @body_id = 'pane-layout'
    @listings = ExchangeListing.includes(:exchange).order_by_detected.page(params[:page]).per(10).as_json(
      only: %i[id symbol quote_symbol exchange_id exchange_name detected_at],
      methods: %i[exchange_id exchange_name]
    )
  end

  def show
    @listing = ExchangeListing.find(params[:id])
    @coin = Coin.listed.find_by_symbol(@listing.quote_symbol)

    respond_to do |format|
      format.js { render layout: false }
    end
  end

protected

  def apply_feature_flag
    return render_404 if !has_listings_feature?
  end
end
