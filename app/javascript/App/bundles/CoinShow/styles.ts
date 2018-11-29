import { createStyles } from '@material-ui/core'

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
      borderLeft: '1px solid #e5e8ed',
      borderRight: '1px solid #e5e8ed',
      '& .fa-star': {
        fontSize: '10px',
      },
      '& .f5': {
        fontSize: '14px',
      },
      '& .right-align': {
        fontSize: '14px',
        '& .smaller2': {
          fontSize: '12px !important',
          fontWeight: 500,
          marginTop: '8px',
        },
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
    chartContainer: {},
    widgetContainer: {
      [theme.breakpoints.up('md')]: {
        maxWidth: '30%',
        flexBasis: '30%',
      },
    },
    header: {},
    searchBarCard: {
      backgroundColor: '#f7f8fa', // athens
      border: '1px solid #e5e8ed', // athens-darker
      height: '60px', // taken from CoinListHeader.js (+! for bottom border)
      display: 'flex',
      alignItems: 'center',
      '& .search-field': {
        '& .f5': {
          fontSize: '14px !important',
        },
      },
      [theme.breakpoints.up('md')]: {
        padding: '8px 16px',
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
      border: '1px solid #e5e8ed', // athens-darker
      marginTop: '-1px !important', // hide top border
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
    },
    newsLabelIcon: {
      marginLeft: '0.25rem',
      marginBottom: '0.25rem',
    },
    mainCard: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
      borderRadius: '2px',
      border: '1px solid #e5e8ed',
    },
    cardHeader: {
      fontSize: '16px',
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.87)',
    },
    tokenMetricHeader: {
      textSize: '20px',
      fontWeight: 500,
      color: 'rgba(0, 0, 0, 0.87)',
      paddingLeft: '8px',
    },
    expansionRoot: {
      '&:before': {
        backgroundColor: 'unset',
      },
    },
    expansionDetails: {
      display: 'block',
    },
    subCard: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
      width: '100%',
      borderRadius: '2px',
      border: '1px solid #e5e8ed',
    },
    subCardHeader: {
      paddingBottom: 0,
    },
    subCardTitle: {
      color: 'rgba(0, 0, 0, 0.87)',
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
  })

export default styles
