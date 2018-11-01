namespace :data_migrations do
  desc 'Update user staked ethereum addresses to lowercase'
  task :downcase_user_staked_ethereum_address => :environment do
    ActiveRecord::Base.transaction do
      users = User.where("(token_sale->>'staked_ethereum_address') IS NOT NULL")

      users.find_each do |user|
        staked_ethereum_address = user.token_sale["staked_ethereum_address"]
        cleaned_staked_ethereum_address = staked_ethereum_address.downcase
        if staked_ethereum_address != cleaned_staked_ethereum_address
          user.token_sale["staked_ethereum_address"] = cleaned_staked_ethereum_address
          user.save!
          puts "Updated User(#{user.id}) staked ethereum address: #{staked_ethereum_address} to #{cleaned_staked_ethereum_address}"
        end
      end
    end
  end
end
