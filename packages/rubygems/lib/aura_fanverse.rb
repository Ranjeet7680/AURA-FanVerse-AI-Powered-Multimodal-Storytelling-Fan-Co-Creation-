# frozen_string_literal: true

require_relative "aura_fanverse/version"
require "faraday"
require "json"

module AuraFanVerse
  class Client
    attr_reader :base_url

    def initialize(base_url: "http://localhost:8000")
      @base_url = base_url.chomp("/")
      @conn = Faraday.new(url: @base_url) do |f|
        f.request :json
        f.response :json
        f.adapter Faraday.default_adapter
      end
    end

    def health
      res = @conn.get("/api/health")
      res.body
    end
  end
end
