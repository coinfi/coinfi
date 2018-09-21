Rails.application.routes.draw do
  devise_for :users,
    path: '',
    path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register' }

  resources :author_profiles, only: %i[index show create update], path: 'authors'
  get '/calculators/:id', to: 'calculators#show'
  resources :coins, only: %i[index show]
  resources :contributor_submissions, path: 'contributor-submissions'
  resources :exchange_listings, only: :index, path: 'listings'
  resources :calendar_events, only: :index, path: 'calendar'
  get '/icos', to: redirect('/icos/upcoming')
  get '/icos(/:status)', to: 'icos#index'
  get '/news(/*others)', to: 'news#index'
  get '/news-beta', to: redirect('/', status: 302)
  get '/podcast', to: redirect('https://blog.coinfi.com/topics/podcast/', status: 302)
  get '/profile', to: 'users#edit'
  put '/profile', to: 'users#update'

  namespace :admin do
    resources :coins do
      get 'influencers', on: :collection
    end
    resources :news_items do
      get 'pending', on: :collection
      get 'tagged', on: :collection
    end
    resources :calendar_events
    resources :articles
    resources :users
    resources :submission_categories
    resources :contributor_submissions
    resources :countries
    resources :influencers
    get 'reddit' => 'articles#reddit'
    root to: 'coins#index'
  end

  namespace :api, constraints: { format: 'json' } do
    resources :calendar_events, only: %i[index]

    get '/coins/search', to: 'coins#search'
    get '/coins/search_by_params', to: 'coins#search_by_params'
    get '/coins/:id/news', to: 'coins#news'
    get '/coins/by-slug/:slug', to: 'coins#by_slug'
    resources :coins, only: %i[index show toplist watchlist] do
      get 'toplist', on: :collection
      get 'watchlist', on: :collection
    end

    namespace :watchlist do
      resources :coins, only: %i[index create destroy]
    end

    resources :exchange_listings, only: %i[index show]

    resources :news, only: %i[index show]
    resources :news_items, only: :index
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

  root to: 'pages#show'

  get '/signals', to: 'pages#signals_index'
  get '/:id', to: 'pages#show'

  mount Blazer::Engine, at: "blazer"
end
