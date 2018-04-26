class User < ApplicationRecord

	validates_presence_of :username, :uid, :email

  def self.create_from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |user|
      user.email = auth.info.email
      user.uid = auth.uid
      user.provider = auth.provider
      user.username = auth.info.name
      user.oauth_token = auth.credentials.token
      user.save!
    end
  end

end
