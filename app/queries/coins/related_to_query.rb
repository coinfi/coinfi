module Coins
  class RelatedToQuery
    def self.call(
      relation = Coin.all,
      coin:
    )
      result = relation

      # Find related using nearest `id`
      # This is currently just placeholder behavior to fetch related items until we can implement
      # the logic for it
      result = relation
        .where("id >= ?", coin.id - 4)
        .where.not(id: coin)
        .order(:id)
        .limit(8)
      # If there are not enough coins after `coin.id - 4` search the other way instead
      if result.length < 8
        result = relation
          .where("id =< ?", coin.id + 4)
          .where.not(id: coin)
          .order(:id)
          .limit(8)
      end

      result
    end
  end
end
