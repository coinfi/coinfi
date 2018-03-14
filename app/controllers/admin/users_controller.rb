module Admin
  class UsersController < Admin::ApplicationController
    before_action :authenticate_admin
  end
end
