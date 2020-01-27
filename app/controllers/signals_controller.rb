class SignalsController < ApplicationController
  before_action :hide_currency

  def index
    set_meta_tags(
      title: "Professional Crypto Trading Signals"
    )
  end
end
