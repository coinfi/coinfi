class UsersController < ApplicationController
  # This controller is for profiles and other user related information.

  before_action :authenticate_user!

  def edit
  end

  def update
    if current_user.update(user_params)
      flash[:success] = 'Profile successfully updated.'
      redirect_to '/profile'
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
