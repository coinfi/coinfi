module Responses
  
  extend ActiveSupport::Concern

  included do
  end

  def render_404
    raise ActionController::RoutingError.new('Not Found')
  end

  def render_403
    head :forbidden
  end

  def respond_success payload = nil, message = nil
    json_response payload, message, 'success'
  end

  def respond_warning message, payload = nil
    json_response payload, message, 'warning'
  end

  def respond_error message, payload = nil
    json_response payload, message, 'error', 400
  end

  def respond_unfound message = nil
    json_response nil, message, 'not_found'
  end

  private

  def json_response message, payload, type, status = 200
    render json: build_response(message, payload, type), status: status
  end

  def build_response payload = nil, message = nil, type = 'success'
    response = { type: type }
    response[:payload] = payload if payload
    response[:message] = message if message
    response
  end

end