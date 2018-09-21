import * as React from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import * as _ from 'lodash'
import CoinTags from '../common/components/CoinTags'
import BulletSpacer from '../../components/BulletSpacer'
import Icon from '../../components/Icon'
import localAPI from '../../lib/localAPI'

import TwitterBody from './TwitterBody'
import LoadingIndicator from '../../components/LoadingIndicator'
import { getDomainType } from '../../lib/utils/url'

import { NewsItem } from './types'
import NewsBodyShareButtons from './NewsBodyShareButtons'
import { RailsConsumer } from '~/bundles/common/contexts/RailsContext'

interface Props {
  initialNewsItem?: NewsItem
  newsItemId?: string
}

interface State {
  newsItem: NewsItem
}

export default class NewsBody extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      newsItem: props.initialNewsItem || null,
    }
  }

  public componentDidMount() {
    if (this.props.newsItemId) {
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
  }

  public fetchNewsItemDetails() {
    localAPI.get(`/news/${this.props.newsItemId}`).then((response) => {
      this.setState({
        newsItem: response.payload,
      })
    })
  }

  public render() {
    const { newsItem } = this.state

    if (!newsItem) {
      return (
        <div className="pa3 tc mt4">
          <LoadingIndicator />
        </div>
      )
    }

    if (getDomainType(newsItem.url) === 'twitter') {
      return <TwitterBody newsItem={newsItem} />
    }

    const categories = newsItem.categories

    const content = _.trim(newsItem.content) || _.trim(newsItem.summary)

    return (
      <div className="pa3 bg-white min-h-100 selected-news-content">
        {/* Header */}
        <CoinTags itemWithCoinLinkData={newsItem} />
        <h1 className="break-word f4">{newsItem.title}</h1>
        <div className="mb3 f6">
          <a
            href={newsItem.url}
            target="_blank"
            rel="nofollow"
            className="break-all"
          >
            <Icon name="link" className="mr1 f7" regular={true} />
            {newsItem.url}
          </a>
        </div>
        <div className="mb3 f6">
          <Icon name="clock" className="mr1 f7" regular={true} />
          {timeago().format(newsItem.feed_item_published_at)}
          <BulletSpacer />
          <span>
            {new Date(newsItem.feed_item_published_at).toLocaleString()}
          </span>
        </div>
        {categories.length > 0 && (
          <div className="mv3">
            {categories.map((category, index) => (
              <div key={index} className="tag-alt">
                {category.name}
              </div>
            ))}
          </div>
        )}

        <div className="mv3 b--b" />

        {/* Content */}
        <div
          className="lh-copy"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),
          }}
        />

        <div className="mv3 b--b" />

        {/* Footer */}
        <div className="mb3">
          <h2 className="f5">Share This Article</h2>
          <RailsConsumer>
            {({ href }) => {
              const initialHref = href
              const hasWindow = !_.isError(_.attempt(() => window))
              const url = hasWindow ? window.location.href : initialHref

              return <NewsBodyShareButtons url={url} />
            }}
          </RailsConsumer>
        </div>
      </div>
    )
  }
}
