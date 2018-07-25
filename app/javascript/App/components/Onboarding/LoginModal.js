import React from 'react'
import { Modal } from 'antd'

const LoginModal = () => (
  <Modal visible={this.state.visible}>
    = form_for(resource, as: resource_name, url: session_path(resource_name)) do
    |f| .field = f.label :email = f.email_field :email, autofocus: true, class:
    'form-control' .field = f.label :password = f.password_field :password,
    autocomplete: "off", class: 'form-control' /- if
    devise_mapping.rememberable? .field = f.check_box :remember_me = f.label
    :remember_me .actions = f.submit "Login", class: 'btn btn-blue w-100' =
    render "devise/shared/links"
  </Modal>
)

export default LoginModal
