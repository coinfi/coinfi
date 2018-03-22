class PagesController < ApplicationController

  def show
    page = params[:id] || 'home'
    render_404 unless page_known? page
    render "pages/#{page}"
  end

  private

  def page_known? name
    known_pages.include? name
  end

  def known_pages
    ['home']
  end

end
