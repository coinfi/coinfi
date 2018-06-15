# config/initializers/assets.rb
Rails.application.config.assets.precompile += %w(administrate_overrides.css)
Administrate::Engine.add_stylesheet('administrate_overrides')
