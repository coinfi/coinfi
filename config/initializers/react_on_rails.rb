
require "browser"

# frozen_string_literal: true

# See https://github.com/shakacode/react_on_rails/blob/master/docs/basics/configuration.md
# for many more options.

module RenderingExtension
  # Return a Hash that contains custom values from the view context that will get passed to
  # all calls to react_component and redux_store for rendering
  def self.custom_context(view_context)
    if view_context.controller.is_a?(ActionMailer::Base)
      return {}
    end

    return {
      'deviceProviderProps': get_device_provider_props(view_context)
    }
  end

  private

  # Fallback device widths taken from most popular screen sizes by platform
  # see: http://gs.statcounter.com/screen-resolution-stats/tablet/worldwide
  def self.get_device_provider_props(view_context)
    browser = Browser.new(view_context.request.user_agent)

    default_props = {
      'breakpoints': {
        'm': 992,
      }
    }

    if browser.device.mobile?
      return default_props.merge({
        'fallback': {
          'width': 360,
          'height': 640,
        },
      })
    end

    return default_props.merge({
      'fallback': {
        'width': 1366,
        'height': 768,
      },
    })
  end
end


ReactOnRails.configure do |config|
  # Define the files for we need to check for webpack compilation when running tests
  config.webpack_generated_files = %w[
    app-bundle.js
    vendor-bundle.js vendor-bundle.css
    server-bundle.js
  ]

  # This configures the script to run to build the production assets by webpack. Set this to nil
  # if you don't want react_on_rails building this file for you.
  config.build_production_command = "yarn run build-webpack:production"

  config.rendering_extension = RenderingExtension

  ################################################################################
  ################################################################################
  # TEST CONFIGURATION OPTIONS
  # Below options are used with the use of this test helper:
  # ReactOnRails::TestHelper.configure_rspec_to_compile_assets(config)
  ################################################################################

  # If you are using this in your spec_helper.rb (or rails_helper.rb):
  #
  # ReactOnRails::TestHelper.configure_rspec_to_compile_assets(config)
  #
  # with rspec then this controls what yarn command is run
  # to automatically refresh your webpack assets on every test run.
  #
  config.build_test_command = "yarn run build-webpack:test"

  ################################################################################
  ################################################################################
  # SERVER RENDERING OPTIONS
  ################################################################################

  # This is the file used for server rendering of React when using `(prerender: true)`
  # If you are never using server rendering, you should set this to "".
  # Note, there is only one server bundle, unlike JavaScript where you want to minimize the size
  # of the JS sent to the client. For the server rendering, React on Rails creates a pool of
  # JavaScript execution instances which should handle any component requested.
  #
  # While you may configure this to be the same as your client bundle file, this file is typically
  # different. You should have ONE server bundle which can create all of your server rendered
  # React components.
  #
  config.server_bundle_js_file = "server-bundle.js"

  # Default is false. Can be overriden at the component level.
  # Set to false for debugging issues before turning on to true.
  config.prerender = false

  # If set to true, this forces Rails to reload the server bundle if it is modified
  config.development_mode = Rails.env.development?

  # For server rendering. This can be set to false so that server side messages are discarded.
  # Default is true. Be cautious about turning this off.
  config.replay_console = true

  # Default is true. Logs server rendering messages to Rails.logger.info
  config.logging_on_server = true

  # Change to true to raise exception on server if the JS code throws. Let's do this only if not
  # in production, as the JS code might still work on the client and we don't want to blow up the
  # whole Rails page.
  config.raise_on_prerender_error = !Rails.env.production?

  # Server rendering only (not for render_component helper)
  # You can configure your pool of JS virtual machines and specify where it should load code:
  # On MRI, use `therubyracer` for the best performance
  # (see [discussion](https://github.com/reactjs/react-rails/pull/290))
  # On MRI, you'll get a deadlock with `pool_size` > 1
  # If you're using JRuby, you can increase `pool_size` to have real multi-threaded rendering.
  config.server_renderer_pool_size = 1 # increase if you're on JRuby
  config.server_renderer_timeout = 20 # seconds

  ################################################################################
  # MISCELLANEOUS OPTIONS
  ################################################################################

  # This allows you to add additional values to the Rails Context. Implement one static method
  # called `custom_context(view_context)` and return a Hash.
  config.rendering_extension = RenderingExtension
end
