require 'test_helper'
require 'faker'

class SignalsTelegramBot::RegistrationFormTest < ActiveSupport::TestCase
  setup do
    @telegram_username = Faker::Internet.username(specifier: nil, separators: %w(_))
    @default_form_params = {
      telegram_id: Faker::Number.number(digits: 9),
      telegram_username: @telegram_username,
      telegram_chat_id: Faker::Number.number(digits: 9),
      started_at: DateTime.now.iso8601,
    }

    @user = create(:user, token_sale: {
      telegram_username: @telegram_username,
      staked_cofi_amount: 20000,
    })
  end

  test 'valid' do
    form_params = @default_form_params
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    assert form.valid?
  end

  test 'creates SignalsTelegramUser on save' do
    form_params = @default_form_params
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    assert_difference 'SignalsTelegramUser.count', 1 do
      form.save!
    end
    assert_equal @default_form_params[:telegram_id], form.signals_telegram_user.telegram_id.to_i
    assert_equal @default_form_params[:telegram_username], form.signals_telegram_user.telegram_username
    assert_equal @default_form_params[:telegram_chat_id], form.signals_telegram_user.telegram_chat_id.to_i
    assert_equal DateTime.parse(@default_form_params[:started_at]), form.signals_telegram_user.started_at
  end

  test 'creates SignalsTelegramSubscriptions on save' do
    watchlist_item_count = 5
    watchlist_items = create_list(:watchlist_item, watchlist_item_count, watchlist: @user.watchlist)

    form_params = @default_form_params
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    assert_difference 'SignalsTelegramSubscription.count', watchlist_item_count do
      form.save!
    end
    assert_equal @user.watchlist.coins.order(:id), form.signals_telegram_user.subscribed_coins.order(:id)
  end

  test 'invalid with empty `telegram_id`' do
    form_params = @default_form_params.merge(telegram_id: nil)
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :telegram_id
  end

  test 'invalid with empty `telegram_username`' do
    form_params = @default_form_params.merge(telegram_username: nil)
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :telegram_username
  end

  test 'invalid with wrong `telegram_username`' do
    form_params = @default_form_params.merge(telegram_username: "not_#{@telegram_username}")
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :user
  end

  test 'invalid with empty `telegram_chat_id`' do
    form_params = @default_form_params.merge(telegram_chat_id: nil)
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :telegram_chat_id
  end

  test 'invalid with empty `started_at`' do
    form_params = @default_form_params.merge(started_at: nil)
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :started_at
  end

  test 'invalid with insufficient staked amount' do
    @user.update!(token_sale: @user.token_sale.merge(staked_cofi_amount: 1000))
    form_params = @default_form_params
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    refute form.valid?
    assert_includes form.errors.keys, :user
  end

  test 'valid with greater staked amount' do
    @user.update!(token_sale: @user.token_sale.merge(staked_cofi_amount: 40000))
    form_params = @default_form_params
    form = SignalsTelegramBot::RegistrationForm.new(form_params)

    assert form.valid?
  end
end
