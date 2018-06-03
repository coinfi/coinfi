import React from 'react'
import Animate from 'react-move/Animate'
import { easeExpOut } from 'd3-ease'
import sizeMe from 'react-sizeme'
import NewsItemListItem from './NewsItemListItem'

class NewsItemListItemAnimated extends React.Component {
  state = { preRender: true, height: 0 }
  componentDidMount() {
    setTimeout(() => {
      const { height } = this.props.size
      this.setState({ height, preRender: false })
    }, 50)
  }
  render() {
    if (this.state.preRender)
      return <NewsItemListItem {...this.props} preRender={true} />
    return (
      <Animate
        show={true}
        start={{ height: 0 }}
        enter={{
          height: [this.state.height],
          timing: { duration: 1000, ease: easeExpOut }
        }}
      >
        {({ height }) => <NewsItemListItem {...this.props} height={height} />}
      </Animate>
    )
  }
}

export default sizeMe({ monitorHeight: true })(NewsItemListItemAnimated)
