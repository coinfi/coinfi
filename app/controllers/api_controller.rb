class ApiController < ApplicationController
  include Api::Concerns::Responses
  respond_to :json
end