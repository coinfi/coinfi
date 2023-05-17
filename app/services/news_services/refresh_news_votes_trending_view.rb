module NewsServices
  class RefreshNewsVotesTrendingView < Patterns::Service
    def initialize
      @view_name = NewsVotesTrending.table_name
    end

    def call
      ActiveRecord::Base.connection_pool.with_connection do |connection|
        begin
          connection.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY #{@view_name} WITH DATA;")
        rescue ActiveRecord::StatementInvalid => e
          if e.message.match "CONCURRENTLY cannot be used when the materialized view is not populated"
            connection.execute("REFRESH MATERIALIZED VIEW #{@view_name} WITH DATA;")
          else
            raise
          end
        end
        connection.execute("ANALYSE #{@view_name};") # according to https://dba.stackexchange.com/a/194717
      end
    end
  end
end