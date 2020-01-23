class User < ApplicationRecord
  acts_as_voter
  after_create :add_to_sendy

  has_many :news_items
  has_many :visits
  has_many :contributor_submissions
  has_one :author_profile, inverse_of: :user
  accepts_nested_attributes_for :author_profile
  has_one :watchlist, inverse_of: :user
  has_many :coins, through: :watchlist
  has_many :staked_cofi_transactions
  has_many :confirmed_staked_cofi_transactions, -> { StakedCofiTransaction.confirmed }, class_name: 'StakedCofiTransaction'
  has_one :signals_telegram_user

  validates :default_currency, presence: false, length: { is: 3 }, allow_nil: true

  alias_method :submissions, :contributor_submissions

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable
  devise :database_authenticatable, :registerable, :confirmable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, omniauth_providers: %i[facebook google_oauth2]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      # If you are using confirmable and the provider(s) you use validate emails,
      # uncomment the line below to skip the confirmation emails.
      user.skip_confirmation!
    end
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

  # Lazy-create the watchlist association
  def watchlist
    super || self.create_watchlist
  end

  def admin?
    role == 'admin' || role == 'superadmin'
  end

  def superadmin?
    role == 'superadmin'
  end

  def get_referrals
    User.where("token_sale ->> 'referred_by' = ?", self.id.to_s).order(created_at: :desc).select(:email, :created_at)
  end

  def in_referral_program?
    token_sale && token_sale["referral_program"].present?
  end

  def kyc_completed?
    token_sale && token_sale["ethereum_address"].present?
  end

  def kyc_result_cleared?
    token_sale && token_sale["artemis_report"] && token_sale["artemis_report"].in?(["CLEARED", "ACCEPTED"])
  end

  def waitlisted?
    token_sale && token_sale["waitlisted"].present?
  end

  def id_doc_image_key
    token_sale["id_doc_image"].sub("//#{ENV.fetch('S3_BUCKET')}.s3.amazonaws.com/", "") if token_sale && token_sale["id_doc_image"]
  end

  def selfie_image_key
    token_sale["selfie_image"].sub("//#{ENV.fetch('S3_BUCKET')}.s3.amazonaws.com/", "") if token_sale && token_sale["selfie_image"]
  end

  def approval_status
    token_sale["individual_risk_approval_status"] if token_sale && token_sale["individual_risk_approval_status"]
  end

  def similarity_score
    token_sale["facial_recognition_similarity_score"] if token_sale && token_sale["facial_recognition_similarity_score"]
  end

  def ethereum_address
    token_sale["ethereum_address"] if token_sale && token_sale["ethereum_address"]
  end

  def theme
    token_sale["theme"] if token_sale && token_sale["theme"]
  end

  def set_theme(theme)
    if ['light', 'dark'].any? {|type| type == theme}
      self.token_sale = {} if self.token_sale.nil?
      self.token_sale["theme"] = theme
      self.save
    end
  end

  def trading_view
    token_sale && token_sale["default_trading_view"].presence || false
  end

  def set_default_to_trading_view(default_setting)
    self.token_sale = {} if self.token_sale.nil?
    self.token_sale["default_trading_view"] = !!default_setting
    self.save
  end

  # Returns number of staked COFI tokens
  # Uses the value in `token_sale` first otherwise fallback onto looking up transactions
  def staked_cofi_amount
    # Get the manually set amount
    manual_amount = self.token_sale.fetch('staked_cofi_amount', nil)
    return manual_amount unless manual_amount.nil?

    # Calculate the amount from the sum of all `staked_cofi_transactions`
    calculated_amount = 0
    self.confirmed_staked_cofi_transactions.find_each do |transaction|
      calculated_amount += transaction.txn_quantity
    end
    calculated_amount
  end

  # https://github.com/plataformatec/devise/wiki/How-To:-Override-confirmations-so-users-can-pick-their-own-passwords-as-part-of-confirmation-activation
  def password_required?
    # Password is required if it is being set, but not for new records
    if !persisted?
      false
    else
      !password.nil? || !password_confirmation.nil?
    end
  end

  def password_match?
    self.errors[:password] << I18n.t('errors.messages.blank') if password.blank?
    self.errors[:password_confirmation] << I18n.t('errors.messages.blank') if password_confirmation.blank?
    self.errors[:password_confirmation] << I18n.translate("errors.messages.confirmation", attribute: "password") if password != password_confirmation
    password == password_confirmation && !password.blank?
  end

  # new function to set the password without knowing the current
  # password used in our confirmation controller.
  def attempt_set_password(params)
    p = {}
    p[:password] = params[:password]
    p[:password_confirmation] = params[:password_confirmation]
    update_attributes(p)
  end

  # new function to return whether a password has been set
  def has_no_password?
    self.encrypted_password.blank?
  end

  # Devise::Models:unless_confirmed` method doesn't exist in Devise 2.0.0 anymore.
  # Instead you should use `pending_any_confirmation`.
  def only_if_unconfirmed
    pending_any_confirmation {yield}
  end

  private

  def add_to_sendy
    if Rails.env.production?
      Sendy::Subscribe.call(email)
    end
  end

  def self.dummy_email(auth)
    "#{auth.uid}-#{auth.provider}@example.com"
  end
end
