module SlackHelpers
  def fetch_slack_channel_from_env(env_var)
    # Don't worry about whether env var has hashtag; remove and add our own.
    '#' + ENV.fetch(env_var).gsub('#', '')
  end

  def send_slack_message(channel: nil, message: nil, markdown: true)
    raise ArgumentError, 'Slack channel is not set' unless channel.present?
    raise ArgumentError, 'Message is not set' unless message.present?
    slack_client.chat_postMessage(channel: channel, text: message, mrkdwn: markdown, as_user: true)
  end

  def slack_client
    @slack_helpers_slack_client ||= Slack::Web::Client.new
  end
end