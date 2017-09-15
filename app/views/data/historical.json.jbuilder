json.prices @prices

#letters = *('A'..'ZZ').take(@news.length).reverse
i = @news.length
json.news @news.each do |news|
  json.x news.published_epoch
  json.title link_to i, news.url
  json.text news.title
  i -= 1
end
