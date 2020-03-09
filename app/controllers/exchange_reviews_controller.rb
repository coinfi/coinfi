class ExchangeReviewsController < ApplicationController
  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  def show
    distribute_reads(max_lag: MAX_ACCEPTABLE_REPLICATION_LAG, lag_failover: true) do
      @review = ExchangeReview.find_by!(slug: params[:slug])
      @author = @review.author

      breadcrumb "#{@review.cmc_exchange.name} Review", exchange_review_path(slug: @review.slug)
      set_meta_tags(
        title: @review.meta_title || @review.h1,
        description: @review.meta_description
      )
    end
  end
end