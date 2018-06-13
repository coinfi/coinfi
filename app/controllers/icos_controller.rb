class IcosController < ApplicationController

  ICOS_PER_PAGE = 100

  def index
    @status = params[:status]
    redirect_to "/icos/upcoming" && return unless Coin::ICO_STATUSES.include?(@status)
    @coins = Coin.icos.where(ico_status: @status)
    apply_filters
    @result_count_total = @coins.length
    @coins = @coins.page(params[:page]).per(ICOS_PER_PAGE)
    @result_count = @coins.length
    set_meta_tags(
      keywords: "ico list, ico rating, ico alert, ico review, initial coin offering, initial coin offering list, ico initial coin offering"
    )
    render(layout: false) if params[:naked]
    @react_props = {
      industries: CoinIndustry.pluck(:name),
      tokenTypes: Coin.token_types,
      influencers: Influencer.pluck(:name)
    }
  end

  private

  def apply_filters
    return if filter_params.empty?
    @coins = @coins.ransack(build_query).result
  end

  def build_query
    p = filter_params
    query = p.map { |key, value|
      parse_param(key.to_sym, value)
    }.compact.to_h
    if p[:coinIndustries] || p[:reviewedBy]
      # TODO: find sane way of filtering by multiple associations
      ids = []
      if p[:coinIndustries]
        industry_ids = CoinIndustry.where(name: p[:coinIndustries].values).pluck(:id)
        ids[0] = CoinIndustriesCoin.where( coin_industry_id: industry_ids).pluck(:coin_id)
      end
      if p[:reviewedBy]
        influencer_ids = Influencer.where(name: p[:reviewedBy].values).pluck(:id)
        ids[1] = InfluencerReview.where(
          influencer_id: influencer_ids
        ).pluck(:coin_id)
      end
      if ids[0] && ids[1]
        query[:id_in] = ids[0] & ids[1]
      else
        query[:id_in] = ids[0] || ids[1]
      end
      query[:id_in] << -1 if query[:id_in].empty? # Ransack returns all results if empty
    end
    query
  end

  def parse_param key, value
    case key
    when :closingDate
      [:ico_end_date_gteq, parse_date(value)]
    when :startingDate
      [:ico_start_date_gteq, parse_date(value)]
    when :hardCapMin
      [:ico_fundraising_goal_usd_gteq, value.to_i * 1_000_000]
    when :hardCapMax
      [:ico_fundraising_goal_usd_lteq, value.to_i * 1_000_000]
    when :tokenType
      [:token_type_in, value.values]
    when :search
      [:name_or_symbol_cont, value]
    end
  end

  def filter_params
    params.permit!
    p = HashWithIndifferentAccess.new params[:q]
    return [] unless p
    if p[:hardCap]
      p[:hardCapMin] = p[:hardCap][:min]
      p[:hardCapMax] = p[:hardCap][:max]
    end
    p
  end

  def parse_date str
    DateTime.parse(str).to_i
  end

end