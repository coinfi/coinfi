class CalculatorsController < ApplicationController
  def show
    @page = params[:id]
    render_404 unless page_known?
    redirect_to('/login') && return if member_page? && !current_user
    @body_id = "#{@page}"
    render "calculators/#{@page}"
  end

  private

  def page_known?
    pages.include? @page
  end

  def member_page?
    member_pages.include? @page
  end

  def pages
    public_pages + member_pages
  end

  def public_pages
    %w[bitcoin-investment-calculator]
  end

  def member_pages
    %w[]
  end

end
