import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classnames from 'classnames'
import withDevice from '~/bundles/common/utils/withDevice'
import { DeviceContextType } from '~/bundles/common/contexts/DeviceContext'
import * as _ from 'lodash'

const styles = (theme) =>
  createStyles({
    title: {
      color: 'black',
      fontWeight: 500,
      fontSize: 20,
    },
    panel: {
      background: 'none',
      border: 0,
      boxShadow: 'none',
    },
    panelSummary: {
      padding: 0,
      margin: 0,
      minHeight: '0 !important',
      borderBottom: 'solid 1px #4a4a4a',
    },
    panelDetails: {
      padding: 0,
      fontSize: 18,
    },
    panelSummaryContent: {
      margin: '12px 0 !important',
    },
    panelExpandIcon: {
      right: 0,
    },
    activeText: {
      color: '#2faeed',
      fontWeight: 'bold',
      paddingBottom: '0 !important',
    },
    tableRow: {
      // Table striping is enabled for all `<tr>`s by default with a global and an extremely
      // specific css rule
      background: 'none !important',
    },
    tableCell: {
      paddingTop: 20,
      paddingBottom: 20,
      verticalAlign: 'top',
      // Table border is enabled for all `<td>`s by default with a global and an extremely specific
      // css rule
      borderTop: 'none !important',
    },
    rowLabel: {
      fontWeight: 600,
    },
    buyLabel: {
      color: '#017b30',
    },
    sellLabel: {
      color: '#a3393a',
    },
  })

interface State {
  expanded: boolean
}

interface Props extends DeviceContextType {
  classes: any
  initialExpanded?: boolean
  title: string
  buyDescription?: string
  sellDescription?: string
  active?: boolean
}

class SignalExamplePanel extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    // Set the panel to be expanded by default unless it is on mobile
    const defaultExpanded = !props.isMobile

    this.state = {
      expanded: !_.isUndefined(props.initialExpanded)
        ? props.initialExpanded
        : defaultExpanded,
    }
  }

  public handleExpansionChange = (
    event: React.ChangeEvent<{}>,
    expanded: boolean,
  ) => {
    this.setState({
      expanded,
    })
  }

  public render() {
    const {
      classes,
      title,
      buyDescription,
      sellDescription,
      active,
    } = this.props

    return (
      <div className={classes.root}>
        <ExpansionPanel
          className={classes.panel}
          expanded={this.state.expanded}
          onChange={this.handleExpansionChange}
        >
          <ExpansionPanelSummary
            classes={{
              root: classes.panelSummary,
              content: classes.panelSummaryContent,
              expandIcon: classes.panelExpandIcon,
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <Typography className={classes.title}>{title}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.panelDetails}>
            <table>
              <tbody>
                {active && (
                  <tr className={classes.tableRow}>
                    <td
                      className={classnames(
                        classes.tableCell,
                        classes.activeText,
                      )}
                      colSpan={2}
                    >
                      Active! Our beta users are trading with this signal.
                    </td>
                  </tr>
                )}

                {buyDescription && (
                  <tr className={classes.tableRow}>
                    <td
                      className={classnames(
                        classes.tableCell,
                        classes.rowLabel,
                        classes.buyLabel,
                      )}
                    >
                      Buy
                    </td>
                    <td className={classes.tableCell}>{buyDescription}</td>
                  </tr>
                )}

                {sellDescription && (
                  <tr className={classes.tableRow}>
                    <td
                      className={classnames(
                        classes.tableCell,
                        classes.rowLabel,
                        classes.sellLabel,
                      )}
                    >
                      Sell
                    </td>
                    <td className={classes.tableCell}>{sellDescription}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

export default withDevice(withStyles(styles)(SignalExamplePanel))
