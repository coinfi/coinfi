class PagesController < ApplicationController

  def show
    @page = params[:id] || 'home'
    render_404 unless page_known?
    redirect_to('/login') and return if member_page? && !current_user
    @hide_subheader = true if @page == 'home'
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
    ['home']
  end

  def member_pages
    ['dashboard', 'watchlist']
  end

end
