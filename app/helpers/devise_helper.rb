module DeviseHelper
  def devise_error_messages!
    return '' if resource.errors.empty?

    messages = resource.errors.full_messages.map { |msg| content_tag(:li, msg) }.join
    html = <<-HTML
    <div class="devise-error show ba b--light-silver mv3 pa2">
      <i class="fas fa-exclamation-triangle"></i>
      <div class="alert-container">
        <strong>
          #{pluralize(resource.errors.count, "error")} must be fixed
        </strong>
        #{messages}
      </div>
    </div>
    HTML

    html.html_safe
  end
end
