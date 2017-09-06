module CoinsHelper
  def display_percentage_change(percentage_change)
    return "N/A" if percentage_change.nil?
    return "0.0%" if percentage_change == 0
    sign = percentage_change > 0 ? "+" : ""
    color = percentage_change > 0 ? "text-success" : "text-danger"
    "<span class='#{color}'>#{sign}#{percentage_change}%</span>".html_safe
  end

  def custom_number_to_currency(amount, options = {})
    custom = {
      precision: amount < 1.0 ? 6 : 2
    }
    number_to_currency(amount, options.merge(custom))
  end
end
