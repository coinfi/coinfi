module CoinArticlesHelper
  def markdown(data)
    @markdown_html_renderer ||= Renderers::CoinArticleRenderer.new(
        filter_html: true,
        with_toc_data: true
      )
    @markdown_html ||= Redcarpet::Markdown.new(@markdown_html_renderer,
        autolink: true,
        tables: true,
        lax_spacing: true,
        space_after_headers: true
      )
    @markdown_html.render(data).html_safe
  end

  def markdown_toc(data)
    @markdown_toc_renderer ||= Redcarpet::Render::HTML_TOC.new(
      filter_html: true,
      with_toc_data: true,
      space_after_headers: true
    )
    @markdown_toc ||= Redcarpet::Markdown.new(@markdown_toc_renderer)
    @markdown_toc.render(data).html_safe
  end
end
