class IcosController < ApplicationController
  ICOS_PER_PAGE = 100

  def index
    @status = params[:status]
    redirect_to "/icos/upcoming" && return unless Coin::ICO_STATUSES.include?(@status)

    @coins = Coin.where(ico_status: @status)
    @result_count_total = @coins.length
    @coins = @coins.page(params[:page]).per(ICOS_PER_PAGE)
    @result_count = @coins.length

    set_meta_tags(
      title: "#{@status.capitalize} ICOs",
      keywords: "ico list, ico rating, ico alert, ico review, initial coin offering, initial coin offering list, ico initial coin offering"
    )
  end
end
