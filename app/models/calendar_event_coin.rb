class CalendarEventCoin < ApplicationRecord
  belongs_to :coin
  belongs_to :calendar_event
end
