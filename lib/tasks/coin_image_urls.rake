require "#{Rails.root}/app/helpers/url_helper"
include UrlHelper

namespace :coins do
  desc "Update the image URLs for Coins"
  task :update_image_urls, [:force] => :environment do |t, args|
    # Usage:
    #> rake coins:update_image_urls
    # or
    #> rake "coins:update_image_urls[force]"
    github_url = "https://raw.githubusercontent.com/cjdowner/cryptocurrency-icons/master/svg/color/"
    cdn_url = "https://gitcdn.link/repo/cjdowner/cryptocurrency-icons/master/svg/color/"
    Coin.all.order('name').each do |coin|
      if coin.image_url.to_s.present?
        unless args.force 
          puts "#{coin.name} - skipped, image_url present"
          next
        end
      end
      path = "#{coin.symbol.downcase}.svg"
      if UrlHelper::url_exists? "#{github_url}#{path}"
        coin.update!({image_url: "#{cdn_url}#{path}"})
        puts "#{coin.name} - updated image_url"
      else
        puts "#{coin.name} - CDN URL not found"
      end
    end
  end
end
