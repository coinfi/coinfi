module Admin
  class NewsItemsController < Admin::ApplicationController
    def update
      news_item = NewsItem.find(params[:id])
      metadata_params = { user_id: current_user.id, last_human_tagged_on: Time.now }
      news_item.update(news_item_params.merge(metadata_params))
      redirect_to action: :pending
    end

    def pending
      respond_to do |format|
        format.html {
          page = Administrate::Page::Collection.new(dashboard)
          distribute_reads(max_lag: 10.seconds, lag_failover: true) do
            resources = NewsItem.pending.no_category.where("feed_item_published_at > ?", 1.month.ago).order_by_published
              .includes(:feed_source)
              .page(params[:page])
              .per(records_per_page)
            render :index, locals: { page: page, resources: resources, search_term: search_term, show_search_bar: show_search_bar? }
          end
        }
        # TODO: Make this more performant - right now way too slow!
        # format.csv { send_data NewsItemCsvGenerator.to_csv(NewsItem.pending) }
      end
    end

    def tagged
      respond_to do |format|
        format.html {
          page = Administrate::Page::Collection.new(dashboard)
          distribute_reads(max_lag: 10.seconds, lag_failover: true) do
            resources = NewsItem.tagged.where("feed_item_published_at > ?", 1.month.ago).order_by_published

            if params[:categories]
              category_ids = params[:categories].split(',')
              resources = resources.where(news_item_categorizations: { news_category_id: category_ids })
            end

            if params[:coins]
              coin_ids = params[:coins].split(',')
              resources = resources.where(news_coin_mentions: { coin_id: coin_ids })
            end

            resources = resources
              .includes(:feed_source)
              .page(params[:page])
              .per(records_per_page)
            render :index, locals: { page: page, resources: resources, search_term: search_term, show_search_bar: show_search_bar? }
          end
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
