class ExchangeListingsController < ApplicationController
  def index
    @body_id = 'news-page' # TODO: Refactor the CSS to something more universal.
    @listings = ExchangeListing.centralized.order_by_detected.page(params[:page]).per(20)
  end

  def show
    @listing = ExchangeListing.find(params[:id])
    @coin = Coin.listed.find_by_symbol(@listing.quote_symbol)

    respond_to do |format|
      format.js { render layout: false }
    end
  end
end
