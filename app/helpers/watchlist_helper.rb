module WatchlistHelper

  def user_is_watching? coin
    # Return truthy string when true (string needed for passing as data attr)
    return false unless current_user && current_user.watchlist
    return "true" if current_user.watchlist.coin_ids.include?(coin.id)
  end

end