import * as React from 'react'
import FlashMessageListItem from '~/bundles/common/components/FlashMessageListItem'
import { FlashMessage } from '~/bundles/common/types'

interface State {
  closedMessages: {
    [id: string]: boolean
  }
}

interface Props {
  messages: FlashMessage[]
}

class FlashMessageListContainer extends React.Component<Props, State> {
  public state = {
    closedMessages: {},
  }

  public handleCloseMessage = (id: string) => {
    this.setState({
      closedMessages: {
        ...this.state.closedMessages,
        [id]: true,
      },
    })
  }

  public render() {
    const { messages } = this.props

    return (
      <div>
        {messages.map((message, idx) => (
          <FlashMessageListItem
            key={message.id}
            level={idx}
            message={message}
            open={!this.state.closedMessages[message.id]}
            onClose={() => this.handleCloseMessage(message.id)}
            anchorOrigin={{
              horizontal: 'left',
              vertical: 'bottom',
            }}
            autoHideDuration={5000}
          />
        ))}
      </div>
    )
  }
}

export default FlashMessageListContainer
