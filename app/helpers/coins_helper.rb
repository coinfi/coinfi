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

  def abbreviated_number number, opts = {}
    n = number_with_delimiter(number)
    t = n.split(',')
    # Less than a million
    return "#{opts[:prefix]}#{t}" if t.length < 3 
    # Over a million
    if t.length == 3 
      decimal = t[2][0..1]
      t.pop(2)
      return "#{opts[:prefix]}#{t[0]}.#{decimal}M"
    end
    # Over a billion
    billions = t.first(t.length - 3).join(',')
    decimal = t.first(t.length - 2).reverse[0][0..1]
    "#{opts[:prefix]}#{billions}.#{decimal}B"
  end  

end
