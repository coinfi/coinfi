Rails.application.routes.draw do
  devise_scope :user do
    # TODO: (possibly)
    # I don't think anything but devise remappings should be
    # within devise_scope, eg. login, signup, etc, and most
    # of the UsersController doesn't need to inherit from
    # DeviseController. But I might be missing something. :)
    match "/signup" => "users#signup", as: "new_user_signup", via: [:get, :post]
    get "/register" => "users/registrations#new", as: "register"
    get "/set-password" => "users#set_password", as: "new_user_set_password"
    post "/submit-password" => "users#submit_password", as: "new_user_submit_password"
    get "/join-telegram" => "users#join_telegram", as: "new_user_join_telegram"
  end

  devise_for :users,
    controllers: {
      registrations: 'users/registrations',
      omniauth_callbacks: 'users/omniauth_callbacks'
    },
    path: '',
    path_names: { sign_in: 'login', sign_out: 'logout'}

  namespace :admin do
    resources :coins do
      get 'influencers', on: :collection
    end
    resources :news_items do
      get 'pending', on: :collection
      get 'tagged', on: :collection
    end
    resources :articles
    resources :users
    resources :submission_categories
    resources :contributor_submissions
    resources :countries
    resources :influencers
    get 'reddit' => 'articles#reddit'
    root to: 'coins#index'
    namespace :paper_trail do
      resources :versions, only: %i[index show]
    end
  end

  namespace :api, constraints: { format: 'json' } do
    get '/user', to: 'user#show'
    patch '/user', to: 'user#update'
    resources :news_items, only: %i[index]
    namespace :newsfeed do
      resources :coins, only: %i[index]
    end
    resources :coins, only: %i[index show]
    get '/coins/:id/news', to: 'coins#news'
    get '/social_feeds/tweets_by_user', to: 'social_feeds#tweets_by_user'
  end

  resources :coins, only: %i[index show]
  get '/icos(/:status)', to: 'icos#index'
  resources :contributor_submissions, path: 'contributor-submissions'
  get '/profile', to: 'author_profiles#edit', as: 'edit_author_profile'
  resources :author_profiles, only: %i[index show create update], path: 'authors'

  namespace :webhooks do
    post "#{ENV.fetch('SUPERFEEDR_CALLBACK_URL_SEGMENT_SECRET')}-superfeedr-ingest", to: 'websubs#superfeedr_ingest'
  end

  root to: 'pages#show'
  get '/:id', to: 'pages#show'

  mount Blazer::Engine, at: "blazer"
end
