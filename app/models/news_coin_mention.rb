class NewsCoinMention < ApplicationRecord
  belongs_to :coin
  belongs_to :news_item

  scope :human_tagged, -> { where("news_coin_mentions.is_machine_tagged = ?", false) }
  scope :machine_tagged, -> { where("news_coin_mentions.is_machine_tagged = ?", true) }
  scope :default_tagged, -> do
    case ENV.fetch('NEWS_COIN_MENTION_TAG_SCOPE')
    when 'human'
      self.human_tagged
    when 'machine'
      self.machine_tagged
    when 'combo'
      all
    else
      raise "Invalid NEWS_COIN_MENTION_TAG_SCOPE environment variable"
    end
  end
end
