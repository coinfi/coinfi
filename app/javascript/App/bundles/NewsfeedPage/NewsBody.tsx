import * as React from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import * as _ from 'lodash'
import CoinTags from '../common/components/CoinTags'
import BulletSpacer from '../../components/BulletSpacer'
import Icon from '~/bundles/common/components/Icon'
import localAPI from '../../lib/localAPI'

import TwitterBody from './TwitterBody'
import LoadingIndicator from '../../components/LoadingIndicator'
import { getDomainType } from '../../lib/utils/url'

import { NewsItem } from './types'
import NewsBodyShareButtons from './NewsBodyShareButtons'
import { RailsConsumer } from '~/bundles/common/contexts/RailsContext'

interface Props {
  newsItemId: string
}

interface State {
  newsItem: NewsItem
}

export default class NewsBody extends React.Component<Props, State> {
  public state = {
    newsItem: null,
  }

  public componentDidMount() {
    if (!!this.props.newsItemId) {
      this.fetchNewsItemDetails()
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State, snapshot) {
    if (!this.props.newsItemId) {
      if (!!prevState.newsItem) {
        this.setState({ newsItem: null })
      }
    } else {
      if (
        !prevProps.newsItemId ||
        prevProps.newsItemId !== this.props.newsItemId
      ) {
        this.setState({ newsItem: null }, () => this.fetchNewsItemDetails())
      }
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
            <Icon name="link" className="mr1 f7" styleType="regular" />
            {newsItem.url}
          </a>
        </div>
        <div className="mb3 f6">
          <Icon name="clock" className="mr1 f7" styleType="regular" />
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
