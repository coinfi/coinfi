module NewsServices
  class RefreshNewsVotesTrendingView < Patterns::Service
    def initialize
      @connection = ActiveRecord::Base.connection
      @view_name = NewsVotesTrending.table_name
    end

    def call
      @connection.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY #{@view_name} WITH DATA;")
      @connection.execute("ANALYSE #{@view_name};") # according to https://dba.stackexchange.com/a/194717
    end
  end
end