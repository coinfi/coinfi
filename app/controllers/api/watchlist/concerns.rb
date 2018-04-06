module Api::Watchlist::Concerns
  
  extend ActiveSupport::Concern

  included do
    before_action :set_watchlist
  end

  private

  def set_watchlist
    @watchlist = current_user.watchlist || Watchlist.create(user: current_user)
  end

end

