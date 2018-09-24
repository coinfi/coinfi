class NewsCoinMention < ApplicationRecord
  belongs_to :coin
  belongs_to :news_item

  scope :human_tagged, -> { where(is_machine_tagged: false) }
  scope :machine_tagged, -> { where(is_machine_tagged: true) }
  scope :combo_tagged, -> {
    joins(
      <<-SQL
        LEFT OUTER JOIN (
              SELECT
                news_item_id
              FROM
                news_coin_mentions
              WHERE
                is_machine_tagged = false
              GROUP BY
                news_item_id
            ) human_tagged_news_coin_mentions ON
          human_tagged_news_coin_mentions.news_item_id = news_coin_mentions.news_item_id
      SQL
    )
    .where(
      <<-SQL
        ( human_tagged_news_coin_mentions.news_item_id = news_coin_mentions.news_item_id AND
          news_coin_mentions.is_machine_tagged = FALSE
        ) OR
        ( human_tagged_news_coin_mentions.news_item_id IS NULL AND
          news_coin_mentions.is_machine_tagged = TRUE
        )
      SQL
    )
  }

  def self.default_tagged
    case ENV.fetch('NEWS_COIN_MENTION_TAG_SCOPE')
    when 'human'
      self.human_tagged
    when 'machine'
      self.machine_tagged
    when 'combo'
      self.combo_tagged
    else
      raise "Invalid NEWS_COIN_MENTION_TAG_SCOPE environment variable"
    end
  end
end
