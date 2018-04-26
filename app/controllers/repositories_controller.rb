class RepositoriesController < ApplicationController

  def show
    @repo = Github.new.repos.get current_user.username, params["repo_name"]
  end

end
