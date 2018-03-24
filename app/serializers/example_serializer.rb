class ExampleSerializer
  include FastJsonapi::ObjectSerializer
  set_key_transform :camel_lower
  attributes :id, :name, :symbol, :image_url, :market_cap, :price
end
