class CoinService
  COINS_PER_PAGE = 100
  attr_reader :params

  def self.update(coins)
    Array.wrap(coins).each do |coin_hash|
      coin = Coin.find_by(symbol: coin_hash['symbol'])

      if coin
        coin.attributes = coin_hash
        coin.save
      end
    end
  end

  def initialize(params)
    @params = params
  end

  def coins
    @coins ||= Coin.order(:ranking).page(params[:page]).per(COINS_PER_PAGE)
  end

  def result_count_total
    coins.total_count
  end

  def result_count
    coins.size
  end
end
