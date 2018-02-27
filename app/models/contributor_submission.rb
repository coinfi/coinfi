class ContributorSubmission < ApplicationRecord
  belongs_to :user
  belongs_to :submission_category
end
