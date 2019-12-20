import * as React from 'react'
import { Tweet } from 'react-twitter-widgets'
import CoinTags from '../common/components/CoinTags'
import { NewsItem } from './types'
import { getTweetId } from '~/bundles/common/utils/url'
import { CoinClickHandler } from '../common/types'
import CallToAction from './CallToAction'
import { withStyles, createStyles } from '@material-ui/core/styles'
import {
  withThemeType,
  ThemeContextType,
} from '~/bundles/common/contexts/ThemeContext'
import TagAlt from '~/bundles/common/components/TagAlt'

interface Props extends ThemeContextType {
  classes: any
  newsItem: NewsItem
  loggedIn: boolean
  onCoinClick?: CoinClickHandler
}

const styles = (theme) => {
  return createStyles({
    root: {
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.paper,
      padding: '2rem',
      minHeight: '100%',
    },
  })
}

class NewsBody extends React.Component<Props, {}> {
  public render() {
    const { newsItem, loggedIn, classes, isDarkMode } = this.props

    if (!newsItem) {
      return null
    }

    const tweetId = getTweetId(newsItem.url)

    const categories = newsItem.categories

    const tweetOptions = {
      ...(isDarkMode && { theme: 'dark' }),
    }

    return (
      <div className={classes.root}>
        <CoinTags
          itemWithCoinLinkData={newsItem}
          getLink={(data) => `/news/${data.slug}`}
          onClick={this.props.onCoinClick}
        />
        {categories.length > 0 && (
          <div className="mt3">
            {categories.map((category, index) => (
              <TagAlt key={index} tag={category.name} />
            ))}
          </div>
        )}
        <Tweet tweetId={tweetId} options={tweetOptions} />
        {!loggedIn && <CallToAction alignLeft={true} />}
      </div>
    )
  }
}

export default withStyles(styles)(withThemeType(NewsBody))
