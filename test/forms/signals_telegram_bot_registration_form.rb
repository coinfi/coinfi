require 'test_helper'
require 'faker'

class SignalsTelegramBotRegistrationFormTest < ActiveSupport::TestCase
  setup do
    @telegram_username = Faker::Internet.username
    @default_form_params = {
      telegram_username: @telegram_username,
      chat_id: Faker::Number.number(10),
      started_at: DateTime.now.iso8601,
    }

    @user = create(:user, token_sale: {
      telegram_username: @telegram_username,
      staked_cofi_amount: 20000,
    })
  end

  test 'valid' do
    form_params = @default_form_params
    form = SignalsTelegramBotRegistrationForm.new(form_params)

    assert form.valid?
  end

  test 'updates `token_sale` attributes on save' do
    form_params = @default_form_params
    form = SignalsTelegramBotRegistrationForm.new(form_params)

    expected_token_sale = @user.token_sale
      .merge(
        signals_telegram_bot_chat_id: @default_form_params[:chat_id],
        signals_telegram_bot_started_at: @default_form_params[:started_at],
      )
      .stringify_keys

    form.save!
    @user.reload

    assert_equal @user.token_sale, expected_token_sale
  end

  test 'invalid with empty `username`' do
    form_params = @default_form_params.merge(telegram_username: nil)
    form = SignalsTelegramBotRegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :telegram_username
  end

  test 'invalid with wrong `username`' do
    form_params = @default_form_params.merge(telegram_username: "not_#{@telegram_username}")
    form = SignalsTelegramBotRegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :user
  end

  test 'invalid with empty `chat_id`' do
    form_params = @default_form_params.merge(chat_id: nil)
    form = SignalsTelegramBotRegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :chat_id
  end

  test 'invalid with empty `started_at`' do
    form_params = @default_form_params.merge(started_at: nil)
    form = SignalsTelegramBotRegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :started_at
  end

  test 'invalid with insufficient staked amount' do
    @user.update!(token_sale: @user.token_sale.merge(staked_cofi_amount: 1000))
    form_params = @default_form_params
    form = SignalsTelegramBotRegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :user
  end

  test 'valid with greater staked amount' do
    @user.update!(token_sale: @user.token_sale.merge(staked_cofi_amount: 40000))
    form_params = @default_form_params
    form = SignalsTelegramBotRegistrationForm.new(form_params)

    assert form.valid?
  end
end
