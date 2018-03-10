require "application_system_test_case"

class ContributorSubmissionsTest < ApplicationSystemTestCase
  test "can submit content" do
    visit root_path
    user = FactoryBot.create(:user)
    sign_in(user)

    click_link 'Contribute Content'
    fill_in 'Title', with: 'Content Title'
    fill_in 'Summary', with: 'Content Summary'
    fill_in 'Content', with: 'This Is The Content'
    fill_in 'Disclosure', with: 'Content Disclosure'
    click_button 'Submit Content'

    assert_content 'successfully created'
    assert_content 'Content Title'

    submission = ContributorSubmission.last
    visit contributor_submission_path(submission)

    assert_content 'Content Summary'
    assert_content 'Content Disclosure'
    assert_content 'This Is The Content'
  end
end
