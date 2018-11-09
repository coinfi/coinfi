import { createStyles } from '@material-ui/core'

const styles = (theme) =>
  createStyles({
    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    leftPanel: {
      borderLeft: '1px solid #e5e8ed',
      borderRight: '1px solid #e5e8ed',
      minWidth: '250px',
    },
    mainPanel: {},
    mainContainer: {
      margin: '0 !important',
      width: '100% !important',
    },
    chartContainer: {
      [theme.breakpoints.up('md')]: {
        maxWidth: '700px',
      },
    },
    widgetContainer: {
      [theme.breakpoints.up('md')]: {
        maxWidth: '250px',
      },
      [theme.breakpoints.down('sm')]: {
        paddingTop: '0 !important',
      },
    },
    searchBar: {
      backgroundColor: '#f7f8fa', // athens
      border: '1px solid #e5e8ed', // athens-darker
      borderLeft: 'none',
      borderTop: 'none',
      height: '60px', // taken from CoinListHeader.js (+! for bottom border)
      display: 'flex',
      alignItems: 'center',
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
    titleBar: {
      backgroundColor: '#fff',
    },
    tabBar: {
      padding: '0 !important',
      backgroundColor: '#fff',
    },
    tabsRoot: {},
    tabRoot: {
      [theme.breakpoints.down('sm')]: {
        fontSize: '0.7rem',
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
    },
    subCard: {
      padding: 0,
      marginBottom: `${theme.spacing.unit * 2}px`,
      '&:last-child': {
        marginBottom: 0,
      },
      width: '100%',
    },
    subCardHeader: {
      paddingBottom: 0,
    },
  })

export default styles
