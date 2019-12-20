import { createStyles } from '@material-ui/core/styles'
import {
  borderColor,
  black87,
  aqua,
  black54,
} from '~/bundles/common/styles/colors'
import { btnSm } from '~/bundles/common/styles/buttons'

const styles = (theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    container: {
      marginTop: '0 !important',
      marginBottom: '0 !important',
      minHeight: '100vh',
    },
    leftPanelGrid: {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
    leftPanelCard: {
      height: '100%',
      borderLeft: `1px solid ${borderColor}`,
      borderRight: `1px solid ${borderColor}`,
      fontSize: '14px',
      '& .coinlist-tab': {
        height: '45px',
      },
      '& .coinlist-root': {
        scrollbarWidth: 'none', // firefox no scrollbars
        '&::-webkit-scrollbar': {
          // webkit no scrollbars
          display: 'none',
        },
      },
      '& .fa-star': {
        fontSize: '100%',
      },
      '& .coinlist-coin-symbol': {
        fontSize: '14px',
      },
      '& .coinlist-coin-details': {
        fontSize: '14px',
        '& .coinlist-coin-change': {
          fontSize: '12px !important',
          fontWeight: 500,
          marginTop: '8px',
        },
      },
      '& .coinlist-cta': {
        fontSize: '14px',
      },
      '& .coinlist-cta-btn': {
        ...btnSm(theme),
      },
    },
    mainPanel: {
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
    mainContainer: {
      marginBottom: '0 !important',
    },
    contentContainer: {
      [theme.breakpoints.up('md')]: {
        maxWidth: '70%',
        flexBasis: '70%',
      },
    },
    widgetContainer: {
      [theme.breakpoints.up('md')]: {
        maxWidth: '30%',
        flexBasis: '30%',
      },
    },
    header: {},
    searchBarCard: {
      backgroundColor: '#f7f8fa', // athens
      border: `1px solid ${borderColor}`,
      height: '47px', // to match with .coinlist-tab
      display: 'flex',
      alignItems: 'center',
      overflow: 'unset',
      '& .search-field': {
        '& .f5': {
          fontSize: '14px !important',
        },
      },
      [theme.breakpoints.up('md')]: {
        padding: '8px 16px',
        justifyContent: 'space-between',
      },
    },
    mobileCoinButton: {
      borderRadius: '2px',
      display: 'inline-flex',
      padding: '16px',
      textTransform: 'none',
      background: '#2495ce',
      marginLeft: '16px !important',
      marginRight: '0 !important',
      flex: 0,
    },
    topBarWrapper: {
      border: `1px solid ${borderColor}`,
      borderTop: 'none',
    },
    tabsRoot: {
      backgroundColor: '#fff',
    },
    tabRoot: {
      textTransform: 'none',
      minWidth: 'unset',
      fontSize: '14px',
      [theme.breakpoints.down('sm')]: {
        whiteSpace: 'nowrap',
      },
    },
    tabSelected: {
      fontWeight: 600,
    },
    tabLabelContainer: {
      paddingRight: '12px',
      paddingLeft: '12px',
      '&:hover': {
        color: theme.palette.primary.main,
        fontWeight: 600,
      },
    },
    cardHeader: {
      paddingBottom: 0,
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: 500,
      color: black87,
      marginBottom: 0,
    },
    priceChart: {},
    lastUpdated: {
      textAlign: 'right',
      fontStyle: 'italic',
      fontSize: '12px',
    },
    tokenMetricHeader: {
      [theme.breakpoints.up('md')]: {
        '&:first-child': {
          marginTop: '10px',
        },
        '&:not(:first-child)': {
          marginTop: '30px',
        },
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: '16px', // container has a -8px margin
        marginTop: '10px',
      },
    },
    tokenMetricHeaderText: {
      fontSize: '20px',
      fontWeight: 500,
      color: black87,
    },
    tokenChartCardContent: {
      padding: '18px 8px 0 0 !important',
    },
    tokenCardContent: {
      padding: '30px 24px !important',
      textAlign: 'center',
      color: black87,
    },
    tokenMetricValue: {
      fontSize: '35px',
      fontWeight: 600,
    },
    tokenMetricSubtitle: {
      textAlign: 'center',
      fontSize: '16px',
    },
    marketsCardContent: {
      padding: '0 !important',
    },
    marketsChartWrapper: {
      [theme.breakpoints.down('sm')]: {
        '&:not(:first-child)': {
          marginTop: '16px',
        },
      },
    },
    progressWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      '& *:not(:first-child)': {
        marginTop: '10px',
      },
    },
    expansionRoot: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
      borderRadius: '2px',
      border: `1px solid ${borderColor}`,
      '&:before': {
        backgroundColor: 'unset',
      },
    },
    expansionDetails: {
      display: 'block',
    },
    subCardHeader: {
      paddingBottom: 0,
      marginBottom: 0,
    },
    subCardTitle: {
      color: black87,
      fontSize: '16px',
      fontWeight: 500,
    },
    subCardContent: {
      paddingTop: '12px',
    },
    ctaCardContent: {
      padding: '0 !important',
    },
    ctaRoot: {
      fontSize: '16px',
      padding: '30px 20px 25px',
      '& > *': {
        marginBottom: '25px',
      },
    },
    ctaImage: {
      textAlign: 'center',
      '& img': {
        height: '65px',
      },
    },
    ctaTitle: {
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: 500,
    },
    ctaIconContainer: {
      textAlign: 'right',
      paddingRight: '10px',
      alignSelf: 'center',
    },
    ctaIcon: {
      color: '#50ba53',
    },
    ctaButtonContainer: {
      textAlign: 'center',
    },
    ctaButton: {
      textTransform: 'none',
      boxShadow: 'none !important',
      backgroundColor: '#2faeed !important', // sky-blue
      color: '#fff !important',
      fontSize: '16px',
      fontWeight: 600,
    },
    linkListItem: {
      padding: '0',
    },
    linkListText: {
      fontSize: '16px',
    },
    infoIcon: {
      verticalAlign: 'baseline',
      marginLeft: '16px',
      fontSize: '12px',
      fontWeight: 500,
    },
    infoTooltip: {
      fontSize: '12px',
      fontWeight: 500,
      textAlign: 'justify',
      '& div:not(:first-child)': {
        marginTop: '8px',
      },
      '& ul': {
        marginTop: '0 !important',
      },
    },
    alarmClockIcon: {
      verticalAlign: 'baseline',
      marginRight: '8px',
      color: aqua,
    },
    signalCtaText: {
      fontSize: '12px',
      marginTop: '24px',
    },
    descriptionCardContent: {
      color: black87,
      lineHeight: '1.3em',
      '& .hidden': {
        display: 'none',
      },
    },
    readMore: {
      textAlign: 'right',
    },
    watchButtonContainer: {
      textAlign: 'right',
      [theme.breakpoints.down('sm')]: {
        marginTop: `${theme.spacing.unit * 2}px`,
      },
    },
    watchButton: {
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '4px',
      padding: '4px',
      fontSize: '12px',
      fontWeight: 600,
      lineHeight: '16px',
      fontFamily: 'Avenir, sans-serif',
      '& i': {
        verticalAlign: 'middle',
        fontSize: '8px',
      },
    },
    watchedButton: {
      backgroundColor: '#40a9ff',
      color: '#fff',
    },
    unwatchedButton: {
      backgroundColor: '#fff',
      color: '#40a9ff',
    },
    breadcrumbsContainer: {
      margin: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px 0`,
      width: `calc(100% - ${theme.spacing.unit * 4}px)`,
      '& a': {
        color: black54,
      },
    },
    backToTopFab: {
      position: 'fixed',
      bottom: `${theme.spacing.unit * 2}px`,
      right: `${theme.spacing.unit * 4}px`,
    },
  })

export default styles
