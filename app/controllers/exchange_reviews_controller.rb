class ExchangeReviewsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  def show
    @review = ExchangeReview.find_by!(slug: params[:slug])
    @author = @review.author

    breadcrumb "#{@review.cmc_exchange.name} Review", exchange_review_path(slug: @review.slug)
    set_meta_tags(
      title: @review.meta_title.presence || @review.h1,
      description: @review.meta_description
    )
    set_jsonld(@review.get_schema)
  end
end