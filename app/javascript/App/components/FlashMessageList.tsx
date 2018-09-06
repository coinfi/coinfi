import * as React from 'react'
import FlashMessageListItem from './FlashMessageListItem'

interface FlashMessage {
  id: string
  type: string
  text: string
}

interface State {
  closed: {
    [id: string]: boolean
  }
}

interface Props {
  messages: FlashMessage[]
}

class FlashMessageList extends React.Component<Props, State> {
  public state = {
    closed: {},
  }

  public handleClose = (id: string) => {
    this.setState({
      closed: {
        ...this.state.closed,
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
            open={!this.state.closed[message.id]}
            onClose={() => this.handleClose(message.id)}
            anchorOrigin={{
              horizontal: 'left',
              vertical: 'bottom',
            }}
          />
        ))}
      </div>
    )
  }
}

export default FlashMessageList
