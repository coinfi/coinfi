module ApplicationHelper
  def nav_link(link_text, link_path, html_options)
    class_name = current_page?(link_path) ? ' b dark-gray' : ''

    link_to(link_text, link_path, html_options.merge({ class: class_name }) { |key, original, addition| original + addition })
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

end
