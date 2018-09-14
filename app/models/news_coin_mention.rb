class NewsCoinMention < ApplicationRecord
  belongs_to :coin
  belongs_to :news_item

  scope :human_tagged, -> { where(is_machine_tagged: false) }
  scope :machine_tagged, -> { where(is_machine_tagged: true) }
end
