class NewsCoinMention < ApplicationRecord
  belongs_to :coin
  belongs_to :news_item
end
