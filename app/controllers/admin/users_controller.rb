module Admin
  class UsersController < Admin::ApplicationController
    before_action :require_superadmin
  end
end
