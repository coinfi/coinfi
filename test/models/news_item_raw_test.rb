require 'test_helper'

class NewsItemRawTest < ActiveSupport::TestCase
  test 'dailyhodl `<li>` elements with `<i>`` with no children are removed from `content`' do
    content_html_file = File.open("../fixtures/files/dailyhodl_content.html", "rb")
    content_html = content_html_file.read

    cleaned_content_html = NewsItemRaw.clean_content_html(content_html)
    # TODO: write asserts
  end
end
