class ApiController < ApplicationController
  include Api::Concerns::Responses
  before_action :skip_trackable
  respond_to :json

  def detect_calendar_feature
    return respond_unfound if !has_calendar_feature?
  end

  # https://blog.bigbinary.com/2018/10/30/skip-devise-trackable-module-for-api-calls.html
  def skip_trackable
    request.env['warden'].request.env['devise.skip_trackable'] = '1'
  end
end
