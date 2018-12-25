class Api::Signals::CoinsController < Api::Signals::BaseController
  before_action :set_coin, only: [:show]

  def show
    json = serialize_coin(@coin)
    render json: json, status: :ok
  end

  private

  def set_coin
    coin_key = params.require(:coin_key)
    @coin = Coin.find_by_coin_key!(coin_key)
  end

  def serialize_coin(coin)
    coin
      .as_json(
        only: %i[id name symbol slug coin_key token_decimals eth_address ranking],
        methods: %i[price]
      )
      .merge({
        is_signals_supported_erc20: coin.is_signals_supported_erc20?
      })
  end
end
