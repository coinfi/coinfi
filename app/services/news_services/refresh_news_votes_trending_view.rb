module NewsServices
  class RefreshNewsVotesTrendingView < Patterns::Service
    def initialize
      @view_name = NewsVotesTrending.table_name
    end

    def call
      ActiveRecord::Base.connection_pool.with_connection do |connection|
        connection.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY #{@view_name} WITH DATA;")
        connection.execute("ANALYSE #{@view_name};") # according to https://dba.stackexchange.com/a/194717
      end
    end
  end
end