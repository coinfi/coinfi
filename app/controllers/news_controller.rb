class NewsController < ApplicationController
  before_action :set_body_class

  def index
  end

  protected

  def set_body_class
    @body_class = 'page page--fullscreen'
  end
end
