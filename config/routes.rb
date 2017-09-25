Rails.application.routes.draw do
  namespace :admin do
    resources :coins
    resources :articles
    get 'reddit' => 'articles#reddit'
    root to: "coins#index"
  end

  root 'pages#home'

  get '/' => 'pages#home', as: 'home'
  get '/about' => 'pages#about'
  get '/contact' => 'pages#contact'
  get '/daily' => 'pages#daily', as: 'daily'
  get '/detect-whale-price-manipulation' => 'pages#detect_whale_price_manipulation'
  get '/predict-coins-about-to-moon' => 'pages#predict_coins'
  get '/find-relevant-news' => 'pages#find_relevant_news'
  get '/cloak-trading' => 'pages#cloak_trading'
  get '/identify-best-priced-exchange' => 'pages#identify_best_priced_exchange'
  get '/research-bad-actors' => 'pages#research_bad_actors'
  get '/facilitate-altcoin-coverage' => 'pages#facilitate_altcoin_coverage'
  #get '/thanks' => 'pages#thanks', as: 'thanks'
  #get '/customize' => 'pages#customize', as: 'customize'
  # post '/subscribe'
  #post '/segment'

  resources :coins, only: [:index, :show]

  get '/historical/:symbol' => 'data#historical'
end
