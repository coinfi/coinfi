module CoinServices
  class RetrieveGithubStats < Patterns::Service
    def initialize(coin: nil)
      @coin = coin
      @client_id = ENV.fetch('GITHUB_OAUTH_APP_CLIENT_ID')
      @client_secret = ENV.fetch('GITHUB_OAUTH_APP_CLIENT_SECRET')

      @client = Octokit::Client.new(
        client_id: @client_id,
        client_secret: @client_secret,
        per_page: 100,
      )
      @client.auto_paginate = true
    end

    def call
      @github_repo = @coin.github_repo
      return unless @github_repo.present?

      commit_activity = retrieve_commit_activity_data(@github_repo)
      code_frequency = retrieve_code_frequency_data(@github_repo)
      snapshot = retrieve_repository_stats(@github_repo)

      {
        commit_activity: commit_activity,
        code_frequency: code_frequency,
        snapshot: snapshot,
      }
    end

    private

    def retrieve_commit_activity_data(repo_path)
      data = @client.commit_activity_stats repo_path
      return nil unless data.present?

      parsed_data = data.flat_map do |weekly_data|
        start_ts = weekly_data[:week]
        weekly_data[:days].map.with_index do |daily_data, index|
          timestamp = start_ts + index * 24 * 60 * 60 # i.e., day of week in seconds
          [timestamp, daily_data]
        end
      end
    end

    def retrieve_code_frequency_data(repo_path)
      data = @client.code_frequency_stats repo_path
      return nil unless data.present?

      additions = data.map do |weekly_data|
        [weekly_data[0], weekly_data[1]]
      end
      deletions = data.map do |weekly_data|
        [weekly_data[0], weekly_data[2]]
      end

      [additions, deletions]
    end

    def retrieve_repository_stats(repo_path)
      repository = @client.repo repo_path
      return nil unless repository.present?
      contributors = begin
        @client.contribs repo_path, true
      rescue Octokit::Unauthorized
        []
      end

      {
        watchers: repository[:subscribers_count],
        stargazers: repository[:stargazers_count],
        forks: repository[:forks_count],
        contributors: contributors.length,
      }
    end
  end
end