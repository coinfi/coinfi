import _ from 'lodash'
import moment from 'moment'

import * as React from 'react'
import NavUser from '~/bundles/common/components/NavUser'

import { mount, configure } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() })

describe('NavUser', () => {
  const defaultProps = {
    menuOpen: true,
    menuAnchor: null,
    onOpenMenu: () => null,
    onCloseMenu: () => null,
    userEmail: 'test@example.org',
    formAuthenticityToken: 'abcde12345',
  }

  it('renders the email', () => {
    const wrapper = mount(<NavUser {...defaultProps} />)

    expect(wrapper.exists(`[children="${defaultProps.userEmail}"]`)).toEqual(
      true,
    )
  })

  it('renders a valid logout button', () => {
    const wrapper = mount(<NavUser {...defaultProps} />)

    const form = wrapper.find(`form`)
    expect(form.prop('action')).toEqual('/logout')
    expect(form.prop('method')).toEqual('post')

    // Check for a valid `authenticity_token` input
    expect(
      form.exists(
        `input[name="authenticity_token"][value="${
          defaultProps.formAuthenticityToken
        }"]`,
      ),
    ).toEqual(true)
    // Check for a valid submit button
    expect(form.exists('button[type="submit"]')).toEqual(true)
  })
})
