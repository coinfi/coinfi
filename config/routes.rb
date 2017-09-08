Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  namespace :admin do
    resources :coins
    resources :articles
    root to: "coins#index"
  end

  get '/', to: 'pages#home', as: 'user_root'
  root 'pages#home'

  get '/' => 'pages#home', as: 'home'
  get '/about' => 'pages#about'
  get '/contact' => 'pages#contact'
  get '/daily' => 'pages#daily', as: 'daily'
  #get '/thanks' => 'pages#thanks', as: 'thanks'
  #get '/customize' => 'pages#customize', as: 'customize'
  # post '/subscribe'
  #post '/segment'

  resources :coins, only: [:index, :show]

  get '/historical/:symbol' => 'data#historical'
end
