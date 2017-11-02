class UsersController < ApplicationController
  layout 'gsdk'

  def token_sale
    @token_sale_details = current_user.token_sale || {}
  end

  def update
    return unless current_user
    current_user.token_sale = params[:user][:token_sale]
    current_user.save

    respond_to do |format|
      format.html { head :no_content }
      format.js
    end
  end
end
