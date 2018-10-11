Rails.application.routes.draw do
  devise_for :users,
    path: '',
    path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register' }

  resources :author_profiles, only: %i[index show create update], path: 'authors'
  get '/calculators/:id', to: 'calculators#show', as: 'calculator'
  get '/coins/:id_or_slug', to: 'coins#show', as: 'coin'
  resources :coins, only: %i[index]
  resources :contributor_submissions, path: 'contributor-submissions'
  resources :exchange_listings, only: :index, path: 'listings'
  resources :calendar_events, only: :index, path: 'calendar'
  get '/icos', to: redirect('/icos/upcoming'), as: 'icos_root'
  get '/icos(/:status)', to: 'icos#index', as: 'icos'
  get '/news/:id/:slug', to: 'news#show', as: 'news_item'
  get '/news/:coin_slug', to: 'news#coin_index', as: 'news_coin'
  get '/news', to: 'news#index'
  get '/news-beta', to: redirect('/', status: 302)
  get '/podcast', to: redirect('https://blog.coinfi.com/topics/podcast/', status: 302), as: 'podcast'
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

  root to: 'pages#show', id: 'home'
  get '/about', to: 'pages#show', id: 'about', as: 'page_about'
  get '/press', to: 'pages#show', id: 'press', as: 'page_press'
  get '/calendar', to: 'pages#show', id: 'calendar', as: 'page_calendar'
  get '/ambassadors', to: 'pages#show', id: 'ambassadors', as: 'page_ambassadors'
  get '/win-cofi', to: 'pages#show', id: 'win-cofi', as: 'page_win_cofi'
  get '/signals', to: 'pages#signals_index'
  get '/signals/reservation', to: 'pages#signals_reservation'

  mount Blazer::Engine, at: "blazer"
end
