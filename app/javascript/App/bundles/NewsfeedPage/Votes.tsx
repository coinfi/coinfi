import * as React from 'react'
import * as _ from 'lodash'
import Icon from '~/bundles/common/components/Icon'
import { withStyles, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MuiIcon from '@material-ui/core/Icon'
import classnames from 'classnames'
import { withNewsfeed, NewsfeedContextType } from './NewsfeedContext'
import { openSignUpModal } from '~/bundles/common/utils/modals'

const VOTE_DIRECTION = {
  up: true,
  down: false,
}

const styles = (theme) =>
  createStyles({
    root: {
      '&.with-controls': {
        marginLeft: '-8px',
      },
      display: 'inline-block',
    },
    icon: {
      verticalAlign: 'top',
    },
    iconButton: {
      color: theme.palette.text.secondary,
      padding: '0 8px',
      backgroundColor: 'inherit !important',
      '&:hover': {
        color: theme.palette.text.primary,
      },
      '&.selected': {
        color: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.text.primary,
        },
      },
    },
    iconButtonUp: {
      marginTop: '-6px',
    },
    iconButtonDown: {},
    muiIcon: {
      fontSize: '14px',
    },
  })

interface Props extends NewsfeedContextType {
  classes: any
  newsItemId: number
  showControls?: boolean
  isLoggedIn?: boolean
  initialVote?: number
}

interface State {
  isLoading: boolean
}

class Votes extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { newsItemId, voteSummaries, initialVote } = props

    const hasInitialVotes = !!voteSummaries[newsItemId] || initialVote
    const isLoading = !hasInitialVotes

    this.state = {
      isLoading,
    }
  }

  public componentDidMount() {
    if (this.props.isLoading) {
      this.props
        .fetchVotesforNewsItem(this.props.newsItemId)
        .then(() => this.setState({ isLoading: false }))
    }
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.newsItemId !== this.props.newsItemId) {
      const hasVotes = !!this.props.voteSummaries[this.props.newsItemId]
      if (!hasVotes) {
        this.setState({ isLoading: true }, () => {
          this.props
            .fetchVotesforNewsItem(this.props.newsItemId)
            .then(() => this.setState({ isLoading: false }))
        })
      }
    }
  }

  public vote = (direction: boolean) => {
    return this.props.voteOnNewsItem(this.props.newsItemId, direction)
  }

  public handleUpvote = () => {
    if (!this.props.isLoggedIn) {
      return this.handleLogin()
    }

    this.vote(VOTE_DIRECTION.up)
  }

  public handleDownvote = () => {
    if (!this.props.isLoggedIn) {
      return this.handleLogin()
    }

    this.vote(VOTE_DIRECTION.down)
  }

  public handleLogin = () => {
    openSignUpModal()
  }

  public render() {
    const {
      classes,
      isLoading,
      newsItemId,
      voteSummaries,
      showControls,
      initialVote,
    } = this.props

    if (isLoading) {
      return null
    }

    const defaultTotal = initialVote || 0
    const total = _.get(voteSummaries, [newsItemId, 'vote_score'], defaultTotal)
    const userVote = _.get(voteSummaries, [newsItemId, 'user_vote'], null)
    const isUp = userVote === VOTE_DIRECTION.up
    const isDown = userVote === VOTE_DIRECTION.down

    return (
      <div
        className={classnames(classes.root, { 'with-controls': showControls })}
      >
        {showControls && (
          <IconButton
            className={classnames(classes.iconButton, classes.iconButtonUp, {
              selected: isUp,
            })}
            disableRipple={true}
            onClick={this.handleUpvote}
          >
            <MuiIcon
              className={classnames(classes.muiIcon, 'far fa-thumbs-up')}
            />
          </IconButton>
        )}
        <Icon name="fire-alt" className={classes.icon} /> {total}
        {showControls && (
          <IconButton
            className={classnames(classes.iconButton, classes.iconButtonDown, {
              selected: isDown,
            })}
            disableRipple={true}
            onClick={this.handleDownvote}
          >
            <MuiIcon
              className={classnames(classes.muiIcon, 'far fa-thumbs-down')}
            />
          </IconButton>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(withNewsfeed(Votes))
