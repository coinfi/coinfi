class AllowNullValuesForNewsItemsSummary < ActiveRecord::Migration[5.1]
  def change
    change_column_null(:news_items, :summary, true)
  end
end
