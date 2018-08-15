Rails.application.routes.draw do
  devise_for :users,
    path: '',
    path_names: { sign_in: 'login', sign_out: 'logout', sign_up: 'register' }

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
    get '/user', to: 'user#show'
    patch '/user', to: 'user#update'
    resources :news, only: :index
    resources :news_items, only: :index
    namespace :newsfeed do
      resources :coins, only: %i[index]
    end
    resources :calendar_events, only: %i[index]
    get '/coins/search', to: 'coinsnew#search'
    resources :coinsnew, only: %i[index show]
    resources :coins, only: %i[index show toplist watchlist] do
      get 'toplist', on: :collection
      get 'watchlist', on: :collection
    end
    get '/coins/:id/news', to: 'coins#news'
    get '/social_feeds/tweets_by_user', to: 'social_feeds#tweets_by_user'
  end

  resources :coins, only: %i[index show]
  resources :coinsnew, only: %i[index show]
  get '/icos', to: redirect('/icos/upcoming')
  get '/icos(/:status)', to: 'icos#index'
  resources :contributor_submissions, path: 'contributor-submissions'
  get '/profile', to: 'author_profiles#edit', as: 'edit_author_profile'
  resources :author_profiles, only: %i[index show create update], path: 'authors'
  get '/news(/*others)', to: 'news#index'

  namespace :webhooks do
    post "#{ENV.fetch('SUPERFEEDR_CALLBACK_URL_SEGMENT_SECRET')}-superfeedr-ingest", to: 'websubs#superfeedr_ingest'
  end

  get '/calculators/:id', to: 'calculators#show'

  get '/podcast', to: redirect('https://blog.coinfi.com/topics/podcast/', status: 302)
  get '/news-beta', to: redirect('/', status: 302)

  root to: 'pages#show'
  get '/:id', to: 'pages#show'

  mount Blazer::Engine, at: "blazer"
end
