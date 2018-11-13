module ActionDispatch
  module Routing
    class StaticResponder < Endpoint

      attr_accessor :path, :file_handler

      def initialize(path)
        self.path = path
        self.file_handler = ActionDispatch::FileHandler.new(
          Rails.configuration.paths["public"].first
        )
      end

      def call(env)
        env["PATH_INFO"] = @file_handler.match?(path)
        @file_handler.call(env)
      end

      def inspect
        "static('#{path}')"
      end

    end

    class Mapper
      def static(path)
        StaticResponder.new(path)
      end
    end
  end
end