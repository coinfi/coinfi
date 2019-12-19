// useScrollTrigger introduced in MUI 4.0. rewritten as an HOC
import React from 'react'

function getScrollY(ref) {
  return ref.pageYOffset !== undefined ? ref.pageYOffset : ref.scrollTop
}

function defaultTrigger(event, store, options) {
  const { disableHysteresis = false, threshold = 100 } = options
  const previous = store
  store = event ? getScrollY(event.currentTarget) : previous

  if (!disableHysteresis && previous !== undefined) {
    if (store < previous) {
      return false
    }
  }

  return store > threshold
}

const defaultTarget = typeof window !== 'undefined' ? window : null

export default function withScrollTrigger(options = {}) {
  const {
    getTrigger = defaultTrigger,
    target = defaultTarget,
    ...other
  } = options

  return function(WrappedComponent) {
    return class ScrollTriggerWrapper extends React.Component {
      store

      constructor(props) {
        super(props)

        this.state = {
          trigger: getTrigger(null, this.store, other),
        }
      }

      setTrigger = (trigger) => {
        this.setState({ trigger })
      }

      handleScroll = (event) => {
        this.setTrigger(getTrigger(event, this.store, other))
      }

      componentDidMount() {
        this.handleScroll(null)
        target.addEventListener('scroll', this.handleScroll)
      }

      componentWillUnmount() {
        target.removeEventListener('scroll', this.handleScroll)
      }

      render() {
        return <WrappedComponent trigger={this.state.trigger} {...this.props} />
      }
    }
  }
}
