module UrlHelper

  def url_exists? value, ssl = true
    url = URI.parse(value)
    req = Net::HTTP.new(url.host, url.port)
    req.use_ssl = true if ssl
    res = req.request_head(url.path)
    !["404"].include? res.code
  end

end