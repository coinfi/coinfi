class ContributorSubmission < ApplicationRecord
  belongs_to :user
  #belongs_to :submission_category

  enum status: {pending: 0, approved: 1, declined: 2}
end
