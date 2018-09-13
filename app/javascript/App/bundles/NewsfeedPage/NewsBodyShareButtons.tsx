import * as React from 'react'
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  RedditShareButton,
  EmailShareButton,
} from 'react-share'
import { createStyles, withStyles } from '@material-ui/core/styles'

const styles = (theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      marginLeft: 12,
      marginRight: 12,
      fontSize: 20,
      color: 'rgba(0, 0, 0, .54)',
      cursor: 'pointer',
    },
  })

interface Props {
  classes: any
  url: string
}

const NewsBodyShareButtons: React.StatelessComponent<Props> = (props) => {
  const { url, classes } = props

  return (
    <div className={classes.root}>
      <FacebookShareButton className={classes.button} url={url}>
        <i className="fa fa-facebook-square" />
      </FacebookShareButton>

      <TwitterShareButton className={classes.button} url={url}>
        <i className="fa fa-twitter" />
      </TwitterShareButton>

      <TelegramShareButton className={classes.button} url={url}>
        <i className="fa fa-telegram" />
      </TelegramShareButton>

      <RedditShareButton className={classes.button} url={url}>
        <i className="fa fa-reddit" />
      </RedditShareButton>

      <EmailShareButton className={classes.button} url={url}>
        <i className="fa fa-envelope" />
      </EmailShareButton>

      <LinkedinShareButton className={classes.button} url={url}>
        <i className="fa fa-linkedin" />
      </LinkedinShareButton>
    </div>
  )
}

export default withStyles(styles)(NewsBodyShareButtons)
