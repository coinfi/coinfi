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
    heading: {
      fontSize: 16,
      fontWeight: 600,
    },
  })

interface State {
  expanded: boolean
}

interface Props {
  classes: any
  initialExpanded: boolean
  question: string
  answerHtml: string
}

class SignalFaqPanel extends React.Component<Props, State> {
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
    const { classes, question, answerHtml } = this.props

    return (
      <div className={classes.root}>
        <ExpansionPanel
          expanded={this.state.expanded}
          onChange={this.handleExpansionChange}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{question}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div dangerouslySetInnerHTML={{ __html: answerHtml }} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    )
  }
}

export default withStyles(styles)(SignalFaqPanel)
