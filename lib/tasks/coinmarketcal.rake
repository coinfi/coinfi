namespace :coinmarketcal do
  desc "ingest from coinmarketcal_event database table"
  task ingest: :environment do
    ActiveRecord::Base.connection_pool.with_connection do |connection|

      user = User.find_by_email("coinmarketcal@coinfi.com")
      unless user
        user = User.create(
          email: "coinmarketcal@coinfi.com",
          password: Devise.friendly_token[0, 20]
        )
      end

      connection.execute("CREATE OR REPLACE VIEW coinmarketcal_event_view AS
      SELECT *
      FROM dblink('dbname=#{ENV['CALENDAR_DB_NAME']} port=#{ENV['CALENDAR_DB_PORT']} host=#{ENV['CALENDAR_DB_HOST']} user=#{ENV['CALENDAR_DB_USER']} password=#{ENV['CALENDAR_DB_PASSWORD']}',
                  'select id, title, description, date_event, source, related_coins from staging.coinmarketcal_event')
      AS t1(id bigint, title varchar, description varchar, date_event timestamp, source varchar, related_coins json);")

      latest = CalendarEvent.where.not(import_id: nil).order({import_id: :desc}).first

      query = "SELECT * FROM coinmarketcal_event_view
      #{'WHERE id > ' + latest.import_id.to_s if latest}
      ORDER BY id ASC;"
      result = connection.exec_query(query)
      result.each do |row|
        CalendarEvent.create(
          user_id: user.id,
          name: row["title"],
          description: row["description"],
          source_url: row["source"],
          date_event: row["date_event"],
          date_added: Time.now,
          import_id: row["id"]
        )
      end
    end
  end

end
