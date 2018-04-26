class SessionsController < ApplicationController
  def new
    if current_user
      get_user_repositories
    end
  end

  def create
    user = User.create_from_omniauth(request.env["omniauth.auth"])

    if user.valid?
      session[:user_id] = user.id
      redirect_to root_url, :notice => "Signed in!"
    end
  end

  def destroy
    reset_session
    redirect_to root_url, :notice => "Signed out!"
  end

  private

  def get_user_repositories
    @repositories = Github.repos.list user: current_user.username
  end

end
