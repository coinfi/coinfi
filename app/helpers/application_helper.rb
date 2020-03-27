module ApplicationHelper
  def is_production?
    ENV["IS_PRODUCTION"] == "true"
  end

  def nav_link(link_text, link_path, html_options = {})
    klass = html_options[:class] || ''
    klass += ' active' if current_page?(link_path)
    html_options[:class] = klass
    link_to(link_text, link_path, html_options)
  end

  def natural_format(pee, br = true)
    # Taken from https://github.com/jekyll/jekyll-import/blob/master/lib/jekyll-import/util.rb
    return '' if pee.strip == ''

    allblocks = '(?:table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|option|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|noscript|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)'
    pre_tags = {}
    pee = pee + "\n"

    if pee.include?('<pre')
      pee_parts = pee.split('</pre>')
      last_pee = pee_parts.pop
      pee = ''
      pee_parts.each_with_index do |pee_part, i|
        start = pee_part.index('<pre')

        unless start
          pee += pee_part
          next
        end

        name = "<pre wp-pre-tag-#{i}></pre>"
        pre_tags[name] = pee_part[start..-1] + '</pre>'

        pee += pee_part[0, start] + name
      end
      pee += last_pee
    end

    pee = pee.gsub(Regexp.new('<br />\s*<br />'), "\n\n")
    pee = pee.gsub(Regexp.new("(<" + allblocks + "[^>]*>)"), "\n\\1")
    pee = pee.gsub(Regexp.new("(</" + allblocks + ">)"), "\\1\n\n")
    pee = pee.gsub("\r\n", "\n").gsub("\r", "\n")
    if pee.include? '<object'
      pee = pee.gsub(Regexp.new('\s*<param([^>]*)>\s*'), "<param\\1>")
      pee = pee.gsub(Regexp.new('\s*</embed>\s*'), '</embed>')
    end

    pees = pee.split(/\n\s*\n/).compact
    pee = ''
    pees.each { |tinkle| pee += '<p>' + tinkle.chomp("\n") + "</p>\n" }
    pee = pee.gsub(Regexp.new('<p>\s*</p>'), '')
    pee = pee.gsub(Regexp.new('<p>([^<]+)</(div|address|form)>'), "<p>\\1</p></\\2>")
    pee = pee.gsub(Regexp.new('<p>\s*(</?' + allblocks + '[^>]*>)\s*</p>'), "\\1")
    pee = pee.gsub(Regexp.new('<p>(<li.+?)</p>'), "\\1")
    pee = pee.gsub(Regexp.new('<p><blockquote([^>]*)>', 'i'), "<blockquote\\1><p>")
    pee = pee.gsub('</blockquote></p>', '</p></blockquote>')
    pee = pee.gsub(Regexp.new('<p>\s*(</?' + allblocks + '[^>]*>)'), "\\1")
    pee = pee.gsub(Regexp.new('(</?' + allblocks + '[^>]*>)\s*</p>'), "\\1")
    if br
      pee = pee.gsub(Regexp.new('<(script|style).*?</\1>')) { |match| match.gsub("\n", "<WPPreserveNewline />") }
      pee = pee.gsub(Regexp.new('(?<!<br />)\s*\n'), "<br />\n")
      pee = pee.gsub('<WPPreserveNewline />', "\n")
    end
    pee = pee.gsub(Regexp.new('(</?' + allblocks + '[^>]*>)\s*<br />'), "\\1")
    pee = pee.gsub(Regexp.new('<br />(\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)'), "\\1")
    pee = pee.gsub(Regexp.new('\n</p>$'), '</p>')

    pre_tags.each do |name, value|
      pee.gsub!(name, value)
    end
    pee
  end

  def pretty_date(date)
    return "Unknown" unless date
    date = Time.at(date) if date.is_a? Integer
    d = date.strftime('%A, %B %e, %Y - %H:%M%p')
    return d.split(' -')[0] if d.include? '00:00'
    d
  end

  def flash_messages
    flash.map do |type, text|
      { id: text.object_id, type: type, text: text }
    end
  end

  # Renders a react component and update `@jss_server_side_css` with css. Should be used in place of
  # `react_component` for components that return hashes with `componentHtml` and `componentCss`
  def react_component_with_jss(component_name, options = {})
    new_options = options.deep_merge(props: { stylesNamespace: component_name })

    unless options[:prerender]
      return react_component(component_name, new_options)
    end

    component_hash = react_component_hash(component_name, new_options)
    component_html = component_hash['componentHtml']
    component_css = component_hash['componentCss']
    component_styles_namespace = component_hash['componentStylesNamespace']

    # `componentCss` should include the combined css of all the rendered components so we only need
    # to store one copy of this
    @jss_server_side_css ||= {}
    @jss_server_side_css[component_styles_namespace] = component_css

    return component_html
  end

  def jsonld_tag
    if @jsonld_data.present?
      return "<script type=\"application/ld+json\">#{@jsonld_data}</script>".html_safe
    end
  end

  def get_inline_asset(asset_path)
    asset = Rails.application.assets_manifest.find_sources(asset_path).first
    if asset.present?
      asset.to_s.html_safe
    else
      ""
    end
  end
end
