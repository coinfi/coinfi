class SignalsTelegramSubscriptionRegistrationForm < Patterns::Form
  REQUIRED_MIN_STAKED_TOKEN_AMOUNT = 20000
  param_key 'signals_telegram_subscription'

  attribute :telegram_username
  attribute :telegram_chat_id
  attribute :started_at

  validates :telegram_username, presence: true
  validates :telegram_user, presence: true, :if => proc { |f| f.telegram_username.present? }
  validate :validate_telegram_user_staked_token_amount, :if => proc { |f| f.telegram_user.present? }
  validates :telegram_chat_id, presence: true
  validates :started_at, presence: true

  protected

  def telegram_user
    @telegram_user = @telegram_user || User.where('token_sale @> ?', { telegram_username: telegram_username }.to_json).first
  end

  def validate_telegram_user_staked_token_amount
    staked_token_amount = telegram_user.token_sale.fetch(:staked_token_amount, 0)
    if staked_token_amount < self.REQUIRED_MIN_STAKED_TOKEN_AMOUNT
      errors.add(
        :telegram_user,
        :min_staked_token_amount,
        message: "has not staked more than #{self.REQUIRED_MIN_STAKED_TOKEN_AMOUNT} tokens"
      )
    end
  end
end
