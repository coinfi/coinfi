config = LaunchDarkly::Config.new({ logger: Logger.new("log/beta.log") })
$launch_darkly = LaunchDarkly::LDClient.new(ENV.fetch("LAUNCHDARKLY_SDK_KEY"), config)

namespace :users do
  desc "Create users from CSV file"
  task :create_from_csv => :environment do
    CSV.foreach("tag_coinfinews.csv", headers: true) do |row|
      email = row["Email"]
      user = User.find_by_email email
      if user
        #puts user.email, " Already has account!"
        user.identify_in_launch_darkly
      else
        password = SecureRandom.hex(6)
        puts "NEW ACCOUNT, #{email}, #{password}"
        begin
          #User.create!(email: row["Email"], password: password, password_confirmation: password)
        rescue => e
          puts e
        end
      end
    end
  end

  task :launch_darkly_identify => :environment do
    launch_darkly = LaunchDarkly::LDClient.new(ENV.fetch("LAUNCHDARKLY_SDK_KEY"))
    CSV.foreach("tag_coinfiambassadors.csv", headers: true) do |row|
      email = row["Email"]
      #puts email
      begin
        user = User.find_by_email(email)
        puts launch_darkly.identify(user.launch_darkly_hash)
      rescue => e
        puts email#, e
      end
    end
  end
end
