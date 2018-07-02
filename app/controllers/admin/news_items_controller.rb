module Admin
  class NewsItemsController < Admin::ApplicationController
    def update
      news_item = NewsItem.find(params[:id])
      metadata_params = { user_id: current_user.id, last_human_tagged_on: Time.now }
      news_item.update(news_item_params.merge(metadata_params))
      redirect_to admin_news_items_path(scope: :pending)
    end

    def pending
      page = Administrate::Page::Collection.new(dashboard)
      resources = NewsItem.pending.page(params[:page]).per(records_per_page)
      respond_to do |format|
        format.html {
          render :index, locals: { page: page, resources: resources, search_term: search_term, show_search_bar: show_search_bar? }
        }
        format.csv { send_data NewsItemCsvGenerator.to_csv(NewsItem.pending) }
      end
    end

    def tagged
      page = Administrate::Page::Collection.new(dashboard)
      resources = NewsItem.tagged.page(params[:page]).per(records_per_page)
      respond_to do |format|
        format.html {
          render :index, locals: { page: page, resources: resources, search_term: search_term, show_search_bar: show_search_bar? }
        }
        format.csv { send_data NewsItemCsvGenerator.to_csv(NewsItem.tagged) }
      end
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
