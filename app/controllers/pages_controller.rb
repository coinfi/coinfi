class PagesController < ApplicationController
  before_action :hide_currency

  def show
    @page = params[:id] || 'home'
    render_404 unless page_known?
    redirect_to('/login') && return if member_page? && !current_user
    @body_id = "#{@page}-page"
    if !has_feature?
      render_404
    else
      apply_meta_tags_to_page

      render "pages/#{@page}"
    end
  end

  private

  def page_known?
    pages.include? @page
  end

  def member_page?
    member_pages.include? @page
  end

  def has_feature?
    case @page
    when 'calendar'
      has_calendar_feature?
    else
      true
    end
  end

  def is_no_seo_page?
    @page == 'privacy-policy' || @page == 'contact-us' ||
      @page == 'ambassadors'
  end

  def apply_meta_tags_to_page
    if is_no_seo_page?
      set_no_seo
    end
  end

  def pages
    public_pages + member_pages
  end

  def public_pages
    %w[home about press contact-us calendar ambassadors win-cofi privacy-policy unstake]
  end

  def member_pages
    %w[]
  end

end
