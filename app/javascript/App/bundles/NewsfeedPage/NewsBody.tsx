import * as React from 'react'
import * as moment from 'moment'
import sanitizeHtml from 'sanitize-html'
import * as _ from 'lodash'
import CoinTags from '~/bundles/common/components/CoinTags'
import BulletSpacer from '~/bundles/common/components/BulletSpacer'
import Icon from '~/bundles/common/components/Icon'
import classnames from 'classnames'
import TwitterBody from './TwitterBody'
import CallToAction from './CallToAction'
import LoadingIndicator from '../common/components/LoadingIndicator'
import {
  getDomainType,
  isTwitter,
  getTwitterUsername,
} from '~/bundles/common/utils/url'
import Votes from './Votes'
import { NewsItem } from './types'
import { CoinClickHandler } from '~/bundles/common/types'
import NewsBodyShareButtons from './NewsBodyShareButtons'
import { RailsConsumer } from '~/bundles/common/contexts/RailsContext'
import { Tooltip } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import {
  withNewsfeed,
  NewsfeedContextType,
} from '~/bundles/NewsfeedPage/NewsfeedContext'
import TagAlt from '~/bundles/common/components/TagAlt'

interface Props extends NewsfeedContextType {
  classes: any
  loggedIn: boolean
  initialNewsItem?: NewsItem
  newsItemId?: string
  onCoinClick?: CoinClickHandler
}

interface State {
  newsItem: NewsItem
}

const styles = (theme) => {
  return createStyles({
    root: {
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      minHeight: '100%',
      padding: '1rem',
    },
    hr: {
      borderColor: theme.palette.border.main,
      borderBottomStyle: 'solid',
      borderBottomWidth: '1px',
      marginTop: '1rem',
      marginBottom: '1rem',
    },
    title: {
      wordBreak: 'break-word',
      fontSize: '1.25rem',
      color: `${theme.palette.text.primary} !important`,
    },
    subtitle: {
      color: theme.palette.text.secondary,
      fontSize: '0.875rem',
      marginBottom: '1rem',
    },
    article: {
      lineHeight: 1.5,
      '& hr': {
        border: `0.5px solid ${theme.palette.border.main}`,
      },
      '& br': {
        display: 'block',
        content: '""',
        marginTop: '1rem',
      },
    },
    localTime: {
      cursor: 'default',
    },
    footer: {
      marginBottom: '1rem',
    },
    footerShare: {
      fontSize: '1rem',
      color: theme.palette.text.primary,
    },
  })
}

class NewsBody extends React.Component<Props, State> {
  public cancelSource

  constructor(props) {
    super(props)

    this.cancelSource = props.getCancelFetchSource()

    this.state = {
      newsItem: props.initialNewsItem || null,
    }
  }

  public componentDidMount() {
    if (
      parseInt(this.props.newsItemId, 10) !== _.get(this.state.newsItem, 'id')
    ) {
      this.fetchNewsItemDetails()
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State, snapshot) {
    // Check if news item is unselected
    if (!this.props.newsItemId && prevState.newsItem) {
      return this.setState({ newsItem: null })
    }

    // Check if news item is selected/changed
    if (this.props.newsItemId !== prevProps.newsItemId) {
      return this.setState({ newsItem: null }, () =>
        this.fetchNewsItemDetails(),
      )
    }

    // Change title if news item changed
    if (
      this.state.newsItem !== null &&
      (prevState.newsItem === null ||
        !_.isEqual(prevState.newsItem, this.state.newsItem))
    ) {
      document.title = `CoinFi News - ${this.state.newsItem.title}`
    }
  }

  public componentWillUnmount() {
    this.cancelSource.cancel()
  }

  public fetchNewsItemDetails() {
    this.props
      .fetchNewsItem(
        parseInt(this.props.newsItemId, 10),
        this.cancelSource.token,
      )
      .then((newsItem) => {
        this.setState({
          newsItem,
        })
      })
  }

  public formatContent(content) {
    const formattedContent = content.replace(/(?:\r\n|\r|\n)/g, '<br/>')
    return formattedContent
  }

  public render() {
    const { newsItem } = this.state
    const { classes } = this.props

    if (!newsItem) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    }

    if (getDomainType(newsItem.url) === 'twitter') {
      return (
        <TwitterBody
          newsItem={newsItem}
          onCoinClick={this.props.onCoinClick}
          loggedIn={this.props.loggedIn}
        />
      )
    }

    const categories = newsItem.categories

    const content = this.formatContent(
      _.trim(newsItem.content) || _.trim(newsItem.summary),
    )
    const publishedAt = moment(newsItem.feed_item_published_at)

    return (
      <div
        className={classnames(
          classes.root,
          'selected-news-content', // for query selectors
        )}
      >
        {/* Header */}
        <CoinTags
          itemWithCoinLinkData={newsItem}
          getLink={(data) => `/news/${data.slug}`}
          onClick={this.props.onCoinClick}
        />
        <h1 className={classes.title}>{newsItem.title}</h1>
        <div className={classes.subtitle}>
          <a
            href={newsItem.url}
            target="_blank"
            rel="nofollow"
            className="break-all"
          >
            <Icon name="link" className="mr1 f7" />
            {newsItem.url}
          </a>
        </div>
        <div className={classes.subtitle}>
          <Icon name="clock" className="mr1 f7" />
          <Tooltip
            title={moment.utc(publishedAt).format('lll z')}
            className={classes.localTime}
          >
            <span>{publishedAt.format('lll Z')}</span>
          </Tooltip>
          <BulletSpacer />
          <span>
            <Votes
              newsItemId={newsItem.id}
              showControls={true}
              isLoggedIn={this.props.loggedIn}
            />
          </span>
        </div>
        {categories.length > 0 && (
          <div className="mv3">
            {categories.map((category, index) => (
              <TagAlt key={index} tag={category.name} />
            ))}
          </div>
        )}

        <div className={classes.hr} />

        {/* Content */}
        <div
          className={classes.article}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),
          }}
        />

        <div className={classes.hr} />

        {/* Footer */}
        <div className={classes.footer}>
          <h2 className={classes.footerShare}>Share This Article</h2>
          <RailsConsumer>
            {({ href }) => {
              const initialHref = href
              const hasWindow = !_.isError(_.attempt(() => window))
              const url = hasWindow ? window.location.href : initialHref

              const twitterUsername = isTwitter(newsItem.url)
                ? getTwitterUsername(newsItem.url)
                : undefined

              return (
                <NewsBodyShareButtons
                  url={url}
                  twitterButtonProps={{
                    title: newsItem.title,
                    via: twitterUsername,
                  }}
                />
              )
            }}
          </RailsConsumer>
        </div>

        <br />
        {!this.props.loggedIn && <CallToAction />}
      </div>
    )
  }
}

export default withStyles(styles)(withNewsfeed(NewsBody))
