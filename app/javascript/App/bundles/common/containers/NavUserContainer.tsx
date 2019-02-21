import * as React from 'react'
import NavUser from '~/bundles/common/components/NavUser'
import { ThemeProvider } from '~/bundles/common/contexts/ThemeContext'

interface State {
  menuOpen: boolean
  menuAnchor: HTMLElement
}

interface Props {
  user: any
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
      <ThemeProvider user={this.props.user}>
        <NavUser
          menuOpen={this.state.menuOpen}
          menuAnchor={this.state.menuAnchor}
          onOpenMenu={this.handleOpenMenu}
          onCloseMenu={this.handleCloseMenu}
          userEmail={this.props.userEmail}
          formAuthenticityToken={this.props.formAuthenticityToken}
        />
      </ThemeProvider>
    )
  }
}

export default NavUserContainer
