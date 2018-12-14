require "google/cloud/pubsub"

class PublishTradingSignalWorker
  include Sidekiq::Worker

  def perform(trading_signal)
    pubsub = Google::Cloud::Pubsub.new(
      project_id: ENV.fetch("GOOGLE_PROJECT_ID"),
      credentials: JSON.parse(ENV.fetch("GOOGLE_CREDENTIALS_JSON"))
    )

    # Retrieve a topic
    topic_name = ENV.fetch("GOOGLE_PUBSUB_TRADING_SIGNALS_TOPIC_NAME")
    topic = pubsub.topic(topic_name)

    # Publish a new pubsub message
    pubsub_message_data = trading_signal.as_dto.to_json
    pubsub_message = topic.publish(pubsub_message_data)
  end
end
