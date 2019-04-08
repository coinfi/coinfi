class StaticController < ApplicationController
  TYPES = ['coins', 'exchanges']
  CACHE_TIME = 1.year

  before_action :set_type, :set_id, only: [:show]

  def show
    response = fetch_data_from_cmc
    unless response.present? && response[:response_success]
      return render_404
    end

    expires_in CACHE_TIME, public: true
    send_data response[:data], content_type: response[:content_type], disposition: 'inline'
  end

  private

  def set_type
    type = params[:type].try(:downcase)
    @type = TYPES.include?(type) ? type : nil
  end

  def has_type?
    @type.present?
  end

  def set_id
    @id = params[:id].try(:to_i) || 0
  end

  def has_id?
    @id > 0
  end

  def fetch_data_from_cmc
    unless has_type? && has_id?
      return nil
    end

    Rails.cache.fetch("static/#{@type}/#{@id}", expires_in: CACHE_TIME) do
      @url = "https://s2.coinmarketcap.com/static/img/#{@type}/32x32/#{@id}.png"
      response = begin
        HTTParty.get(@url)
      rescue HTTParty::Error
        nil
      end

      if response.blank?
        return nil
      end

      response_success = response.success?
      content_type = response.headers["content-type"] || 'image/png'
      data = response.parsed_response

      {
        response_success: response_success,
        content_type: content_type,
        data: data,
      }
    end
  end
end