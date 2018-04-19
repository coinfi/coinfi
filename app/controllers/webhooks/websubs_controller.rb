# if you're wondering why we named it WebsubsController see https://en.wikipedia.org/wiki/WebSub
class Webhooks::WebsubsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :verify_signature


  def superfeedr_ingest
    params[:items].each do |item|
      NewsItem.ingest!(item, params[:source])
    end

    head :ok
  end

  private

  def payload_body
    @payload_body ||= request.body.read
  end

  def verify_signature
    signature = 'sha1=' + OpenSSL::HMAC.hexdigest(OpenSSL::Digest.new('sha1'), ENV.fetch('SUPERFEEDR_SECRET'), payload_body)
    raise "Signatures didn't match!" unless Rack::Utils.secure_compare(signature, request.env['HTTP_X_HUB_SIGNATURE'])
  end
end
