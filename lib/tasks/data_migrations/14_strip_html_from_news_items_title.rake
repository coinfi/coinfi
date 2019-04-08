namespace :data_migrations do
  desc "Strip html from title field of news items"
  task :strip_html_from_news_items_title => :environment do
    # Only process html-like titles
    news_items = NewsItem.where("title LIKE '%<%'").where("title LIKE '%>%'")

    batch_process(news_items) do |item|
      item.title = NewsItemRaw.strip_title_html(item.title)
      item.save!
    end
  end
end
