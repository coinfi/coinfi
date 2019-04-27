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
      return unless data.present?

      parsed_data = data.map do |weekly_data|
        timestamp = weekly_data[:week]
        commits = weekly_data[:total]
        {
          timestamp: timestamp,
          commits: commits,
        }
      end
    end

    def retrieve_code_frequency_data(repo_path)
      data = @client.code_frequency_stats repo_path
      return unless data.present?

      parsed_data = data.map do |weekly_data|
        {
          timestamp: weekly_data[0],
          additions: weekly_data[1],
          deletions: weekly_data[2],
        }
      end
    end

    def retrieve_repository_stats(repo_path)
      repository = @client.repo repo_path
      return unless repository.present?
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