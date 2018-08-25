class ModeAnalytics
  require 'digest'
  require 'openssl'

  def self.sign_url(url)
    request_type = 'GET'
    content_type = nil
    content_body = ''
    content_digest = Digest::MD5.base64digest(content_body)

    request_string = [request_type, content_type, content_digest, url, Time.now.to_i].join(',')

    digest = OpenSSL::Digest.new('sha256')
    signature = OpenSSL::HMAC.hexdigest(digest, ENV.fetch('MODE_ACCESS_SECRET'), request_string)

    signed_url = "#{url}&signature=#{signature}"
    signed_url
  end
end
