module Admin
  class CoinArticlesController < Admin::ApplicationController
    before_action :default_params
    # Overwrite any of the RESTful controller actions to implement custom behavior
    # For example, you may want to send an email after a foo is updated.
    #
    # def update
    #   foo = Foo.find(params[:id])
    #   foo.update(params[:foo])
    #   send_foo_updated_email
    # end

    # Override this method to specify custom lookup behavior.
    # This will be used to set the resource for the `show`, `edit`, and `update`
    # actions.
    #
    def find_resource(param)
      CoinArticle.friendly.find(param)
    end

    # Override this if you have certain roles that require a subset
    # this will be used to set the records shown on the `index` action.
    #
    # def scoped_resource
    #  if current_user.super_admin?
    #    resource_class
    #  else
    #    resource_class.with_less_stuff
    #  end
    # end

    # See https://administrate-prototype.herokuapp.com/customizing_controller_actions
    # for more information
    def default_params
      params[resource_name] = {} unless params.key? resource_name
      params[resource_name][:order] ||= 'updated_at'
      params[resource_name][:direction] ||= 'desc'
    end
  end
end
