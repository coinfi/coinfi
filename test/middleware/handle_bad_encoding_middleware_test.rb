require 'test_helper'

class HandleBadEncodingMiddlewareTest < ActiveSupport::TestCase
  setup do
    app = lambda {|env| [200, env, "app"] }
    @middleware = HandleBadEncodingMiddleware.new(app)
  end

  test "request with query string is unchanged" do
    query_string = "q=valid"
    req = Rack::MockRequest.env_for("/", "QUERY_STRING" => query_string)
    code, env = @middleware.call(req)

    assert_equal code, 200
    assert_equal env['QUERY_STRING'], query_string
  end

  test "request with no query string is unchanged" do
    req = Rack::MockRequest.env_for("/")
    code, env = @middleware.call(req)

    assert_equal code, 200
    assert_equal env['QUERY_STRING'], ""
  end

  test "request with invalid encoding in query string drops query string" do
    query_string = "q=%2Fsearch%2Fall%Forder%3Ddescending%26page%3D5%26sort%3Dcreated_at"
    req = Rack::MockRequest.env_for("/", "QUERY_STRING" => query_string)
    code, env = @middleware.call(req)

    assert_equal code, 200
    assert_equal env['QUERY_STRING'], ""
  end
end
