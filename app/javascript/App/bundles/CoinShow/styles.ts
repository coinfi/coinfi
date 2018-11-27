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
    },
    leftPanelGrid: {
      paddingTop: '0 !important',
    },
    leftPanelCard: {
      borderLeft: '1px solid #e5e8ed',
      borderRight: '1px solid #e5e8ed',
    },
    mainPanel: {
      // margin: '0 !important',
      paddingTop: '0 !important',
      paddingBottom: '0 !important',
    },
    mainContainer: {
      // margin: '0 !important',
    },
    chartContainer: {},
    widgetContainer: {
      [theme.breakpoints.down('sm')]: {
        paddingTop: '0 !important',
      },
    },
    header: {},
    searchBarCard: {
      backgroundColor: '#f7f8fa', // athens
      border: '1px solid #e5e8ed', // athens-darker
      height: '60px', // taken from CoinListHeader.js (+! for bottom border)
      display: 'flex',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        padding: '8px 16px',
      },
    },
    mobileCoinButton: {
      borderRadius: 0,
      display: 'inline-flex',
      padding: '16px',
      textTransform: 'none',
      background: '#2495ce',
      marginLeft: '0 !important',
      flex: 0,
    },
    topBarWrapper: {
      border: '1px solid #e5e8ed', // athens-darker
      marginTop: '-1px !important', // hide top border
    },
    titleBar: {
      backgroundColor: '#fff',
      padding: '8px',
    },
    tabsRoot: {
      backgroundColor: '#fff',
    },
    tabRoot: {
      textTransform: 'none',
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
      },
    },
    coinImage: {
      alignSelf: 'flex-start',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 100%',
        textAlign: 'center',
        marginTop: `${theme.spacing.unit * 1.5}px`,
        marginBottom: `${theme.spacing.unit * 1.5}px`,
      },
    },
    coinName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 50%',
        paddingRight: `${theme.spacing.unit * 0.75}px`,
        textAlign: 'right',
        marginBottom: `${theme.spacing.unit * 0.5}px`,
      },
    },
    coinSymbol: {
      fontSize: '1rem',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit * 1.5}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 50%',
        paddingLeft: `${theme.spacing.unit * 0.75}px`,
        textAlign: 'left',
        marginBottom: `${theme.spacing.unit * 0.5}px`,
      },
    },
    coinPrice: {
      fontSize: '1rem',
      fontWeight: 'bold',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit * 1.5}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 33%',
        textAlign: 'center',
      },
    },
    coinChange: {
      fontSize: '0.8rem',
      [theme.breakpoints.up('md')]: {
        marginRight: `${theme.spacing.unit * 1.5}px`,
      },
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 33%',
        textAlign: 'center',
      },
    },
    watchButtonContainer: {
      [theme.breakpoints.down('sm')]: {
        flex: '1 0 33%',
        textAlign: 'center',
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
    mainCard: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
      borderRadius: '2px',
      border: '1px solid #e5e8ed',
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
  })

export default styles
