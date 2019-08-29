module CoinServices
  class RetrieveGitlabStats < Patterns::Service
    def initialize(coin: nil)
      @coin = coin
      @client_endpoint = ENV.fetch('GITLAB_API_ENDPOINT')
      @client_token = ENV.fetch('GITLAB_API_PRIVATE_TOKEN')

      @client = Gitlab.client(
        endpoint: @client_endpoint,
        private_token: @client_token,
        httparty: {
          read_timeout: 60
        }
      )
    end

    def call
      return unless @coin.has_git_repo? && @coin.git_repo_type == "gitlab"
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

        # if result[:code_frequency].blank?
        #   puts "No code frequency for #{coin_slug}"
        #   has_results = false
        # end

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
      data = @client.commits(repo_path, {per_page: 100}).auto_paginate
      return unless data.present?

      parsed_data = data.group_by_week { |c| c.committed_date }.map do |date, commit_list|
        timestamp = date.to_time.to_i
        commits = commit_list.size
        {
          timestamp: timestamp,
          commits: commits,
        }
      end
    end

    def retrieve_code_frequency_data(repo_path)
      # not implemented since not needed at this point
      # this can likely be retrieved using with_stats=true for commits
      nil
    end

    def retrieve_repository_stats(repo_path)
      repository = @client.project repo_path
      return unless repository.present?
      contributors = begin
        @client.get("/projects/#{@client.url_encode(repo_path)}/repository/contributors", {per_page: 100}).auto_paginate
      rescue Octokit::Unauthorized
        []
      end

      {
        watchers: repository.star_count, # no separate watchers for gitlab
        stargazers: repository.star_count,
        forks: repository.forks_count,
        contributors: contributors.length,
      }
    end
  end
end