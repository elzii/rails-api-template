class User < ActiveRecord::Base

  # 
  # Sanitize
  # 
  before_save { self.email = email.downcase }
  
  #
  # Validation
  #
   
  # Name 
  validates :name,  presence: true, length: { maximum: 50 }

  # Email
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i
  validates :email, presence: true, format: { with: VALID_EMAIL_REGEX }, uniqueness: { case_sensitive: false }

  # Password
  has_secure_password
  validates :password, length: { minimum: 6 }

end
