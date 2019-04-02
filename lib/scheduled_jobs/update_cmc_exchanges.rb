require 'sidekiq-scheduler'
class UpdateCmcExchanges
  include Sidekiq::Worker

  def perform
    CoinMarketCapPro::UpdateExchangesService.call
  end
end