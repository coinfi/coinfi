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
    resources :articles
    resources :users
    resources :submission_categories
    resources :contributor_submissions
    resources :countries
    resources :influencers
    get 'reddit' => 'articles#reddit'
    root to: "coins#index"
  end

  namespace :api, constraints: { format: 'json' } do
    namespace :watchlist do
      resources :coins, except: [ :edit, :update, :new ]
      patch '/coins', to: 'coins#reorder'
      resources :articles, only: [ :index ]
    end
    get '/coins', to: 'coins#index'
    get '/coins/:id/news', to: 'coins#news'
    get '/social_feeds/tweets_by_user', to: 'social_feeds#tweets_by_user'
  end

  resources :coins, only: [:index, :show]
  get '/icos(/:status)', to: 'icos#index'
  resources :contributor_submissions, path: 'contributor-submissions'
  get '/profile', to: 'author_profiles#edit', as: 'edit_author_profile'
  resources :author_profiles, only: [:index, :show, :create, :update], path: 'authors'

  namespace :webhooks do
    post "#{ENV.fetch('SUPERFEEDR_CALLBACK_URL_SEGMENT_SECRET')}-superfeedr-ingest", to: 'websubs#superfeedr_ingest'
  end

  root to: 'pages#show'
  get '/dashboard', to: redirect('/watchlist')
  get '/:id', to: 'pages#show'

  mount Blazer::Engine, at: "blazer"
end
