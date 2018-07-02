module Admin
  class NewsItemsController < Admin::ApplicationController
    def update
      news_item = NewsItem.find(params[:id])
      metadata_params = { user_id: current_user.id, last_human_tagged_on: Time.now }
      news_item.update(news_item_params.merge(metadata_params))
      redirect_to action: :index
    end

    def pending
      respond_to do |format|
        format.html {
          page = Administrate::Page::Collection.new(dashboard)
          resources = NewsItem.pending.includes(:coins, :news_coin_mentions, :news_categories, :news_item_categorizations).page(params[:page]).per(records_per_page)
          render :index, locals: { page: page, resources: resources, search_term: search_term, show_search_bar: show_search_bar? }
        }
        # TODO: Make this more performant - right now way too slow!
        # format.csv { send_data NewsItemCsvGenerator.to_csv(NewsItem.pending) }
      end
    end

    def tagged
      respond_to do |format|
        format.html {
          page = Administrate::Page::Collection.new(dashboard)
          resources = NewsItem.tagged.includes(:coins, :news_coin_mentions, :news_categories, :news_item_categorizations).page(params[:page]).per(records_per_page)
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
