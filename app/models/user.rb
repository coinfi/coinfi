class User < ApplicationRecord
  after_create :add_to_convertkit, :identify_in_launch_darkly

  has_many :news_items
  has_many :visits
  has_many :contributor_submissions
  has_one :author_profile, inverse_of: :user
  accepts_nested_attributes_for :author_profile
  has_one :watchlist, inverse_of: :user
  has_many :coins, through: :watchlist

  alias_method :submissions, :contributor_submissions

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  def self.find_for_oauth(auth)
    user = User.where(uid: auth.uid, provider: auth.provider).first

    unless user
      user = User.create(
        uid:      auth.uid,
        provider: auth.provider,
        email:    User.dummy_email(auth),
        password: Devise.friendly_token[0, 20]
      )
    end

    user
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

  def admin?
    role == 'admin' || role == 'superadmin'
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
    token_sale["id_doc_image"].sub("//#{ENV.fetch('S3_BUCKET')}.s3.amazonaws.com/", "") if token_sale["id_doc_image"]
  end

  def selfie_image_key
    token_sale["selfie_image"].sub("//#{ENV.fetch('S3_BUCKET')}.s3.amazonaws.com/", "") if token_sale["selfie_image"]
  end

  def approval_status
    token_sale["individual_risk_approval_status"] if token_sale["individual_risk_approval_status"]
  end

  def similarity_score
    token_sale["facial_recognition_similarity_score"] if token_sale["facial_recognition_similarity_score"]
  end

  def ethereum_address
    token_sale["ethereum_address"] if token_sale && token_sale["ethereum_address"]
  end

  def launch_darkly_hash
    {
      key: email,
      email: email,
      anonymous: false,
    }
  end

  def identify_in_launch_darkly
    $launch_darkly.identify(launch_darkly_hash)
  end

private

  def add_to_convertkit
    if Rails.env.production?
      Convertkit::Client.new.add_subscriber_to_form('267531', email)
    end
  end

  def self.dummy_email(auth)
    "#{auth.uid}-#{auth.provider}@example.com"
  end
end
