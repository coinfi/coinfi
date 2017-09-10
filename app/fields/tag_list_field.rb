require "administrate/field/base"

class TagListField < Administrate::Field::Base
  def to_s
    data.to_s.html_safe
  end
end
