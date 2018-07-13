source 'https://rubygems.org'
ruby '2.4.1'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.3'
# Use postgresql as the database for Active Record
gem 'pg', '~> 0.18'
# Use Puma as the app server
gem 'puma', '~> 3.7'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'active_record_union'
gem 'acts-as-taggable-on'
gem 'administrate'
gem 'administrate-field-belongs_to_search'
gem 'administrate-field-json', github: 'eddietejeda/administrate-field-json'
gem 'administrate-field-nested_has_many', github: 'nickcharlton/administrate-field-nested_has_many'
gem 'aws-sdk', '~> 2'
gem 'canonical-rails'
gem 'convertkit-ruby', require: 'convertkit', git: 'https://github.com/hanchang/convertkit-ruby.git'
gem 'cryptocompare'
gem 'devise'
gem 'email_address'
gem 'feedjira'
gem 'friendly_id', '~> 5.2.1'
gem 'httparty'
gem 'kaminari'
gem 'ldclient-rb', '5.0.1'
gem 'lograge'
gem 'meta-tags'
gem 'nokogiri', '~> 1.8.1'
gem 'omniauth'
gem 'omniauth-twitter'
gem 'paper_trail'
gem 'pony'
gem 'rack-affiliates'
gem 'rack-cors'
gem 'rack-rewrite'
gem 'rest-client'
gem 'rollbar'
gem 'simple_form'
gem 'slim-rails'
gem 'unidecoder'
gem 'wombat'
gem 'twitter'
gem 'webpacker', '~> 3.3'
gem 'ransack'
gem 'active_hash'

# Devise needs to be in front of Ahoy in the Gemfile to have Ahoy automatically update Visit with User ID:
# https://github.com/ankane/ahoy/issues/12
gem 'ahoy_matey'
gem 'blazer'
gem 'ruby-progressbar'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '~> 2.13'
  gem 'dotenv-rails'
  gem 'pry-byebug'
  gem 'pry-rails'
  gem 'rubocop'
  gem 'reek'
  gem 'selenium-webdriver'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :production do
  gem 'rails_12factor'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]