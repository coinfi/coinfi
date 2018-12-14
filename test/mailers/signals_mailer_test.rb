require 'test_helper'

class SignalsMailerTest < ActionMailer::TestCase
  test "Password Notification" do
    user = build(:user)
    email = SignalsMailer.password_notification(user, user.password)

    # Send the email, then test that it got queued
    assert_emails 1 do
      email.deliver_now
    end

    # Test the body of the sent email contains what we expect it to
    assert_equal ['signals@coinfi.com'], email.from
    assert_equal [user.email], email.to
    assert_equal 'Password to your CoinFi account', email.subject
    assert_match /#{user.password}/, email.body.raw_source
  end

  test "Staking Instructions" do
    user = build(:user, :with_token_sale)
    email = SignalsMailer.staking_instructions(user)

    # Send the email, then test that it got queued
    assert_emails 1 do
      email.deliver
    end

    # Test the body of the sent email contains what we expect it to
    assert_equal ['signals@coinfi.com'], email.from
    assert_equal [user.email], email.to
    assert_equal 'Finish signing up for the CoinFi Trading Signals beta', email.subject
  end
end
