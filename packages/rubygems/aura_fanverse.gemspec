# frozen_string_literal: true

require_relative "lib/aura_fanverse/version"

Gem::Specification.new do |spec|
  spec.name          = "aura_fanverse"
  spec.version       = AuraFanVerse::VERSION
  spec.authors       = ["Ranjeet Kumar"]
  spec.email         = ["lorekeeper@auraverse.io"]

  spec.summary       = "Official Ruby SDK for AURA FanVerse Sports-Tech Platform"
  spec.description   = "Ruby Client for AURA FanVerse Telemetry, PINN Physics, and Tactical AI"
  spec.homepage      = "https://github.com/Ranjeet7680/AURA-FanVerse-AI-Powered-Multimodal-Storytelling-Fan-Co-Creation-"
  spec.license       = "MIT"
  spec.required_ruby_version = ">= 3.0.0"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = spec.homepage
  spec.metadata["allowed_push_host"] = "https://rubygems.pkg.github.com/Ranjeet7680"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["lib/**/*.rb", "README.md", "LICENSE"]
  end
  spec.require_paths = ["lib"]

  spec.add_dependency "faraday", "~> 2.8"
  spec.add_dependency "json", "~> 2.6"
end
