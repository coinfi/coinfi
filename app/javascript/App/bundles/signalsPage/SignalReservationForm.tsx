import * as React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import * as Validator from 'validatorjs'
import * as _ from 'lodash'
import axios from 'axios'
import { SIGNALS_RESERVATION_URL } from '~/constants'

const styles = (theme) => ({
  root: {},
  stepper: {
    padding: 0,
  },
  stepLabelText: {
    fontSize: 16,
    fontWeight: 500,
  },
  successMessage: {
    fontSize: 17,
    fontWeight: 600,
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
  textField: {},
})

interface Props {
  classes: any
}

interface State {
  activeStep: number
  formData: {
    email: string
    telegramUsername: string
    ethereumAddress: string
  }
  formErrors: {
    email?: string[]
    telegramUsername?: string[]
    ethereumAddress?: string[]
  }
}

class SignalReservationForm extends React.Component<Props, State> {
  public STEP_COUNT = 3
  public VALIDATION_RULES = {
    email: 'required|email',
    telegramUsername: [
      'required',
      // Telegram regex https://core.telegram.org/method/account.checkUsername
      'regex:/^[a-zA-Z0-9_]{5,32}$/',
    ],
    ethereumAddress: ['required', 'regex:/^0x[a-fA-F0-9]{40}$/'],
  }
  public VALIDATION_ERROR_MESSAGES = {
    required: 'Field is required',
    email: 'Format is invalid',
    regex: 'Format is invalid',
  }

  public state: State = {
    activeStep: 0,
    formData: {
      email: '',
      telegramUsername: '',
      ethereumAddress: '',
    },
    formErrors: {},
  }

  public validateField = (fieldKey) => {
    const rules = _.pick(this.VALIDATION_RULES, fieldKey)

    // Can skip if there are no validation rules for this field
    if (_.isEmpty(rules)) {
      return
    }

    const validation = new Validator(
      this.state.formData,
      rules,
      this.VALIDATION_ERROR_MESSAGES,
    )
    const validationResult = validation.passes()

    this.setState((state) => ({
      formErrors: {
        ...state.formErrors,
        [fieldKey]: validationResult
          ? undefined
          : validation.errors.get(fieldKey),
      },
    }))

    return validationResult
  }

  public getStepFieldKeys = (stepIndex) => {
    if (stepIndex === 0) {
      return ['email']
    } else if (stepIndex === 1) {
      return ['telegramUsername']
    } else if (stepIndex === 2) {
      return ['ethereumAddress']
    }

    return []
  }

  public validateStep = (stepIndex) => {
    const fieldKeys = this.getStepFieldKeys(stepIndex)
    const haveValidationsPassed = _.every(
      fieldKeys.map((fieldKey) => this.validateField(fieldKey)),
    )

    return haveValidationsPassed
  }

  public handleNext = () => {
    if (!this.validateStep(this.state.activeStep)) {
      return
    }

    const headers = {
      'X-CSRF-Token': document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute('content'),
    }

    axios
      .patch(SIGNALS_RESERVATION_URL, this.state.formData, { headers })
      .then(() => {
        this.setState((state) => ({
          activeStep: state.activeStep + 1,
        }))
      })
      .catch((error) => {
        // TODO: Handle error by showing some sort of message.
        alert(error)
      })
  }

  public handleBack = () => {
    this.setState((state) => ({
      activeStep: state.activeStep - 1,
    }))
  }

  public handleFieldBlur = (fieldKey) => () => {
    this.validateField(fieldKey)
  }

  public handleFieldChange = (fieldKey) => (event) => {
    const fieldValue = event.target.value

    this.setState((state) => {
      return {
        formData: {
          ...state.formData,
          [fieldKey]: fieldValue,
        },
      }
    })
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

  public catchReturn = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.handleNext()
    }
  }

  public render() {
    const { classes } = this.props
    const { activeStep, formData, formErrors } = this.state

    return (
      <div className={classes.root}>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical"
        >
          <Step>
            <StepLabel
              classes={{
                label: classes.stepLabelText,
              }}
            >
              {`What is your email address?`}
            </StepLabel>

            <StepContent>
              <div className={classes.fields}>
                <TextField
                  label="Email"
                  className={classes.textField}
                  value={formData.email}
                  onBlur={this.handleFieldBlur('email')}
                  onChange={this.handleFieldChange('email')}
                  onKeyPress={this.catchReturn}
                  error={!_.isEmpty(formErrors.email)}
                  helperText={_.first(formErrors.email)}
                  margin="normal"
                  fullWidth={true}
                  autoFocus={true}
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
              classes={{
                label: classes.stepLabelText,
              }}
            >
              {`What is your Telegram username to receive signals at?`}
            </StepLabel>

            <StepContent>
              <div className={classes.fields}>
                <TextField
                  label="Telegram Username"
                  className={classes.textField}
                  value={formData.telegramUsername}
                  onBlur={this.handleFieldBlur('telegramUsername')}
                  onChange={this.handleFieldChange('telegramUsername')}
                  onKeyPress={this.catchReturn}
                  error={!_.isEmpty(formErrors.telegramUsername)}
                  helperText={_.first(formErrors.telegramUsername)}
                  margin="normal"
                  fullWidth={true}
                  autoFocus={true}
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
              classes={{
                label: classes.stepLabelText,
              }}
            >
              {`Which wallet will you send your COFI tokens from?`}
            </StepLabel>

            <StepContent>
              <Typography>
                We need to know what your wallet address is so that we know it’s
                you when you send tokens to us for staking.
              </Typography>

              <div className={classes.fields}>
                <TextField
                  label="Your ETH wallet address"
                  className={classes.textField}
                  value={formData.ethereumAddress}
                  onBlur={this.handleFieldBlur('ethereumAddress')}
                  onChange={this.handleFieldChange('ethereumAddress')}
                  onKeyPress={this.catchReturn}
                  error={!_.isEmpty(formErrors.ethereumAddress)}
                  helperText={_.first(formErrors.ethereumAddress)}
                  margin="normal"
                  fullWidth={true}
                  autoFocus={true}
                />
              </div>

              <div className={classes.actionsContainer}>
                {this.renderBackButton()}
                {this.renderNextButton('Finish')}
              </div>
            </StepContent>
          </Step>
        </Stepper>

        {activeStep === this.STEP_COUNT && (
          <Typography className={classes.successMessage}>
            You're almost there! Finish your reservation by following the
            instructions sent to your email.
          </Typography>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(SignalReservationForm)
