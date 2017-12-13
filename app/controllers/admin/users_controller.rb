module Admin
  class UsersController < Admin::ApplicationController
    def run_kyc
      user = User.find(params[:id])
      user.run_kyc!
      redirect_to admin_user_path(user), notice: "KYC rerun."
    end

    def update_kyc
      user = User.find(params[:id])
      user.update_kyc!
      redirect_to admin_user_path(user), notice: "KYC updated."
    end

    def toggle_referral_program
      user = User.find(params[:id])
      user.token_sale = {} if user.token_sale.nil?
      user.token_sale['referral_program'] = !!!user.token_sale['referral_program']
      if user.save
        redirect_to admin_user_path(user), notice: "User saved."
      else
        redirect_to admin_user_path(user), notice: "There was an error saving the user: #{user.errors.full_messages}"
      end
    end
  end
end
