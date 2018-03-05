class AuthorProfilesController < ApplicationController

  layout "gsdk"

  before_action :set_profile

  def edit
  end

  def update
    @profile.update!(profile_params)
    current_user.update(user_params)
    redirect_to :edit_author_profile
  end

  def create
    @profile = AuthorProfile.new(profile_params)
    @profile.user = current_user
    @profile.save
    current_user.update(user_params)
    redirect_to :edit_author_profile
  end


  private

  def set_profile
    if user_signed_in?
      @profile = current_user.author_profile || AuthorProfile.new(user:current_user)
    else
      redirect_to '/login', alert: "Please login first"
    end
  end

  def profile_params
    params.require(:author_profile).permit(
      :name, :company, :role, :website_url, :twitter_url, :linkedin_url, 
      :bio, :investing_style, :photo
    )
  end

  def user_params
    params[:author_profile].require(:user_attributes).permit(:username)
  end

end