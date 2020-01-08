module CoinArticlesHelper
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
    @markdown_toc.render(sanitized_data).html_safe
  end

  def sanitize_html(raw_html)
    @html_sanitizer ||= Rails::Html::SafeListSanitizer.new
    @html_scrubber ||= Scrubbers::CoinArticleScrubber.new
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
end
