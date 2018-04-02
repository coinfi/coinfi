class WatchlistController < ApplicationController

  def show
    @watchlist = current_user.watchlist
    @articles = Article.where(coin_id: @watchlist.try(:coin_ids)).order('published_date desc')
  end
end