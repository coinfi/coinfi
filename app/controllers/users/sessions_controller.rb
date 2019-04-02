class Users::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    respond_to do |format|
      format.html { super }
      format.json do
        self.resource = warden.authenticate(auth_options)
        if self.resource.present?
          sign_in(resource_name, resource)
          yield resource if block_given?
          render json: { token: form_authenticity_token }, content_type: 'application/json'
        else
          errors = []
          email = params[:user][:email].try(:downcase) if params[:user].present?
          user = User.find_by(email: email)
          if user.blank?
            errors << "Please sign up first."
          elsif !user.confirmed?
            errors << "Please verify your email address to activate your account."
          else
            errors << "The email address and password combination entered is incorrect. Please try again."
          end
          render json: { errors: errors }, status: 422, content_type: 'application/json'
        end
      end
    end
  end
end