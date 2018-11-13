module Coins
  class RelatedToQuery
    RESULT_COUNT = 8

    def self.call(
      relation = Coin.all,
      coin:
    )
      result = relation

      if coin.ranking
        # Find related using nearest `ranking`
        result = relation
          .where("ranking >= ?", coin.ranking - RESULT_COUNT / 2)
          .where.not(ranking: coin.ranking)
          .order(:ranking)
          .limit(RESULT_COUNT)
        # If there are not enough coins, search the other way instead
        if result.length < RESULT_COUNT
          result = relation
            .where("ranking <= ?", coin.ranking + RESULT_COUNT / 2)
            .where.not(ranking: coin.ranking)
            .order(:ranking)
            .limit(RESULT_COUNT)
        end
      else
        # Find related using nearest `id`
        # This is currently just placeholder behavior to fetch related items until we can implement
        # the logic for it
        result = relation
          .where("id >= ?", coin.id - RESULT_COUNT / 2)
          .where.not(id: coin.id)
          .order(:id)
          .limit(RESULT_COUNT)
        # If there are not enough coins after `coin.id - 4` search the other way instead
        if result.length < RESULT_COUNT
          result = relation
            .where("id <= ?", coin.id + RESULT_COUNT / 2)
            .where.not(id: coin)
            .order(:id)
            .limit(RESULT_COUNT)
        end
      end

      result
    end
  end
end
