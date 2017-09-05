json.prices @prices

letters = *('A'..'ZZ').take(@news.length).reverse
i = 0
json.news @news do |news|
  json.x news.published_epoch
  json.title link_to letters[i], news.url
  json.text news.title
  i += 1
end
