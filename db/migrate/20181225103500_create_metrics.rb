class CreateMetrics < ActiveRecord::Migration[5.1]
  disable_ddl_transaction!

  def up
    create_table :metrics do |t|
      t.string :token_address, limit: 66
      t.string :metric_type, limit: 256
      t.date :date
      t.float :metric_value
    end

    add_index :metrics, [:token_address, :metric_type, :date], :unique => true, algorithm: :concurrently
    safety_assured {
      execute <<-SQL
        ALTER TABLE metrics ADD CONSTRAINT composite_key UNIQUE USING INDEX index_metrics_on_token_address_and_metric_type_and_date;
      SQL
    }
  end

  def down
    drop_table :metrics
  end
end