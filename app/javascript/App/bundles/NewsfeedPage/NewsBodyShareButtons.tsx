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
      color: theme.palette.text.secondary,
      cursor: 'pointer',
    },
  })

interface Props {
  classes: any
  url: string
  twitterButtonProps?: any
  facebookButtonProps?: any
  linkedinButtonProps?: any
  telegramButtonProps?: any
  redditButtonProps?: any
  emailButtonProps?: any
}

const NewsBodyShareButtons: React.StatelessComponent<Props> = (props) => {
  const {
    classes,
    url,
    twitterButtonProps,
    facebookButtonProps,
    linkedinButtonProps,
    telegramButtonProps,
    redditButtonProps,
    emailButtonProps,
  } = props

  return (
    <div className={classes.root}>
      <TwitterShareButton
        className={classes.button}
        url={url}
        {...twitterButtonProps || {}}
      >
        <i className="fab fa-twitter twitter" />
      </TwitterShareButton>

      <FacebookShareButton
        className={classes.button}
        url={url}
        {...facebookButtonProps || {}}
      >
        <i className="fab fa-facebook-square facebook" />
      </FacebookShareButton>

      <LinkedinShareButton
        className={classes.button}
        url={url}
        {...linkedinButtonProps || {}}
      >
        <i className="fab fa-linkedin linkedin" />
      </LinkedinShareButton>

      <TelegramShareButton
        className={classes.button}
        url={url}
        {...telegramButtonProps || {}}
      >
        {/* Using `safari` font-awesome-brand-color since it's the closest to Telegram brand color */}
        <i className="fab fa-telegram-plane safari" />
      </TelegramShareButton>

      <RedditShareButton
        className={classes.button}
        url={url}
        {...redditButtonProps || {}}
      >
        <i className="fab fa-reddit reddit" />
      </RedditShareButton>

      <EmailShareButton
        className={classes.button}
        url={url}
        {...emailButtonProps || {}}
      >
        <i className="fas fa-envelope" />
      </EmailShareButton>
    </div>
  )
}

export default withStyles(styles)(NewsBodyShareButtons)
