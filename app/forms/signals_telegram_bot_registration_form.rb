class SignalsTelegramBotRegistrationForm < Patterns::Form
  REQUIRED_MIN_STAKED_TOKEN_AMOUNT = 20000
  param_key 'signals_telegram_bot'

  attribute :telegram_username
  attribute :chat_id
  attribute :started_at

  validates :telegram_username, presence: true
  validates :user, presence: true, :if => proc { |f| f.telegram_username.present? }
  validate :validate_user_staked_token_amount, :if => proc { |f| f.user.present? }
  validates :chat_id, presence: true
  validates :started_at, presence: true

  def persist
    user.token_sale[:signals_telegram_bot_chat_id] = chat_id
    user.token_sale[:signals_telegram_bot_started_at] = started_at
    user.save
  end

  protected

  def user
    @user ||= User.where("(token_sale->>'telegram_username') ILIKE ?", telegram_username).first
  end

  def validate_user_staked_token_amount
    staked_token_amount = user.token_sale.fetch('staked_token_amount', 0)
    if staked_token_amount < self.class::REQUIRED_MIN_STAKED_TOKEN_AMOUNT
      errors.add(
        :user,
        :min_staked_token_amount,
        message: "has not staked more than #{self.class::REQUIRED_MIN_STAKED_TOKEN_AMOUNT} tokens"
      )
    end
  end
end
