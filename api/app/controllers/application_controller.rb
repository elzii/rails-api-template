class ApplicationController < ActionController::API

  #
  # Includes
  # 
  include ActionController::HttpAuthentication::Basic::ControllerMethods
  include ActionController::MimeResponds  

  # http_basic_authenticate_with :name => "admin", :password => "password"
  # respond_to :json

  


end
