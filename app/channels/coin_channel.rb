class CoinChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'coin_channel'
  end

  def process(data)
    CoinService.update(data['coins'])
    coin_service = CoinService.new(parse_query_from_url(data['url']))

    coins = {}.tap do |json|
              coin_service.coins.each { |coin| json[coin.id] = coin_detail(coin) }
            end

    #ActionCable.server.broadcast('coin_channel', coins: coins, action: :processed)
  end

private

  def parse_query_from_url(url)
    Rack::Utils.parse_query(URI(url).query).with_indifferent_access
  end

  def coin_detail(coin)
    CoinsController.render(
      partial: 'coin_detail',
      locals: { coin: coin, currency: 'usd' }
    )
  end
end
