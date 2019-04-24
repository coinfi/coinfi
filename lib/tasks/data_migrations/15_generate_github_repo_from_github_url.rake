namespace :data_migrations do
  desc "Generate github repo from github url"
  task :generate_github_repo_from_github_url => :environment do
    coins = Coin.where.not(github: nil)

    batch_process(coins) do |coin|
      github_path = URI(coin.github).path
      next unless github_path.present?

      github_path_array = github_path.sub!(%r{^/}, '').split('/')
      if github_path_array.size == 2 # has repo, i.e., (name|org)/(repo name)
        coin.github_repo ||= github_path_array.join('/')
        coin.save!
      elsif github_path_array.size > 2
        puts "NOTICE: #{coin.name} might have a github repo: #{github_path_array.join('/')}"
      end
    end

    # make sure indicator coins have repos using curated list
    curated_repos = {
      'bitcoin.org' => 'bitcoin/bitcoin',
      'ethereum.org' => 'ethereum/go-ethereum',
      'bitcoincash.org' => 'Bitcoin-ABC/bitcoin-abc',
      'ripple.com' => 'ripple/rippled',
      'dash.org' => 'dashpay/dash',
      'litecoin.com' => 'litecoin-project/litecoin',
      'ethereumclassic.org' => 'ethereumproject/go-ethereum',
      'cardano.org' => 'input-output-hk/cardano-sl',
      'iota.org' => 'iotaledger/iri',
      'stellar.org' => 'stellar/stellar-core',
      'eos.io' => 'EOSIO/eos',
      'neo.org/neo' => 'neo-project/neo',
      'z.cash' => 'zcash/zcash',
      'binance.com' => 'binance-exchange/binance-official-api-docs',
      'tron.network' => 'tronprotocol/java-tron',
    }

    curated_coins = Coin.where(coin_key: curated_repos.map{|k, v| k })
    batch_process(curated_coins) do |coin|
      github_repo = curated_repos[coin.coin_key]
      next unless github_repo.present?

      coin.github_repo = github_repo
      coin.save!
    end
  end
end
