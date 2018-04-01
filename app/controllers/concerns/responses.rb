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
    respond_with build_response(payload, message)
  end

  def respond_warning message, payload = nil
    respond_with build_response(payload, message, 'warning'), 400
  end

  def respond_error message, payload = nil
    respond_with build_response(payload, message, 'error'), 400
  end

  def respond_unfound message = nil
    respond_with build_response(nil, message, 'not_found'), 404
  end

  private

  def respond_with json, status = 200
    render json: json, status: status
  end

  def build_response payload = nil, message = nil, type = 'success'
    response = { type: type }
    response[:payload] = payload if payload
    response[:message] = message if message
    response
  end

end