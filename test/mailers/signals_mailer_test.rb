require 'test_helper'

class SignalsMailerTest < ActionMailer::TestCase
  test "Password Notification" do
    email = SignalsMailer.password_notification('user@example.com', 'p@ssw0rd')

    # Send the email, then test that it got queued
    assert_emails 1 do
      email.deliver_now
    end

    # Test the body of the sent email contains what we expect it to
    assert_equal ['signals@coinfi.com'], email.from
    assert_equal ['user@example.com'], email.to
    assert_equal 'Password to your CoinFi account', email.subject
  end

  test "Staking Instructions" do
    #user = FactoryBot
    email = SignalsMailer.staking_instructions('user@example.com')

    # Send the email, then test that it got queued
    assert_emails 1 do
      email.deliver_now
    end

    # Test the body of the sent email contains what we expect it to
    assert_equal ['signals@coinfi.com'], email.from
    assert_equal ['user@example.com'], email.to
    assert_equal 'Password to your CoinFi account', email.subject
  end
end
