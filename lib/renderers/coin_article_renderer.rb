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
      link_host = get_host_from_url(link)
      link_host.present? && !is_whitelisted_host?(link_host)
    end

    def get_host_from_url(link)
      uri = URI.parse(link)
      host = uri.host
      host = "#{host}:#{uri.port}" if host.present? && uri.port.present? && uri.port != uri.default_port

      host.strip
    end

    def is_whitelisted_host?(host)
      host = host.downcase
      # host matches domain exactly or matches subdomain
      whitelisted_domains.any? {|domain| host == domain || host.rindex('.' + domain) != nil }
    end

    def whitelisted_domains
      @whitelisted_domains ||= [
        ENV['ROOT_DOMAIN'],
        *ENV.fetch('WHITELISTED_DOMAINS'){ '' }.split(',').map(&:strip)
      ].map(&:downcase)
    end
  end
end