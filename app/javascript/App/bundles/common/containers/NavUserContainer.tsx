import * as React from 'react'
import ReactOnRails from 'react-on-rails'
import NavUser from '~/bundles/common/components/NavUser'

interface State {
  menuOpen: boolean
  menuAnchor: HTMLElement
}

interface Props {
  userEmail: string
  formAuthenticityToken: string
}

class NavUserContainer extends React.Component<Props, State> {
  public state = {
    menuOpen: false,
    menuAnchor: null,
  }

  public handleOpenMenu = (event) => {
    this.setState({
      menuOpen: true,
      menuAnchor: event.currentTarget,
    })
  }

  public handleCloseMenu = (event) => {
    this.setState({
      menuOpen: false,
      menuAnchor: null,
    })
  }

  public render() {
    return (
      <NavUser
        menuOpen={this.state.menuOpen}
        menuAnchor={this.state.menuAnchor}
        onOpenMenu={this.handleOpenMenu}
        onCloseMenu={this.handleCloseMenu}
        userEmail={this.props.userEmail}
        formAuthenticityToken={this.props.formAuthenticityToken}
      />
    )
  }
}

ReactOnRails.register({ NavUserContainer })

export default NavUserContainer
