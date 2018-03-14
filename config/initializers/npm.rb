# Installs npm deps
system 'npm install' if Rails.env.development? || Rails.env.test?

