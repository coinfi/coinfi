module ICO
  extend ActiveSupport::Concern

  included do
    alias_method "is_listed?", "ico_listed?"
  end

  def category
    is_listed? ? 'listed' : 'ico'
  end

  def is_ico?
    !is_listed?
  end

  # TODO: Refactor as a helper
  def ico_start_datetime
    return "?" unless ico_start_date
    DateTime.strptime(ico_start_date.to_s, "%s")
  end

  def ico_end_datetime
    return "?" unless ico_end_date
    DateTime.strptime(ico_end_date.to_s, "%s")
  end
end
