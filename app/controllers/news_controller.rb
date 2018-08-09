class NewsController < ApplicationController
  def index
    return render_404 unless has_news_feature?
  end
end
