class StaticController < ApplicationController
  TYPES = ['coins', 'exchanges']

  before_action :set_type, :set_id, only: [:show]

  def show
    if @type.blank? || @id == 0 then
      return render_404
    end

    @url = "https://s2.coinmarketcap.com/static/img/#{@type}/32x32/#{@id}.png"
    response = begin
      HTTParty.get(@url)
    rescue HTTParty::Error
      nil
    end

    if response.blank? || !response.success?
      return render_404
    end

    content_type = response.headers["content-type"] || 'image/png'
    expires_in 1.day, public: true
    send_data response.parsed_response, content_type: content_type, disposition: 'inline'
  end

  private

  def set_type
    type = params[:type].try(:downcase)
    @type = TYPES.include?(type) ? type : nil
  end

  def set_id
    @id = params[:id].try(:to_i) || 0
  end
end