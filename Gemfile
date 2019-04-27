source 'https://rubygems.org'
ruby '2.4.1'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.6.2'
# Use postgresql as the database for Active Record
gem 'pg', '~> 0.18'
# Use Puma as the app server
gem 'puma', '~> 3.12'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '~> 4.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
gem 'redis', '~> 4.1'
gem 'hiredis'
gem 'redis-rails' # Remove when upgrading to Rails 5.2 since it is built-in
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

gem 'react_on_rails', '11.1.4'

gem 'active_hash'
gem 'acts-as-taggable-on'
gem 'administrate'
gem 'administrate-field-belongs_to_search'
gem 'administrate-field-json', github: 'eddietejeda/administrate-field-json'
gem 'administrate-field-nested_has_many', github: 'nickcharlton/administrate-field-nested_has_many'
gem 'aws-sdk', '~> 2'
gem 'blazer'
gem 'convertkit-ruby', require: 'convertkit', git: 'https://github.com/hanchang/convertkit-ruby.git'
gem 'devise', '>= 4.6.0'
gem 'distribute_reads'
gem 'feedjira'
# fog-aws is used by sitemap generator
gem 'fog-aws'
gem 'friendly_id', '~> 5.2.1'
gem 'httparty'
gem 'kaminari'
gem 'api-pagination'
gem 'lograge'
gem 'marginalia'
gem 'meta-tags'
gem 'nokogiri', '~> 1.8.1'
gem 'octokit', '~> 4.0'
gem 'omniauth'
gem 'omniauth-facebook'
gem 'omniauth-google-oauth2'
gem 'slack-ruby-client'
gem 'rack-affiliates'
gem 'rack-cors'
gem 'rack-rewrite'
gem 'ransack'
gem 'rollbar'
gem 'ruby-progressbar'
gem 'simple_form'
gem 'slim-rails'
gem 'strong_migrations'
gem 'unidecoder'
gem 'twitter'
gem 'webpacker', '~> 3.5'
# Used by ReactOnRails for rendering javascript
gem 'mini_racer', '~> 0.2.0', platforms: :ruby
# For parsing browser stats from user-agent
gem 'browser'
# Used to produce sitemap.xml
gem 'sitemap_generator'
# Library for Rails best practise patterns
# see https://medium.com/selleo/essential-rubyonrails-patterns-part-1-service-objects-1af9f9573ca1
gem "rails-patterns"
# EtherScan API client
gem 'etherscan_api', require: 'etherscan'
# Performance dashboard for Postgres
gem 'pghero'
# Job queue
gem 'sidekiq'
gem 'sidekiq-scheduler'
# App metrics and statistics
gem 'librato-rails', '~> 1'
# Ruby runtime metrics
gem 'barnes', '~> 0.0.7'
# Google Pub/Sub client
gem 'google-cloud-pubsub'
# technical indicators
gem "indicators", "~> 1.0", git: 'https://github.com/coinfi/indicators.git', :tag => 'v1.0.4'
gem "activerecord-import", "~> 0.27.0"
gem "active_record_upsert", "~> 0.9.4"
gem "acts_as_votable", "~> 0.12.0"

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
  gem 'selenium-webdriver', '>= 3.14.0'
  gem 'chromedriver-helper'
  gem 'factory_bot_rails'
  gem 'faker', :git => 'https://github.com/stympy/faker.git', :branch => 'master'
  gem 'minitest-stub_any_instance'
  gem 'database_cleaner'
  gem 'webmock'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'bullet'
  gem "letter_opener", "~> 1.7"
  gem 'derailed_benchmarks'
  gem 'stackprof'
end

group :production do
  gem 'rails_12factor'
  gem 'rack-attack'
  gem 'rack-timeout'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
