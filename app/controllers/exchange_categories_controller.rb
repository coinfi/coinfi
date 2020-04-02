class ExchangeCategoriesController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  def show
    @category = ExchangeCategory.find_by!(slug: params[:slug])
    @author = @category.author
    @reviews = @category.exchange_reviews.ranked.limit(10).includes(:cmc_exchange)

    breadcrumb @category.name, exchange_category_path(slug: @category.slug)
    set_meta_tags(
      title: @category.meta_title.presence || @category.h1,
      description: @category.meta_description
    )
  end
end