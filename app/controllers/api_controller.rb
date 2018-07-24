class ApiController < ApplicationController
  include Api::Concerns::Responses
  respond_to :json

  def detect_news_feature
    return respond_unfound if !has_news_feature?
  end
end
