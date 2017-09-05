class BigDecimal
  # Monkey patch BigDecimal to return number instead of string for JSON representation.
  # See https://stackoverflow.com/a/6132054
  # https://github.com/rails/rails/blob/5c315a8fa6296904f5e0ba8da919fc395548cf98/activesupport/lib/active_support/core_ext/object/json.rb#L109
  def as_json(options = nil) self.to_f end
  def encode_json(encoder) to_s end #:nodoc:
end
