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
        base_url = "https://api.pushshift.io/reddit/search/submission/"
        arguments = "?subreddit=#{params[:subReddit]}&before=#{before}&after=#{after}&sort=desc&sort_type=score&limit=#{params[:limit]}&fields=title,url,score,selftext,retrieved_on"
        @url = base_url+arguments

        response = HTTParty.get(base_url + arguments)
        data = JSON.parse(response.body)
        @entries = data['data']
      else
        @entries = []
        @url = ""
      end

      render :reddit
    end
  end
end
