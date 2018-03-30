class WatchlistController < ApplicationController

  def show
    redirect_to('/login') if !current_user
  end



end