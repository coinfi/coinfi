class PagesController < ApplicationController
  def show
    @page = params[:id] || 'home'
    render_404 unless page_known?
    redirect_to('/login') && return if member_page? && !current_user
    #TODO: remove this once we decide if we can just remove the footer everywhere
    @hide_footer = @page == 'news'
    @body_id = "#{@page}-page"
    render "pages/#{@page}"
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
    %w[home about news]
  end

  def member_pages
    %w[watchlist]
  end

end
