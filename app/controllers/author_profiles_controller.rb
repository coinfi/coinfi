class AuthorProfilesController < ApplicationController

  before_action :set_author_profile, only: [:edit, :update, :create]

  def index
    @profiles = AuthorProfile.all
  end

  def show
    @profile = AuthorProfile.friendly.find(params[:id]) 
    @author = @profile.user
  end

  def edit
  end

  def update
    if @profile.update(profile_params)
      args = { notice: "Profile updated" }
    else
      args = { alert: @profile.errors.full_messages }
    end
    redirect_to :edit_author_profile, args
  end

  def create
    @profile = AuthorProfile.new(profile_params)
    @profile.user = current_user
    if @profile.save
      args = { notice: "Profile created" }
    else
      args = { flash: { "alert-warning": @profile.errors.full_messages } }
    end
    redirect_to :edit_author_profile, args
  end

  private

  def set_author_profile
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

end