require 'test_helper'

class NewsItemRawTest < ActiveSupport::TestCase
  test 'dailyhodl `<li>` elements with `<i>` with no children are removed from `content`' do
    content_html = file_fixture("dailyhodl_content.html").read
    # Unfortunately implementation dependent. Seems to be something wrong with the input html that Nokogiri is fixing and causing a mismatch with expected html output.
    expected_content_html = Nokogiri::HTML::DocumentFragment.parse(file_fixture("dailyhodl_content_fixed.html").read).to_html()

    cleaned_content_html = NewsItemRaw.clean_content_html(content_html)

    assert_equal cleaned_content_html, expected_content_html
  end
end
