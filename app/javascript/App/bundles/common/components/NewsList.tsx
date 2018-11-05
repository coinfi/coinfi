import * as React from 'react'
import * as _ from 'lodash'
import timeago from 'timeago.js'
import localAPI from '../utils/localAPI'
import LoadingIndicator from '~/bundles/common/components/LoadingIndicator'
import { Typography, Grid } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import Favicon from '~/bundles/common/components/Favicon'
import BulletSpacer from '~/bundles/common/components/BulletSpacer'
import { formatNewsUrl } from '~/bundles/common/utils/news'
import { NewsItem } from '../../NewsfeedPage/types'
import CoinTags from './CoinTags'

enum STATUSES {
  INITIALIZING = 'INITIALIZING',
  LOADING = 'LOADING',
  READY = 'READY',
}

interface Props {
  classes: any
}

interface State {
  status: STATUSES
  sortedNewsItems: NewsItem[]
}

const styles = (theme) =>
  createStyles({
    listItem: {
      borderBottom: '1px solid #e5e8ed',
      marginBottom: `${theme.spacing.unit * 2}px`,
      [theme.breakpoints.down('sm')]: {
        paddingLeft: `${theme.spacing.unit * 2}px`,
        paddingRight: `${theme.spacing.unit * 2}px`,
      },
    },
    listItemHeader: {
      fontSize: '1rem',
      marginBottom: '0.25em !important',
    },
    listItemFooterContainer: {
      marginBottom: '0.5em',
    },
    listItemFooter: {
      color: '#999',
      fontSize: '0.875rem',
    },
    listCoins: {},
    listFooter: {
      textAlign: 'right',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
        backgroundColor: '#f6f8fa',
        borderBottom: '1px solid #e5e8ed',
        paddingTop: `${theme.spacing.unit * 2}px`,
        marginTop: `-${theme.spacing.unit * 2}px`,
      },
    },
  })

class NewsList extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      status: STATUSES.INITIALIZING,
      sortedNewsItems: [],
    }
  }

  public sortNewsFunc(x: NewsItem, y: NewsItem) {
    return (
      Date.parse(y.feed_item_published_at) -
      Date.parse(x.feed_item_published_at)
    )
  }

  public uniqNews = (arr: NewsItem[]) => {
    return _.uniqBy<NewsItem>(arr, (elem) => elem.id)
  }

  public fetchNewsItems = (): Promise<NewsItem[]> => {
    return new Promise((resolve, reject) => {
      this.setState(
        {
          status: STATUSES.LOADING,
        },
        () => {
          localAPI.get('/news', { frontPage: true }).then((response) => {
            const sortedNewsItems = this.uniqNews(
              response.payload.sort(this.sortNewsFunc),
            )
            this.setState(
              {
                sortedNewsItems,
                status: STATUSES.READY,
              },
              () => resolve(sortedNewsItems),
            )
          })
        },
      )
    })
  }

  public componentDidMount() {
    this.fetchNewsItems()
  }

  public render() {
    const { classes } = this.props
    const { sortedNewsItems, status } = this.state
    const isLoading = status !== STATUSES.READY

    if (isLoading) {
      return <LoadingIndicator />
    }

    return (
      <Grid
        container={true}
        direction="column"
        justify="center"
        alignItems="stretch"
      >
        {sortedNewsItems.map((newsItem) => {
          const { linkUrl, linkText } = formatNewsUrl(newsItem.url)
          return (
            <Grid
              container={true}
              item={true}
              key={newsItem.id}
              direction="column"
              justify="center"
              alignItems="stretch"
              className={classes.listItem}
            >
              <Grid item={true}>
                <Typography variant="h6" className={classes.listItemHeader}>
                  {newsItem.title}
                </Typography>
              </Grid>
              <Grid
                container={true}
                item={true}
                justify="space-between"
                className={classes.listItemFooterContainer}
              >
                <Grid item={true}>
                  <Typography
                    component="div"
                    className={classes.listItemFooter}
                  >
                    <Favicon
                      url={linkUrl}
                      style={{ height: 12, paddingRight: '0.5em' }}
                    />
                    <a
                      href={linkUrl}
                      target="_blank noopener noreferrer"
                      rel="nofollow"
                      className="dib silver"
                    >
                      {linkText}
                    </a>
                    <BulletSpacer />
                    {timeago().format(newsItem.feed_item_published_at)}
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <CoinTags itemWithCoinLinkData={newsItem} />
                </Grid>
              </Grid>
            </Grid>
          )
        })}
        <Grid item={true} className={classes.listFooter}>
          <Typography>
            <a href="/news">View more cryptocurrency news</a>
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(NewsList)
