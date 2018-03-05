class User < ApplicationRecord
  attr_accessor :skip_password_validation

  has_many :visits
  has_many :contributor_submissions
  has_one :author_profile, inverse_of: :user
  accepts_nested_attributes_for :author_profile

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  def get_referrals
    User.where("token_sale ->> 'referred_by' = ?", self.id.to_s).order(created_at: :desc).select(:email, :created_at)
  end

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

  def run_kyc!
    s3 = Aws::S3::Client.new

    params = HashWithIndifferentAccess.new(
      token_sale.slice(*%w(first_name last_name date_of_birth gender nationality residency))
    )

    return false if params.values.any? { |x| x.blank? }

    begin
      response = Artemis.individual_risk(id, params)
      token_sale["individual_risk_api_response"] = response
      approval_status = Artemis.individual_risk_approval_status(response)
      token_sale["individual_risk_approval_status"] = approval_status
      save

      # Send photos to Artemis
      id_doc_string_io = s3.get_object(bucket: ENV.fetch('S3_BUCKET'), key: id_doc_image_key).body
      source_doc_id = Artemis.upload_individual_document(id, id_doc_string_io, id_doc_image_key)

      selfie_string_io = s3.get_object(bucket: ENV.fetch('S3_BUCKET'), key: selfie_image_key).body
      target_doc_id = Artemis.upload_individual_document(id, selfie_string_io, selfie_image_key)

      # Run documents through facial recognition
      response = Artemis.facial_recognition(id, source_doc_id, target_doc_id)
      token_sale["facial_recognition_api_response"] = response
      similarity_score = Artemis.facial_recognition_similarity_score(response)
      token_sale["facial_recognition_similarity_score"] = similarity_score

      # Run individual customer report
      token_sale["artemis_report"] = Artemis.individual_report(id)
      save
    rescue => e
      puts e
      save
    end
  end

  def update_kyc!
    begin
      token_sale["artemis_report"] = Artemis.check_status(id)
      save
    rescue => e
      puts e
      save
    end
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

  def rejected_residence?
    token_sale && Artemis.restricted_residencies.include?(token_sale["residency"])
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

protected

  def password_required?
    return false if skip_password_validation
    super
  end

private

  def self.dummy_email(auth)
    "#{auth.uid}-#{auth.provider}@example.com"
  end
end
