module Scrubbers
  class ArticleScrubber < Rails::Html::PermitScrubber
    def initialize
      super
      self.tags = Set.new(%w(table thead tbody tr th td ul ol li strong br div span p img))
      self.attributes = Set.new(%w(id class height width src alt title))
    end
  end
end