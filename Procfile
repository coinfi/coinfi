web: bundle exec puma -C config/puma.rb
worker: env MALLOC_ARENA_MAX=2 bundle exec sidekiq -e production -C config/sidekiq.yml