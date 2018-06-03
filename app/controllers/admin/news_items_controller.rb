module Admin
  class NewsItemsController < Admin::ApplicationController
    def update
      news_item = NewsItem.find(params[:id])
      news_item.update(news_item_params)
      redirect_to action: :index
    end

    private
    def news_item_params
      params.require(:news_item).permit!
    end
  end
end
