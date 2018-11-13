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

    if items.count > 0
      Rails.cache.write("default_news_items") do
        distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
          news_items = default_news_query
          news_items = backup_default_news_query if news_items.empty?

          serialize_news_items(news_items)
        end
      end
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
