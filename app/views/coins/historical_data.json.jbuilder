json.prices @prices
#letters = *('A'..'ZZ').take(@news.length).reverse
if @news
  i = @news.length
  json.news @news.each do |news|
    json.x news.published_epoch
    json.title link_to i, "#n#{i}"
    json.text news.title
    i -= 1
  end
end