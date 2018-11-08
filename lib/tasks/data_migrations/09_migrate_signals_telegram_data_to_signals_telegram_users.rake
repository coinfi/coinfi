namespace :data_migrations do
  desc 'Migrate signals telegram data to `signals_telegram_users`'
  task :migrate_signals_telegram_data_to_signals_telegram_users => :environment do
    ActiveRecord::Base.transaction do
      users = User.where("(token_sale->>'signals_telegram_bot_chat_id') IS NOT NULL")
      users.find_each do |user|
        signals_telegram_user = SignalsTelegramUser.new(
          user: user,
          telegram_username: user.token_sale.fetch('telegram_username'),
          telegram_chat_id: user.token_sale.fetch('signals_telegram_bot_chat_id'),
          started_at: user.token_sale.fetch('signals_telegram_bot_started_at'),
          is_active: true,
        )
        signals_telegram_user.save!
        puts "Created SignalsTelegramUser(#{signals_telegram_user.id}): @#{signals_telegram_user.telegram_username} #{signals_telegram_user.telegram_chat_id}"

        user.update!(
          token_sale: user.token_sale.except('signals_telegram_bot_chat_id', 'signals_telegram_bot_started_at')
        )
        puts "Removed signal telegram fields from User(#{user.id})"
      end
    end
  end
end
