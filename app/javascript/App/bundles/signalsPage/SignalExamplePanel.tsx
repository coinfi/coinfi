import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const styles = (theme) =>
  createStyles({
    root: {},
  })

interface State {
  expanded: boolean
}

interface Props {
  classes: any
  initialExpanded: boolean
  title: string
  buyDescription?: string
  sellDescription?: string
}

class SignalExamplePanel extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      expanded: props.initialExpanded || false,
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
    const { classes, title, buyDescription, sellDescription } = this.props

    return (
      <div className={classes.root}>
        <ExpansionPanel
          expanded={this.state.expanded}
          onChange={this.handleExpansionChange}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{title}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <table>
              <tbody>
                {buyDescription && (
                  <tr>
                    <td>Buy</td>
                    <td>{buyDescription}</td>
                  </tr>
                )}

                {sellDescription && (
                  <tr>
                    <td>Sell</td>
                    <td>{sellDescription}</td>
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

export default withStyles(styles)(SignalExamplePanel)
