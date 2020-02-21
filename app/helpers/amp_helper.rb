module AmpHelper
  def convert_to_amp_html(raw_html)
    parsed_html = Nokogiri::HTML::DocumentFragment.parse(raw_html)

    if is_fragment_text_only?(parsed_html)
      parsed_html = format_plain_text_fragment(parsed_html)
    else
      parsed_html = convert_img_tags(parsed_html)
      parsed_html = handle_paragraph_padding(parsed_html)
    end

    parsed_html.to_html.html_safe
  end

  private

  def is_fragment_text_only?(nokogiri_fragment)
    nokogiri_fragment.child.text?
  end

  def format_plain_text_fragment(nokogiri_fragment)
    nokogiri_fragment.children.each do |child|
      child_paragraphs = child.to_s.lines.map {|p| "<p>#{p}</p>"}
      parsed_child_paragraphs = Nokogiri::HTML::DocumentFragment.parse(child_paragraphs.join)
      child.replace(parsed_child_paragraphs)
    end

    nokogiri_fragment
  end

  def convert_img_tags(nokogiri_fragment)
    nokogiri_fragment.css("img").each do |tag|
      tag.name = "amp-img"
      if tag.key?('width') and tag.key?('height')
        tag.set_attribute "layout", "responsive"
      else # add responsive container if image doesn't have width and height
        tag.add_class "contain"
        tag.set_attribute "layout", "fill"
        tag.replace("<div class=\"fixed-height-container\">#{tag.to_html}</div>")
      end
    end

    nokogiri_fragment
  end

  def handle_paragraph_padding(nokogiri_fragment)
    nokogiri_fragment.css("p.p1").each do |tag|
      tag.remove_class "p1"
    end

    nokogiri_fragment
  end
end