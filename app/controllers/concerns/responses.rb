module Responses

  extend ActiveSupport::Concern

  included do
  end

  def render_404
    Rollbar.silenced {
      raise ActionController::RoutingError.new('Not Found')
    }
  end

  def render_403
    head :forbidden
  end

end