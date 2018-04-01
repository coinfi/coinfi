class WatchlistController < ApplicationController

  def show
    @watchlist = current_user.watchlist
    @articles = Article.where(coin_id: @watchlist.coin_ids).order('published_date desc')
  end
end