Octokit.configure do |c|
  c.connection_options = {
    request: {
      open_timeout: 60,
      timeout: 60
    }
  }
end