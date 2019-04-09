import * as React from 'react'
import * as _ from 'lodash'
import * as moment from 'moment'
import localAPI from '../utils/localAPI'
import LoadingIndicator from '~/bundles/common/components/LoadingIndicator'
import { Typography, Grid } from '@material-ui/core'
import { withStyles, createStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import Favicon from '~/bundles/common/components/Favicon'
import BulletSpacer from '~/bundles/common/components/BulletSpacer'
import { formatNewsUrl } from '~/bundles/common/utils/news'
import CoinTags from './CoinTags'
import slugify from '~/bundles/common/utils/slugify'
import { NewsItem } from '../../NewsfeedPage/types'
import Votes from '../../NewsfeedPage/Votes'
import { CoinLinkData } from '../types'

enum STATUSES {
  INITIALIZING = 'INITIALIZING',
  LOADING = 'LOADING',
  READY = 'READY',
}

interface Props {
  classes: any
  maxNewsItems?: number
}

interface State {
  status: STATUSES
  sortedNewsItems: NewsItem[]
}

const styles = (theme) =>
  createStyles({
    root: {
      background: '#fff',
      [theme.breakpoints.up('md')]: {
        height: '100%',
        border: '1px solid #e5e8ed',
        borderRadius: '2px',
        padding: '16px 24px',
      },
    },
    wrapper: {
      flex: 1,
    },
    container: {
      height: '100%',
    },
    loadingWrapper: {
      margin: 'auto',
    },
    newsWidgetHeader: {
      [theme.breakpoints.down('sm')]: {
        fontSize: '26px',
        fontWeight: 400,
        textAlign: 'center',
        borderBottom: '1px solid #e5e8ed',
        paddingTop: `16px !important`,
        paddingBottom: `8px !important`,
        marginBottom: '16px !important',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '20px',
        fontWeight: 500,
        textAlign: 'left',
        paddingBottom: '16px !important',
      },
    },
    listItem: {
      borderBottom: '1px solid #e5e8ed',
      marginBottom: '16px',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '16px',
        paddingRight: '16px',
      },
    },
    lastListItem: {
      [theme.breakpoints.up('md')]: {
        marginBottom: '0 !important',
      },
    },
    listItemHeader: {
      fontSize: '1rem',
      marginBottom: '0.25em !important',
      '& a': {
        color: 'unset',
      },
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
        paddingTop: '16px',
        marginTop: '-16px',
        paddingBottom: '16px',
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
    const maxNewsItems = this.props.maxNewsItems || 5

    return new Promise((resolve, reject) => {
      this.setState(
        {
          status: STATUSES.LOADING,
        },
        () => {
          localAPI.get('/news', { frontPage: true }).then((response) => {
            const sortedNewsItems = this.uniqNews(
              response.payload.sort(this.sortNewsFunc),
            ).slice(0, maxNewsItems)
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

  public componentDidUpdate(prevProps) {
    if (prevProps.maxNewsItems !== this.props.maxNewsItems) {
      this.fetchNewsItems()
    }
  }

  public handleCoinClick = (coinData: CoinLinkData) => {
    window.location.href = `/news/${coinData.slug}`
  }

  public getNewsLink = (newsItem: NewsItem) => {
    return `/news/${newsItem.id}/${slugify(newsItem.title)}`
  }

  public handleNewsClick = (newsItem: NewsItem) => {
    window.location.href = this.getNewsLink(newsItem)
  }

  public render() {
    const { classes } = this.props
    const { sortedNewsItems, status } = this.state
    const isLoading = status !== STATUSES.READY

    return (
      <Grid container={true} direction="column" className={classes.root}>
        <Grid item={true}>
          <Typography
            variant="h2"
            align="center"
            className={classes.newsWidgetHeader}
          >
            Latest Cryptocurrency News
          </Typography>
        </Grid>
        <Grid item={true} className={classes.wrapper}>
          <Grid
            container={true}
            direction="column"
            justify="space-between"
            alignItems="stretch"
            className={classes.container}
          >
            {isLoading ? (
              <Grid item={true} className={classes.loadingWrapper}>
                <LoadingIndicator />
              </Grid>
            ) : (
              <>
                {sortedNewsItems.map((newsItem, index) => {
                  const { linkUrl, linkText } = formatNewsUrl(newsItem.url)
                  const last = index + 1 === sortedNewsItems.length
                  const listClassName = classnames(
                    classes.listItem,
                    last && classes.lastListItem,
                  )
                  return (
                    <Grid
                      container={true}
                      item={true}
                      direction="column"
                      justify="center"
                      alignItems="stretch"
                      className={listClassName}
                      key={newsItem.id}
                    >
                      <Grid item={true}>
                        <Typography
                          variant="h6"
                          className={classes.listItemHeader}
                        >
                          <a
                            href={this.getNewsLink(newsItem)}
                            onClick={() => this.handleNewsClick(newsItem)}
                          >
                            {newsItem.title}
                          </a>
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
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="dib silver"
                            >
                              {linkText}
                            </a>
                            <BulletSpacer />
                            {moment(newsItem.feed_item_published_at).fromNow()}
                            <BulletSpacer />
                            <Votes initialVote={newsItem.vote_score} />
                          </Typography>
                        </Grid>
                        <Grid item={true}>
                          <CoinTags
                            itemWithCoinLinkData={newsItem}
                            onClick={this.handleCoinClick}
                          />
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
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(NewsList)
