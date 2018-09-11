import * as React from 'react'
import NavUser from '~/bundles/common/components/NavUser/NavUser'
import { IUser } from '~/bundles/common/types'

interface State {
  menuOpen: boolean
  menuAnchor: HTMLElement
}

interface Props {
  user: IUser
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
        user={this.props.user}
        formAuthenticityToken={this.props.formAuthenticityToken}
      />
    )
  }
}

export default NavUserContainer
