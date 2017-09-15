module Admin
  class ArticlesController < Admin::ApplicationController
    # To customize the behavior of this controller,
    # you can overwrite any of the RESTful actions. For example:
    #
    # def index
    #   super
    #   @resources = Article.
    #     page(params[:page]).
    #     per(10)
    # end

    # Define a custom finder by overriding the `find_resource` method:
    # def find_resource(param)
    #   Article.find_by!(slug: param)
    # end

    # See https://administrate-prototype.herokuapp.com/customizing_controller_actions
    # for more information
    def reddit
      if params[:subReddit].present?
        before = params[:endDate].to_datetime.to_i
        after = params[:startDate].to_datetime.to_i

        # Old API Endpoints, doesn't have historical data...
        #base_url = "https://api.pushshift.io/reddit/search/submission/"
        #arguments = "?subreddit=#{params[:subReddit]}&before=#{before}&after=#{after}&sort=desc&sort_type=score&limit=#{params[:limit]}&fields=title,url,score,selftext,retrieved_on"

        # Optional args
        title = params[:title].present? ? "title:#{params[:title]} AND " : ""
        domain = params[:domain].present? ? "domain:#{params[:domain]} AND " : ""

        # Documentation for endpoint at
        # https://www.reddit.com/r/redditdev/comments/64cs5u/new_pushshift_api_endpoint_all_reddit_submissions/
        base_url = "https://elastic.pushshift.io/rs/submissions/_search/"
        query = "?q=(#{title}#{domain}subreddit:#{params[:subReddit]} AND created_utc:>#{after} AND created_utc:<#{before})".gsub(' ', '%20')
        arguments = "&sort=score:desc&size=#{params[:limit]}"
        @url = base_url + query + arguments

        response = HTTParty.get(@url)
        data = JSON.parse(response.body)
        @entries = data['hits']['hits'].map do |hit|
          hit['_source'].slice('title', 'score', 'url', 'created_utc')
        end
      else
        @entries = []
        @url = ""
      end

      render :reddit
    end
  end
end
