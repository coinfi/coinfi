json.extract! contributor_submission, :id, :user_id, :title, :summary, :content, :submission_category_id, :status, :disclosure, :created_at, :updated_at
json.url contributor_submission_url(contributor_submission, format: :json)
