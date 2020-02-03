require 'test_helper'

class CalculateIndicatorsAndSignalsTest < ActiveSupport::TestCase
  test 'expected consensus values' do
    dummy_service = CalculateIndicatorsAndSignals.new(coin: nil)

    assert_equal CalculateIndicatorsAndSignals::CONSENSUS_VALUES[:neutral], dummy_service.send(:get_summary_value, {buy: 410, neutral: 330, sell: 260})
    assert_equal CalculateIndicatorsAndSignals::CONSENSUS_VALUES[:buy], dummy_service.send(:get_summary_value, {buy: 430, neutral: 430, sell: 140})
    assert_equal CalculateIndicatorsAndSignals::CONSENSUS_VALUES[:buy], dummy_service.send(:get_summary_value, {buy: 680, neutral: 320, sell: 0})
    assert_equal CalculateIndicatorsAndSignals::CONSENSUS_VALUES[:strong_buy], dummy_service.send(:get_summary_value, {buy: 790, neutral: 210, sell: 0})

    assert_equal CalculateIndicatorsAndSignals::CONSENSUS_VALUES[:neutral], dummy_service.send(:get_summary_value, {buy: 375, neutral: 625, sell: 0})
    assert_equal CalculateIndicatorsAndSignals::CONSENSUS_VALUES[:sell], dummy_service.send(:get_summary_value, {buy: 375, neutral: 125, sell: 500})
    assert_equal CalculateIndicatorsAndSignals::CONSENSUS_VALUES[:sell], dummy_service.send(:get_summary_value, {buy: 375, neutral: 0, sell: 625})
  end
end