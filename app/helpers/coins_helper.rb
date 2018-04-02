module CoinsHelper
  def display_percentage_change(percentage_change)
    return "N/A" if percentage_change.nil?
    return "0.0%" if percentage_change == 0
    sign = percentage_change > 0 ? "+" : ""
    color = percentage_change > 0 ? "green" : "sunset"
    "<span class='#{color}'>#{sign}#{percentage_change}%</span>".html_safe
  end

  def custom_number_to_currency(amount, options = {})
    amount = amount || 0
    custom = {
      precision: amount < 1.0 ? 6 : 2
    }
    number_to_currency(amount, options.merge(custom))
  end

  def number_to_human_options
    {
      delimiter: ',',
      format: "%n%u",
      precision: 2,
      significant: false,
      units: {
        million: 'M',
        billion: 'B',
        trillion: 'T'
      }
    }
  end
end
