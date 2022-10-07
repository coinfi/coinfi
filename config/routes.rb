Rails.application.routes.draw do
  constraints subdomain: 'blazer' do
    mount Blazer::Engine => '/'
  end

  constraints subdomain: 'pghero' do
    mount PgHero::Engine => '/'
  end

  require 'sidekiq/web'
  require 'sidekiq-scheduler/web'
  constraints subdomain: 'sidekiq' do
    Sidekiq::Web.use Rack::Auth::Basic do |username, password|
      # Protect against timing attacks:
      # - See https://codahale.com/a-lesson-in-timing-attacks/
      # - See https://thisdata.com/blog/timing-attacks-against-string-comparison/
      # - Use & (do not use &&) so that it doesn't short circuit.
      # - Use digests to stop length information leaking (see also ActiveSupport::SecurityUtils.variable_size_secure_compare)
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username), ::Digest::SHA256.hexdigest(ENV.fetch("SIDEKIQ_USERNAME"))) &
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password), ::Digest::SHA256.hexdigest(ENV.fetch("SIDEKIQ_PASSWORD")))
    end if Rails.env.production?
    mount Sidekiq::Web => '/'
  end

  devise_scope :user do
    patch '/verification', to: 'users/confirmations#update', as: :update_user_confirmation
  end
  devise_for :users,
    path: '',
    path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register', confirmation: 'verification' },
    controllers: { confirmations: 'users/confirmations', registrations: 'users/registrations',
                   omniauth_callbacks: 'users/omniauth_callbacks', sessions: 'users/sessions' }

  resources :author_profiles, only: %i[index show create update], path: 'authors'

  # HTML+AMP routes
  scope defaults: { format: 'html' }, constraints: lambda { |req| req.format == :html || req.format == :amp } do
    resources :coin_articles, only: %i[index show], path: 'how-to-buy-cryptocurrency'
  end

  # HTML only routes
  scope defaults: { format: 'html' }, constraints: { format: 'html' } do
    get '/calculators/:id', to: 'calculators#show', as: 'calculator'
    get '/coins/:id_or_slug', to: 'coins#show', as: 'coin'
    resources :coins, only: %i[index]
    resources :contributor_submissions, path: 'contributor-submissions'
    get '/cryptocurrency-exchanges/best-(:slug)-exchanges', to: 'exchange_categories#show', as: 'exchange_category'
    get '/cryptocurrency-exchanges/(:slug)-review', to: 'exchange_reviews#show', as: 'exchange_review'
    # get '/cryptocurrency-exchanges/(:slug)', to: 'cmc_exchanges#show', as: 'exchange'
    get '/indicators', to: 'indicators#show', as: 'indicators'
    # get '/icos', to: redirect('/icos/upcoming'), as: 'icos_root'
    # get '/icos(/:status)', to: 'icos#index', as: 'icos'
    get '/news/beta', to: static('/news-beta.html')
    get '/news/:id/:slug', to: 'news#show', as: 'news_item'
    get '/news/:coin_slug', to: 'news#coin_index', as: 'news_coin'
    get '/news', to: 'news#index'
    get '/podcast', to: redirect('https://www.coinfi.com/research/coinfi-podcast', status: 302), as: 'podcast'
    get '/profile', to: 'users#edit'
    put '/profile', to: 'users#update'
    # get '/token-metrics(/:metric_type_slug)', to: 'token_metrics#index', as: 'token_metrics'
  end

  get '/static/:type/:id', to: 'static#show', format: 'png'

  namespace :admin do
    resources :coins do
      get 'influencers', on: :collection
    end
    resources :news_items do
      get 'pending', on: :collection
      get 'tagged', on: :collection
    end
    resources :coin_articles
    resources :authors
    resources :cmc_exchanges
    resources :exchange_reviews
    resources :exchange_categories
    resources :exchange_review_categorizations
    resources :articles
    resources :users
    resources :submission_categories
    resources :contributor_submissions
    resources :countries
    resources :influencers
    resources :trading_signal_triggers
    get 'reddit' => 'articles#reddit'
    root to: 'coins#index'
  end

  namespace :api, constraints: { format: 'json' } do
    get '/coins/search', to: 'coins#search'
    get '/coins/search_by_params', to: 'coins#search_by_params'
    get '/coins/:id/news', to: 'coins#news'
    get '/coins/by-slug/:slug', to: 'coins#by_slug'
    get '/coins/prices', to: 'coins#prices'
    get '/coins/markets', to: 'coins#markets'
    resources :coins, only: %i[index show toplist watchlist dominance] do
      get 'toplist', on: :collection
      get 'watchlist', on: :collection
      get 'dominance', on: :collection
    end
    # get '/token-metrics(/:metric_type_slug)', to: 'token_metrics#index'
    get '/indicators/tickers', to: 'indicators#tickers'
    get '/indicators/overview/:tickers', to: 'indicators#overview'

    resources :currency, only: %i[index]

    namespace :signals do
      resources :coins, only: %i[show], param: :coin_key
      resources :trading_signal_triggers, only: %i[index show create]
      resources :trading_signals, only: %i[show create]
      resources :trading_signal_notifications, only: %i[show create]
      resources :signals_telegram_users, only: %i[index show], param: :telegram_id_or_username do
        get 'for_trading_signal_notifications', on: :collection
        post 'register', on: :collection

        resources :signals_telegram_subscriptions, param: :coin_symbol, only: %i[index show create destroy]
      end
    end

    namespace :watchlist do
      resources :coins, only: %i[index create destroy]
    end

    resources :news, only: %i[index show] do
      resources :news_vote, :path => 'vote', only: %i[index create]
    end
    namespace :newsfeed do
      resources :coins, only: %i[index]
    end

    get '/social_feeds/tweets_by_user', to: 'social_feeds#tweets_by_user'

    get '/user', to: 'user#show'
    patch '/user', to: 'user#update'
  end

  namespace :webhooks do
    post "#{ENV.fetch('SUPERFEEDR_CALLBACK_URL_SEGMENT_SECRET')}-superfeedr-ingest", to: 'websubs#superfeedr_ingest'
  end

  root to: 'home#index'
  get '/about', to: 'pages#show', id: 'about', as: 'page_about'
  get '/press', to: 'pages#show', id: 'press', as: 'page_press'
  get '/contact-us', to: 'pages#show', id: 'contact-us', as: 'page_contact_us'
  get '/ambassadors', to: 'pages#show', id: 'ambassadors', as: 'page_ambassadors'
  get '/win-cofi', to: 'pages#show', id: 'win-cofi', as: 'page_win_cofi'
  get '/privacy-policy', to: 'pages#show', id: 'privacy-policy', as: 'page_privacy'
  get '/unstake', to: 'pages#show', id: 'unstake', as: 'page_unstake'
  get '/signals', to: 'signals#index'
  get '/signals/reservation', to: redirect('/signals')
  patch '/signals/reservation', to: redirect('/signals')

  match '/404', :to => 'errors#not_found', :via => :all
  match '/500', :to => 'errors#internal_server_error', :via => :all
end
