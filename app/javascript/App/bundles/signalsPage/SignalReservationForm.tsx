import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

const styles = (theme) => ({
  root: {},
  stepper: {
    padding: 0,
  },
  successMessage: {
    marginTop: theme.spacing.unit * 4,
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
  fields: {
    maxWidth: 300,
    width: '100%',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
})

interface Props {
  classes: any
}

interface State {
  activeStep: number
  formData: {
    email: string
    telegramUsername: string
    walletAddress: string
  }
}

class SignalReservationForm extends React.Component<Props, State> {
  public STEP_COUNT = 3

  public state = {
    activeStep: 0,
    formData: {
      email: '',
      telegramUsername: '',
      walletAddress: '',
    },
  }

  public handleNext = () => {
    this.setState((state) => ({
      activeStep: state.activeStep + 1,
    }))
  }

  public handleBack = () => {
    this.setState((state) => ({
      activeStep: state.activeStep - 1,
    }))
  }

  public handleFieldChange = (key) => (event) => {
    this.setState((state) => ({
      formData: {
        ...state.formData,
        [key]: event.target.value,
      },
    }))
  }

  public renderBackButton = () => {
    const { classes } = this.props
    const { activeStep } = this.state

    return (
      <Button
        disabled={activeStep === 0}
        onClick={this.handleBack}
        className={classes.button}
      >
        Back
      </Button>
    )
  }

  public renderNextButton = (text = 'Next') => {
    const { classes } = this.props

    return (
      <Button
        variant="contained"
        color="primary"
        onClick={this.handleNext}
        className={classes.button}
      >
        {text}
      </Button>
    )
  }

  public render() {
    const { classes } = this.props
    const { activeStep } = this.state

    return (
      <div className={classes.root}>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical"
        >
          <Step>
            <StepLabel
            >{`Where would you like to receive trading signals?`}</StepLabel>
            <StepContent>
              <div className={classes.fields}>
                <TextField
                  label="Email"
                  className={classes.textField}
                  value={this.state.formData.email}
                  onChange={this.handleFieldChange('name')}
                  margin="normal"
                  fullWidth={true}
                />
                <TextField
                  label="Telegram username"
                  className={classes.textField}
                  value={this.state.formData.telegramUsername}
                  onChange={this.handleFieldChange('telegramUsername')}
                  margin="normal"
                  fullWidth={true}
                />
              </div>

              <div className={classes.actionsContainer}>
                {this.renderBackButton()}
                {this.renderNextButton()}
              </div>
            </StepContent>
          </Step>

          <Step>
            <StepLabel
            >{`Which wallet will you send your COFI tokens from?`}</StepLabel>
            <StepContent>
              <Typography>
                We need to know what your wallet address is so that we know it’s
                you when you send tokens to us for staking.
              </Typography>

              <div className={classes.fields}>
                <TextField
                  label="Your ETH wallet address"
                  className={classes.textField}
                  value={this.state.formData.walletAddress}
                  onChange={this.handleFieldChange('walletAddress')}
                  margin="normal"
                  fullWidth={true}
                />
              </div>

              <div className={classes.actionsContainer}>
                {this.renderBackButton()}
                {this.renderNextButton()}
              </div>
            </StepContent>
          </Step>

          <Step>
            <StepLabel>{`Check your email for staking instructions`}</StepLabel>
            <StepContent>
              <Typography>
                Almost there! Finish your reservation by following the
                instructions sent to your email.
              </Typography>

              <div className={classes.actionsContainer}>
                {this.renderBackButton()}
                {this.renderNextButton('Finish')}
              </div>
            </StepContent>
          </Step>
        </Stepper>

        {activeStep === this.STEP_COUNT && (
          <Typography className={classes.successMessage}>
            Thank you for your interest in CoinFi Trading Signals beta!
          </Typography>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(SignalReservationForm)
