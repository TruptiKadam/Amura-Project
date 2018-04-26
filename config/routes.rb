Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get '/auth/:provider/callback', to: 'sessions#create'
  get 'auth/failure', to: redirect('/')
  get 'repository', :to => 'repositories#show', as: 'repository'
  delete 'signout', to: 'sessions#destroy', as: 'signout'
  root to: 'sessions#new'
end
