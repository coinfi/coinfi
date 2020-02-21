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
      if is_external_link?(link)
        additional_attrs += " target=\"_blank\" rel=\"nofollow noopener noreferrer\""
      end
      if @options.key?(:link_attributes)
        additional_attrs += " " + @options[:link_attributes].map{|k, v| " #{k}=\"#{v}\""}.join(' ')
      end

      "<a href=\"#{link}\"#{additional_attrs}>#{content}</a>"
    end

    private

    def is_external_link?(link)
      true unless ENV['ROOT_DOMAIN'].present?

      link_uri = URI.parse(link)
      link_host = link_uri.host
      if link_host.present? && link_uri.port.present?
        link_host = "#{link_host}:#{link_uri.port}"
      end
      link_host.present? && ENV['ROOT_DOMAIN'] != link_host
    end
  end
end