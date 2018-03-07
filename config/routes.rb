Rails.application.routes.draw do
  mount Blazer::Engine, at: "blazer"

  devise_scope :user do
    # TODO: (possibly)
    # I don't think anything but devise remappings should be 
    # within devise_scope, eg. login, signup, etc, and most 
    # of the UsersController doesn't need to inherit from
    # DeviseController. But I might be missing something. :)
    root to: "users#dashboard"
    get "/" => "users#dashboard", as: "dashboard"
    match "/signup" => "users#signup", as: "new_user_signup", via: [:get, :post]
    get "/register" => "users/registrations#new", as: "new_user_registration"
    get "/set-password" => "users#set_password", as: "new_user_set_password"
    post "/submit-password" => "users#submit_password", as: "new_user_submit_password"
    get "/estimate-contribution" => "users#estimate_contribution", as: "new_user_estimate_contribution"
    post "/submit-contribution" => "users#submit_contribution", as: "new_user_submit_contribution"
    get "/join-telegram" => "users#join_telegram", as: "new_user_join_telegram"
    get "/kyc", to: "users#kyc", as: "kyc"
    post "/kyc", to: "users#submit_kyc", as: "submit_kyc"
    post "/eth", to: "users#update_ethereum_address", as: "update_eth"
  end
  devise_for :users,
    controllers: {
      registrations: 'users/registrations',
      omniauth_callbacks: 'users/omniauth_callbacks'
    },
    path: '',
    path_names: { sign_in: 'login', sign_out: 'logout'}

  namespace :admin do
    resources :coins
    resources :articles
    resources :users
    resources :submission_categories
    resources :contributor_submissions
    post "users/:id/toggle_referral_program" => "users#toggle_referral_program", as: 'toggle_referral_program'
    post "users/:id/run_kyc" => "users#run_kyc", as: 'run_kyc'
    post "users/:id/update_kyc" => "users#update_kyc", as: 'update_kyc'
    get 'reddit' => 'articles#reddit'
    root to: "coins#index"
  end

  resources :coins, only: [:index, :show]

  resources :contributor_submissions, path: 'contributor-submissions'

  get '/historical/:symbol' => 'data#historical'

  scope "(:locale)", locale: /en|cn/ do
    get '/' => 'pages#home'
  end
end
