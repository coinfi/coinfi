# All Administrate controllers inherit from this `Admin::ApplicationController`,
# making it the ideal place to put authentication logic or other
# before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    before_action :require_admin
    helper ReactOnRails::Helper

    def require_admin
      redirect_to "/", alert: "Not authorized." unless current_user.try(:admin?)
    end

    def require_superadmin
      redirect_to "/admin", alert: "Not authorized." unless current_user.try(:superadmin?)
    end
  end
end
