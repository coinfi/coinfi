module Renderers
  class CoinArticleRenderer < Redcarpet::Render::HTML
    def initialize(options={})
      @options = options
      super options
    end

    def link(link, title, content)
      additional_attrs = ""
      if title.present?
        additional_attrs += " title=\"#{title}\""
      end
      if @options.key?(:link_attributes)
        additional_attrs += " " + @options[:link_attributes].map{|k, v| " #{k}=\"#{v}\""}.join(' ')
      end

      "<a href=\"#{link}\"#{additional_attrs}>#{content}</a>"
    end
  end
end