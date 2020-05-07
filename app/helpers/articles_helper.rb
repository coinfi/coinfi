module ArticlesHelper
  EMPTY_STAR_ICON = 'fal fa-star'.freeze
  HALF_STAR_ICON = 'fas fa-star-half-alt'.freeze
  FULL_STAR_ICON = 'fas fa-star'.freeze

  def markdown(data)
    @markdown_html_renderer ||= Renderers::CoinArticleRenderer.new(
        filter_html: false,
        with_toc_data: true
      )
    @markdown_html ||= Redcarpet::Markdown.new(@markdown_html_renderer,
        autolink: true,
        tables: true,
        lax_spacing: true,
        space_after_headers: true
      )
    sanitized_data = sanitize_html(data)
    @markdown_html.render(sanitized_data).html_safe
  end

  def markdown_toc(data)
    @markdown_toc_renderer ||= Redcarpet::Render::HTML_TOC.new(
      filter_html: false,
      with_toc_data: true,
    )
    @markdown_toc ||= Redcarpet::Markdown.new(@markdown_toc_renderer)
    sanitized_data = sanitize_html(data)
    html_data = @markdown_toc.render(sanitized_data)

    fragment = Nokogiri::HTML::DocumentFragment.parse(html_data)

    if fragment.xpath('./li').present? || fragment.xpath('./ul').size > 1 # improper list
      # an improper list does not have a overall wrapping ul tag
      # thus we wrap all top-level lists in a list items, then wrap all list items in a list
      fragment.xpath('./ul').each do |node|
        node.replace('<li/>').first << node
      end

      new_parent_fragment = Nokogiri::HTML::DocumentFragment.parse('<ul/>')
      new_parent_fragment.child << fragment
      fragment = new_parent_fragment
    end

    fragment.to_html.html_safe
  end

  def amp_markdown(data)
    raw_html = markdown data
    parsed_html = Nokogiri::HTML::DocumentFragment.parse(raw_html)

    # Group nodes into accordion sections based on h2 tags
    stack = []
    current_container = nil
    parsed_html.children.each do |node|
      if node.name == "h2"
        section = Nokogiri::XML::Node.new "section", parsed_html
        section["id"] = "#{node.text.parameterize}-section"
        stack << section
        section.add_child node

        # amp accordion can only have two children (i.e., header/content)
        # all content must be children of the content child
        current_container = Nokogiri::XML::Node.new "div", parsed_html
        section.add_child current_container
      else
        # Handle case where there are nodes before the first H2
        # This section will be outside the accordion
        if current_container.blank?
          current_container = Nokogiri::XML::Node.new "section", parsed_html
          current_container["id"] = "top-section"
          current_container.add_class "p2"
          parsed_html.prepend_child current_container
        end

        current_container.add_child node
      end
    end

    accordion = Nokogiri::XML::Node.new "amp-accordion", parsed_html
    accordion["id"] = "content"
    accordion.set_attribute "expand-single-section", ""
    stack.each do |section|
      accordion.add_child section
    end

    parsed_html.add_child accordion
    # END grouping into accordion

    parsed_html.to_html.html_safe
  end

  def amp_markdown_toc(data)
    raw_html = markdown_toc data
    parsed_html = Nokogiri::HTML::DocumentFragment.parse(raw_html)
    parsed_html.xpath("ul/li").each do |li|
      anchor_nodes = li.css("a[href^='#']")
      anchor_text = anchor_nodes.first["href"].gsub("#", "")

      anchor_nodes.each do |node|
        node.set_attribute "on", "tap:content.expand(section=#{anchor_text}-section)"
      end
    end

    parsed_html.to_html.html_safe
  end

  def sanitize_html(raw_html)
    @html_sanitizer ||= Rails::Html::SafeListSanitizer.new
    @html_scrubber ||= Scrubbers::ArticleScrubber.new
    @html_sanitizer.sanitize(raw_html, scrubber: @html_scrubber)
  end

  def display_article_date(article)
    return "" unless article.present?

    if article.created_at == article.updated_at
      "Published: #{get_formatted_date(article.created_at)}"
    else
      "Last Updated: #{get_formatted_date(article.updated_at)}"
    end
  end

  def get_formatted_date(date)
    date.strftime('%B %-d, %Y')
  end

  def get_star_icons(rating, max_rating: 5)
    Array.new(max_rating, EMPTY_STAR_ICON)
      .fill(FULL_STAR_ICON, 0, rating)
  end
end
