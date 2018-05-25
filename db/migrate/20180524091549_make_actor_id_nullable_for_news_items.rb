class MakeActorIdNullableForNewsItems < ActiveRecord::Migration[5.1]
  def change
    change_column_null(:news_items, :actor_id, true)
  end
end
