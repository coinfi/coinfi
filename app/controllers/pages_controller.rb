class PagesController < ApplicationController
  def show
    @page = params[:id] || 'home'
    render_404 unless page_known?
    redirect_to('/login') && return if member_page? && !current_user
    @body_id = "#{@page}-page"
    if !has_feature?
      render_404
    else
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
    when 'news'
      has_news_feature?
    when 'calendar'
      has_calendar_feature?
    else
      true
    end
  end

  def pages
    public_pages + member_pages
  end

  def public_pages
    %w[home about news calendar ambassadors win-cofi]
  end

  def member_pages
    %w[]
  end

end
