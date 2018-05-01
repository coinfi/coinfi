
# Here we're turning permitted params into a Ransack query, eg.
# ?q[startingDate]=2018-04-30  ---->  { ico_start_date_gteq: 1525046400 }

module IcoFilters

  extend ActiveSupport::Concern

  private

  def apply_filters
    return if permitted_filter_params.empty?
    @coins = @coins.ransack(parse_params).result
  end

  def parse_params
    permitted_filter_params.to_h.map { |key, value|
      parse_param(key.to_sym, value)
    }.compact.to_h
  end

  def parse_param key, value
    case key
      when :closingDate
        return [:ico_end_date_gteq, parse_date(value)]
      when :startingDate
        return [:ico_start_date_gteq, parse_date(value)]
      when :hardCapMin
        return [:ico_fundraising_goal_usd_gteq, value.to_i * 1000000]
      when :hardCapMax
        return [:ico_fundraising_goal_usd_lteq, value.to_i * 1000000]
    end
  end

  def permitted_filter_params
    p = params[:q]
    return [] unless p
    if p[:hardCap]
      p[:hardCapMin] = p[:hardCap][:min]
      p[:hardCapMax] = p[:hardCap][:max]
    end
    p.permit([
      :closingDate, :startingDate, :hardCapMin, :hardCapMax,
      :countriesAllowed => [], :categories => []
    ])
  end

  def parse_date str
    DateTime.parse(str).to_i
  end

end