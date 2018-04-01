class Api::WatchlistController < ApplicationController

  respond_to :json
  before_action :authenticate_user!
  before_action :set_watchlist

  def show_coin
    @coin = @watchlist.coins.find_by_id(params[:id])
    respond_success @coin || {}
  end

  def add_coin
    @coin = Coin.find(params[:id])
    if @watchlist.coins.find_by_id(@coin.id)
      respond_warning "Coin already added"
    else
      @watchlist.coins << @coin
      @watchlist.save
      respond_success "Coin added to watchlist"
    end
  end

  def remove_coin
    if @coin = @watchlist.coins.find_by_id(params[:id])
      @watchlist.coins.delete(@coin)
      respond_success "Coin removed from watchlist"
    else
      respond_warning "Coin already removed"
    end
  end

  private

  def set_watchlist
    @watchlist = current_user.watchlist
    @watchlist = Watchlist.create(user:current_user) unless @watchlist
  end

end