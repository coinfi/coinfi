module CoinServices
  class RetrieveGithubStats < Patterns::Service
    def initialize(coin: nil)
      @coin = coin
      @client_token = ENV.fetch('GITHUB_OAUTH_PERSONAL_ACCESS_TOKEN')

      @client = Octokit::Client.new(
        access_token: @client_token,
        per_page: 100,
      )
      @client.auto_paginate = true
    end

    def call
      return unless @coin.has_github?
      @git_repo = @coin.git_repo

      commit_activity = retrieve_commit_activity_data(@git_repo)
      code_frequency = retrieve_code_frequency_data(@git_repo)
      snapshot = retrieve_repository_stats(@git_repo)
      result = {
        commit_activity: commit_activity,
        code_frequency: code_frequency,
        snapshot: snapshot,
      }

      check_result(result) ? result : nil
    end

    private

    def check_result(result)
      # Perform all possible checks to get a better sense of what is failing
      has_results = true
      coin_slug = @coin.slug

      if result.blank?
        puts "No results for #{coin_slug}"
        has_results = false
      else
        if result[:commit_activity].blank?
          puts "No commit activity for #{coin_slug}"
          has_results = false
        end

        if result[:code_frequency].blank?
          puts "No code frequency for #{coin_slug}"
          has_results = false
        end

        if result[:snapshot].blank?
          puts "No snapshot for #{coin_slug}"
          has_results = false
        elsif !has_stats?(result[:snapshot])
          puts "Incomplete snapshot for #{coin_slug}"
          has_results = false
        end
      end

      has_results
    end

    def has_stats?(snapshot)
      # Perform all possible checks to get a better sense of what is failing
      has_stats = true
      coin_slug = @coin.slug

      if snapshot[:watchers].blank?
        puts "No watchers for #{coin_slug}"
        has_stats = false
      end

      if snapshot[:stargazers].blank?
        puts "No stars for #{coin_slug}"
        has_stats = false
      end

      if snapshot[:forks].blank?
        puts "No forks for #{coin_slug}"
        has_stats = false
      end

      if snapshot[:contributors].blank?
        puts "No contributors for #{coin_slug}"
        has_stats = false
      end

      has_stats
    end

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