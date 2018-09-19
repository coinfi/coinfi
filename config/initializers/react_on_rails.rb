
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
        'ns': 480,
        'm': 992,
        'l': 1184
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

    if browser.device.tablet?
      return default_props.merge({
        'fallback': {
          'width': 1024,
          'height': 768,
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
  # This configures the script to run to build the production assets by webpack. Set this to nil
  # if you don't want react_on_rails building this file for you.
  config.build_production_command = "RAILS_ENV=production NODE_ENV=production bin/webpack"

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
  config.build_test_command = "RAILS_ENV=test bin/webpack"

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
  config.server_bundle_js_file = ""
end
