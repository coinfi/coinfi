Rails.application.routes.draw do
  root 'pages#home'

  get '/' => 'pages#home', as: 'home'
  get '/daily' => 'pages#daily', as: 'daily'
  #get '/thanks' => 'pages#thanks', as: 'thanks'
  #get '/customize' => 'pages#customize', as: 'customize'
  # post '/subscribe'
  #post '/segment'
end
