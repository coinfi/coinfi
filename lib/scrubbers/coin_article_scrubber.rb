module Scrubbers
  class CoinArticleScrubber < Rails::Html::PermitScrubber
    def initialize
      super
      self.tags = Set.new(%w(table thead tbody tr th td ul ol li strong br div span p))
      self.attributes = Set.new(%w(id class))
    end
  end
end