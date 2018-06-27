module ICO
  extend ActiveSupport::Concern

  def category
    ico_listed? ? 'listed' : 'ico'
  end

  def is_ico?
    !ico_listed?
  end

  # TODO: Refactor as a helper
  def ico_start_datetime
    return "?" unless ico_start_epoch
    DateTime.strptime(ico_start_epoch.to_s, "%s")
  end

  def ico_end_datetime
    return "?" unless ico_end_epoch
    DateTime.strptime(ico_end_epoch.to_s, "%s")
  end
end
