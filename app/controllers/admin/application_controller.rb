# All Administrate controllers inherit from this `Admin::ApplicationController`,
# making it the ideal place to put authentication logic or other
# before_actions.
#
# If you want to add pagination or other controller-level concerns,
# you're free to overwrite the RESTful controller actions.
module Admin
  class ApplicationController < Administrate::ApplicationController
    http_basic_authenticate_with name: "coinfi", password: ENV.fetch('ADMINISTRATE_PASSWORD')

    def authenticate_admin
      redirect_to "/", alert: "Not authorized." unless current_user && access_whitelist
    end

    def access_whitelist
      current_user && ENV.fetch('ADMINISTRATE_WHITELIST').split(',').include?(current_user.id.to_s)
    end

    # Override this value to specify the number of elements to display at a time
    # on index pages. Defaults to 20.
    # def records_per_page
    #   params[:per_page] || 20
    # end
  end
end
