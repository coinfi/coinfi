module Admin
  class NewsItemsController < Admin::ApplicationController
    def update
      news_item = NewsItem.find(params[:id])
      metadata_params = { user_id: current_user.id, last_human_tagged_on: Time.now }
      news_item.update(news_item_params.merge(metadata_params))
      redirect_to admin_news_items_path(scope: :pending)
    end

    def index
      @scope = params[:scope] 
      @scope = 'pending' unless ['pending', 'tagged'].include? @scope #whitelist this since we use send later

      page = Administrate::Page::Collection.new(dashboard)
      resources = NewsItem.send(@scope).page(params[:page]).per(records_per_page)
      render :index, locals: { page: page, resources: resources, search_term: search_term, show_search_bar: show_search_bar? }
    end

    private

    def news_item_params
      params.require(:news_item).permit!
    end

    def search_term
      params[:search].to_s.strip
    end
  end
end
