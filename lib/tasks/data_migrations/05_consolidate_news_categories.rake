namespace :data_migrations do
  desc 'Consolidate NewsCategories into shorter list'
  task :consolidate_news_categories => :environment do
    ActiveRecord::Base.transaction do
      # Rename category from 'Exchange Listing' to 'Exchange Announcements'
      exchange_listing_category = NewsCategory.find_by!(name: 'Exchange Listing')
      exchange_listing_category.update!(name: 'Exchange Announcements')
      puts "Renamed NewsCategory(#{exchange_listing_category.id}): 'Exchange Announcements'"

      # Create new 'Price Analysis' category
      price_analysis_category = NewsCategory.create!(name: 'Price Analysis')
      puts "Created NewsCategory(#{price_analysis_category.id}): 'Price Analysis'"

      # Create new 'Project Announcements' category
      project_announcements_category = NewsCategory.create!(name: 'Project Announcements')
      puts "Created NewsCategory(#{project_announcements_category.id}): 'Project Announcements'"

      # Replace many categorizations with 'Project Announcements'
      PROJECT_ANNOUNCEMENTS_CATEGORIES = [
        'Partnerships',
        'Security (Vulnerabilities)',
        'Fundraising',
        'Founder News',
        'Conferences & Events',
        'Airdrops',
        'Product Release',
        'Forks',
        'Adoption',
        'Token Supply Changes',
      ]
      project_announcements_categorizations = NewsItemCategorization
        .joins(:news_category)
        .where(news_categories: {name: PROJECT_ANNOUNCEMENTS_CATEGORIES})

      update_count = 0
      project_announcements_categorizations.find_each do |categorization|
        categorization.update!(news_category: project_announcements_category)
        update_count += 1
      end
      puts "Updated #{update_count} NewsItemCategorization records"

      # Remove replaced categories
      replaced_categories = PROJECT_ANNOUNCEMENTS_CATEGORIES
      destroy_count = 0
      NewsCategory.where(name: replaced_categories).find_each do |category|
        category.destroy!
        destroy_count += 1
      end
      puts "Deleted #{destroy_count} NewsCategory records"
    end
  end
end
