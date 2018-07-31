class ApiController < ApplicationController
  include Api::Concerns::Responses
  respond_to :json

  def detect_news_feature
    return respond_unfound if !has_news_feature?
  end

  def detect_calendar_feature
    return respond_unfound if !has_calendar_feature?
  end
end
