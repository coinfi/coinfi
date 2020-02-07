module Admin
  class CoinsController < Admin::ApplicationController
    before_action :default_params
    # To customize the behavior of this controller,
    # you can overwrite any of the RESTful actions. For example:
    #
    # def index
    #   super
    #   @resources = Coin.
    #     page(params[:page]).
    #     per(10)
    # end

    # Define a custom finder by overriding the `find_resource` method:
    # def find_resource(param)
    #   Coin.find_by!(slug: param)
    # end

    # See https://administrate-prototype.herokuapp.com/customizing_controller_actions
    # for more information

    # TODO: Refactor when PR is merged:
    # https://github.com/thoughtbot/administrate/pull/1096
    # https://github.com/thoughtbot/administrate/issues/320
    def influencers
      page = Administrate::Page::Collection.new(dashboard)
      resources = Coin.where(id: InfluencerReview.pluck(:coin_id)).page(params[:page]).per(records_per_page)
      render :index, locals: { page: page, resources: resources, search_term: search_term, show_search_bar: show_search_bar? }
    end

    private

    def search_term
      params[:search].to_s.strip
    end

    def default_params
      params[resource_name] = {} unless params.key? resource_name
      params[resource_name][:order] ||= 'ranking'
      params[resource_name][:direction] ||= 'asc'
    end
  end
end
