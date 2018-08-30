import * as React from 'react'
import timeago from 'timeago.js'
import sanitizeHtml from 'sanitize-html'
import _ from 'lodash'
import CoinTags from '../common/components/CoinTags'
import BulletSpacer from '../../components/BulletSpacer'
import Icon from '../../components/Icon'
import localAPI from '../../lib/localAPI'

import TwitterBody from './TwitterBody'
import LoadingIndicator from '../../components/LoadingIndicator'
import { getDomainType } from '../../lib/utils/url'

import { INewsItem } from './types'

interface IProps {
  newsItemId: string,
}

interface IState {
  newsItem: INewsItem,
}

export default class NewsBody extends React.Component<IProps, IState>  {

  public state = {
    newsItem: null,
  }

  public componentDidMount() {
    if (!!this.props.newsItemId) {
      this.fetchNewsItemDetails()
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState, snapshot) {
    if (!this.props.newsItemId) {
      if (!!prevState.newsItem) {
        this.setState({ newsItem: null })
      }
    } else {
      if (!prevProps.newsItemId || prevProps.newsItemId !== this.props.newsItemId) {
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
  
    if(!newsItem) {
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
        <div
          className="lh-copy"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
            }),
          }}
        />
      </div>
    )
  }
}
