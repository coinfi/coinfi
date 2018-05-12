# All Administrate controllers inherit from this `Admin::ApplicationController`,
# making it the ideal place to put authentication logic or other
# before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    before_action :require_admin
    before_action :set_paper_trail_whodunnit

    def require_admin
      redirect_to "/", alert: "Not authorized." unless current_user.try(:admin?)
    end
  end
end
