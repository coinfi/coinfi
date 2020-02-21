class ExchangeCategoriesController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  def show
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @category = ExchangeCategory.find_by!(slug: params[:slug])
      @author = @category.author
      @reviews = @category.exchange_reviews.ranked.limit(10)

      breadcrumb @category.name, exchange_category_path(slug: @category.slug)
      set_meta_tags(
        title: @category.meta_title || @category.h1,
        description: @category.meta_description
      )
    end
  end
end