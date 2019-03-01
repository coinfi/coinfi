import * as React from 'react'
import * as _ from 'lodash'
import Icon from '~/bundles/common/components/Icon'
import { withStyles, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import MuiIcon from '@material-ui/core/Icon'
import classnames from 'classnames'
import { withNewsfeed, NewsfeedContextType } from './NewsfeedContext'

enum STATUSES {
  LOADING = 'LOADING',
  READY = 'READY',
}

const styles = (theme) =>
  createStyles({
    root: {
      display: 'inline-block',
    },
    icon: {
      verticalAlign: 'top',
    },
    iconButton: {
      color: 'inherit',
      padding: '0 8px',
      backgroundColor: 'inherit !important',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    iconButtonUp: {
      marginTop: '-6px',
    },
    muiIcon: {
      fontSize: '14px',
    },
  })

interface Props extends NewsfeedContextType {
  classes: any
  newsItemId: number
  hasControls?: boolean
}

interface State {
  isLoading: boolean
}

class Votes extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { newsItemId, voteSummaries } = props
    const hasInitialVotes = !!voteSummaries[newsItemId]
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

  public vote = (direction: string) => {
    return this.props.voteOnNewsItem(this.props.newsItemId, direction)
  }

  public render() {
    const {
      classes,
      isLoading,
      newsItemId,
      voteSummaries,
      hasControls,
    } = this.props

    if (isLoading) {
      return <></>
    }

    const total = _.get(voteSummaries, [newsItemId, 'total'], 0)

    return (
      <div className={classes.root}>
        {hasControls && (
          <IconButton
            className={classnames(classes.iconButton, classes.iconButtonUp)}
            disableRipple={true}
            onClick={() => this.vote('up')}
          >
            <MuiIcon
              className={classnames(classes.muiIcon, 'far fa-thumbs-up')}
            />
          </IconButton>
        )}
        <Icon name="fire-alt" className={classes.icon} /> {total}
        {hasControls && (
          <IconButton
            className={classes.iconButton}
            disableRipple={true}
            onClick={() => this.vote('down')}
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
