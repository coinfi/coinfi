# This is actually handled on production by config/puma.rb in the `on_worker_boot` section.
# This configuration is just for localhost development.
$launch_darkly = LaunchDarkly::LDClient.new(ENV.fetch("LAUNCHDARKLY_SDK_KEY"))
