# if you're wondering why we named it WebsubsController see https://en.wikipedia.org/wiki/WebSub
class Webhooks::WebsubsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :verify_signature

  include NewsHelper

  def superfeedr_ingest
    items = params[:items]
    head :ok and return if items.blank?

    items.each do |item|
      NewsItemRaw.ingest!(item, params[:source])
    end

    puts "Received #{items.count} NewsItems from SuperFeedr."

    # Rewrite default_news_item ids cache if any items.
    if items.count > 0
      get_default_news_item_ids(rewrite_cache: true)
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
