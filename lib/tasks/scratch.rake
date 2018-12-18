namespace :scratch do
  task :run => :environment do
    # EXPLAIN ANALYSE SELECT "news_items".* FROM "news_items"
    # LEFT OUTER JOIN "news_coin_mentions" ON "news_items"."id" = "news_coin_mentions"."news_item_id"
    # LEFT OUTER JOIN "coins" ON "news_coin_mentions"."coin_id" = "coins"."id"
    # JOIN "feed_sources" ON "news_items"."feed_source_id" = "feed_sources"."id"
    # WHERE "news_items"."is_published" = true
    # AND "feed_sources"."is_active" = true
    # AND "feed_sources"."feed_type" <> 'reddit'
    # AND "feed_sources"."feed_type" <> 'twitter'
    # AND ("coins"."ranking" >= 20 OR "news_coin_mentions"."id" IS NULL)
    # GROUP BY "news_items"."id"
    # ORDER BY "news_items"."feed_item_published_at" DESC;

    # news_items = NewsItem.left_outer_joins(:coins => { :mentions => :news_item })
    #   .joins(:feed_source)
    #   .published
    #   .merge(FeedSource.active.not_reddit.not_twitter)
    #   .merge(Coin.quick_top(20).or(NewsCoinMention.where(id: nil)))
    #   .limit(25)

    # puts news_items.to_sql

    # news_items.as_json()

    # news_items = NewsItems::WithFilters.call(
    #   NewsItem.published,
    #   coins: ['bitcoin']
    # )
    #   .includes(:coins, :news_categories)
    #   .order_by_published
    #   .limit(25)

    # data = news_items.as_json(
    #   only: %i[id title summary feed_item_published_at updated_at url content],
    #   methods: %i[tag_scoped_coin_link_data categories]
    # )
    # format_item = Proc.new do |item, *args|
    #   item
    #     .except('tag_scoped_coin_link_data')
    #     .merge({
    #       coin_link_data: item['tag_scoped_coin_link_data'],
    #     })
    # end

    # # Handle both hashes and arrays of hashes
    # if (data.kind_of?(Array))
    #   formatted_data = data.map(&format_item)
    # else
    #   formatted_data = format_item.call(data)
    # end

    # metric_type = "exchange_supply"
    # puts @test
    # @test ||= {}
    # puts @test
    # @test ||= {metric_type: "won't work"}
    # puts @test
    # puts @test[metric_type] ||= "should work"
    # puts @test[metric_type] ||= Proc.new do
    #   puts "test"
    #   "shouldn't work"
    # end
    # include TokensHelper
    # exchange_supply = get_all_token_metrics_metadata('exchange_supply')
    # pp exchange_supply

    # pp Coin.erc20_tokens.inject(true) { |sum, coin| sum == false ? false : coin.is_erc20? }
    # results = MarketMetric.monthly(15).chronologically
    # puts results.to_sql
    # pp results
    # pp results.latest

    # pp Coin.find_by_id(624).volume24h
    # pp Coin.find_by_id(109).volume24h

    # coin_key = "kyber.network"
    # url = "#{ENV.fetch('COINFI_POSTGREST_URL')}/exchange_supply_metrics_view?coin_key=eq.#{coin_key}"
    # headers = { "Accept": "application/vnd.pgrst.object+json" }
    # response = HTTParty.get(url, headers: headers)
    # results = JSON.parse(response.body)
    # pp results.except!("coin_key")

    # url = "https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest"
    # query = {
    # }
    # headers = {
    #   "X-CMC_PRO_API_KEY" => ENV.fetch('COINMARKETCAP_API_KEY')
    # }
    # response = HTTParty.get(
    #   url,
    #   :query => query,
    #   :headers => headers,
    # )
    # pp response
    # data = JSON.parse(response.body) || {}

    # processed_data = (data.dig('data', 'quote') || []).map { |x| {
    #   "timestamp" => x['timestamp'],
    #   "total_market_cap" => x.dig('quote', 'USD', 'total_market_cap'),
    #   "total_volume_24h" => x.dig('quote', 'USD', 'total_volume_24h'),
    # } }

    # pp processed_data

    # parsed_response={"status"=>{"timestamp"=>"2018-12-04T07:17:46.723Z", "error_code"=>0, "error_message"=>nil, "elapsed"=>7, "credit_count"=>1}, "data"=>{"active_cryptocurrencies"=>2066, "active_market_pairs"=>15663, "active_exchanges"=>226, "eth_dominance"=>8.93973, "btc_dominance"=>53.8016, "quote"=>{"USD"=>{"total_market_cap"=>129260813073.79, "total_volume_24h"=>14757102609.4446, "last_updated"=>"2018-12-04T07:07:00.000Z"}}, "last_updated"=>"2018-12-04T07:07:00.000Z"}}, @response=#<Net::HTTPOK 200 OK readbody=true>, @headers={"date"=>["Tue, 04 Dec 2018 07:17:46 GMT"], "content-type"=>["application/json; charset=utf-8"], "transfer-encoding"=>["chunked"], "connection"=>["close"], "set-cookie"=>["__cfduid=d8b8d43502662a6811205c78f6da3d13c1543907866; expires=Wed, 04-Dec-19 07:17:46 GMT; path=/; domain=.coinmarketcap.com; HttpOnly; Secure"], "cache-control"=>["no-cache"], "expect-ct"=>["max-age=604800, report-uri=\"https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct\""], "server"=>["cloudflare"], "cf-ray"=>["483c7ec64967a554-NRT"]}>

  end
end