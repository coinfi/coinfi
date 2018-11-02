require 'test_helper'

class SendSignalsStakingConfirmationEmailsServiceTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  test 'emails do not send when users that started the reservation form' do
    users = create_list(:user, 2, :with_started_signals_reservation)

    assert_enqueued_jobs 0 do
      send_emails_service = SendSignalsStakingConfirmationEmailsService.call
      assert_equal [], send_emails_service.users_sent
    end
  end

  test 'emails do not send when users that completed the reservation form' do
    users = create_list(:user, 2, :with_completed_signals_reservation)

    assert_enqueued_jobs 0 do
      send_emails_service = SendSignalsStakingConfirmationEmailsService.call
      assert_equal [], send_emails_service.users_sent
    end
  end

  test 'emails send when users that completed the reservation form and have staked tokens' do
    users = create_list(:user, 2, :with_transferred_signals_reservation)

    assert_enqueued_jobs 2 do
      send_emails_service = SendSignalsStakingConfirmationEmailsService.call
      assert_equal users, send_emails_service.users_sent
    end
  end

  test 'emails do not send again' do
    users = create_list(:user, 2, :with_transferred_signals_reservation)

    assert_enqueued_jobs 2 do
      send_emails_service_1 = SendSignalsStakingConfirmationEmailsService.call
      assert_equal users, send_emails_service_1.users_sent
    end
    assert_enqueued_jobs 0 do
      send_emails_service_2 = SendSignalsStakingConfirmationEmailsService.call
      assert_equal [], send_emails_service_2.users_sent
    end
  end

  test 'emails do not send when users that confirmed the reservation' do
    users = create_list(:user, 2, :with_confirmed_signals_reservation)

    assert_enqueued_jobs 0 do
      send_emails_service = SendSignalsStakingConfirmationEmailsService.call
      assert_equal [], send_emails_service.users_sent
    end
  end
end
