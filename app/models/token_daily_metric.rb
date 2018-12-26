class TokenDailyMetric < ApplicationRecord
  self.table_name = 'metrics_chart_view'

  def readonly?
    true
  end
end