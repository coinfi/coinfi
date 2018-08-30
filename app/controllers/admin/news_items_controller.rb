module Admin
  class NewsItemsController < Admin::ApplicationController
    before_action :default_params, only: :index

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
          resources = NewsItem.pending.order_by_published
            .includes(:coins, :news_coin_mentions, :news_categories, :news_item_categorizations)
            .page(params[:page])
            .per(records_per_page)
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
          resources = NewsItem.tagged.order_by_published
            .includes(:coins, :news_coin_mentions, :news_categories, :news_item_categorizations)

          if params[:categories]
            category_ids = params[:categories].split(',')
            resources = resources.where(news_item_categorizations: { news_category_id: category_ids })
          end

          if params[:coins]
            coin_ids = params[:coins].split(',')
            resources = resources.where(news_coin_mentions: { coin_id: coin_ids })
          end

          resources = resources
            .page(params[:page])
            .per(records_per_page)
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

    def default_params
      params[:order] ||= "feed_item_published_at"
      params[:direction] ||= "desc"
    end
  end
end
