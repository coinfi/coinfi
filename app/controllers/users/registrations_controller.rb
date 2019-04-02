class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    respond_to do |format|
      format.html { super }
      format.json do
        build_resource(sign_up_params)

        resource.save
        yield resource if block_given?
        if resource.persisted?
          if resource.active_for_authentication?
            sign_up(resource_name, resource)
            render json: { location: after_sign_up_path_for(resource) }
          else
            expire_data_after_sign_in!
            render json: { location: after_inactive_sign_up_path_for(resource) }
          end
        else
          clean_up_passwords resource
          set_minimum_password_length
          # Override with full error messages for JSON
          render json: { errors: resource.errors.full_messages }, status: 422
        end
      end
    end
  end
end