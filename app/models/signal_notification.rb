class SignalNotification < ApplicationRecord
  belongs_to :user
  belongs_to :signal
end
