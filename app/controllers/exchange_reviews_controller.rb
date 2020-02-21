class ExchangeReviewsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  def show
    @review = ExchangeReview.find_by!(slug: params[:slug])
    @author = @review.author

    breadcrumb "#{@review.cmc_exchange.name} Review", exchange_review_path(slug: @review.slug)
  end
end