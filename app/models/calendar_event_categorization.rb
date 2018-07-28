class CalendarEventCategorization < ApplicationRecord
  belongs_to :news_category
  belongs_to :calendar_event
end
