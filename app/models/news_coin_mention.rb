class NewsCoinMention < ApplicationRecord
  belongs_to :coin
  belongs_to :news_item

  scope :human_tagged, -> { where(is_machine_tagged: false) }
  scope :machine_tagged, -> { where(is_machine_tagged: true) }

  def self.default_tagged
    case ENV.fetch('NEWS_COIN_MENTION_TAG_SCOPE')
    when 'human'
      self.human_tagged
    when 'machine'
      self.machine_tagged
    when 'combo'
      self.human_tagged.or(self.machine_tagged)
    else
      raise "Invalid NEWS_COIN_MENTION_TAG_SCOPE environment variable"
    end
  end
end
