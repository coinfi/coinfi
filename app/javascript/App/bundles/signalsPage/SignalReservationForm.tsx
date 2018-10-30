import * as React from 'react'
import SignalPopoverText from '~/bundles/signalsPage/SignalPopoverText'
import { withStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
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
    marginTop: theme.spacing.unit * 4,
  },
  stakingMessage: {
    fontSize: '1rem',
    lineHeight: '1.6em',
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
  inputRoot: {
    border: '1px solid #ccc',
    borderRadius: '2px',
    paddingLeft: theme.spacing.unit,
  },
  inputRootFocused: {
    border: '1px solid #23adf0',
    boxShadow: '0 0 2px rgba(35, 173, 240, 0.4)',
  },
  inputField: {
    border: 'none !important',
    boxShadow: 'none !important',
  },
})

interface Props {
  classes: any
  formAuthenticityToken: string
  reservationStakingAmount: string
  email?: string
  destinationCofiWalletAddress: string
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
  public FINAL_STEP_COUNT = 4
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
      email: this.props.email || '',
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

  public incrementStep = () => {
    this.setState((state) => ({
      activeStep: state.activeStep + 1,
    }))
  }

  public handleNext = () => {
    if (!this.validateStep(this.state.activeStep)) {
      return
    }

    const headers = {
      'X-CSRF-Token': this.props.formAuthenticityToken,
    }

    axios
      .patch(SIGNALS_RESERVATION_URL, this.state.formData, { headers })
      .then(() => {
        this.incrementStep()
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
    const fieldValue = _.trim(event.target.value)

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
        data-heap={`signals-previous-step-${this.state.activeStep}`}
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
        onClick={text === 'Next' ? this.handleNext : this.incrementStep}
        className={classes.button}
        data-heap={`signals-next-step-${this.state.activeStep}`}
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
    const {
      classes,
      reservationStakingAmount,
      destinationCofiWalletAddress,
    } = this.props
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
              {`What is your Telegram username to receive signals?`}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">@</InputAdornment>
                    ),
                    classes: {
                      root: classes.inputRoot,
                      focused: classes.inputRootFocused,
                      input: classes.inputField,
                    },
                  }}
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
              {`Send ${reservationStakingAmount} COFI to the CoinFi Trading Signals staking address.`}
            </StepLabel>

            <StepContent>
              <Typography className={classes.stakingMessage}>
                Send exactly{' '}
                <code className="reservation-value">
                  {reservationStakingAmount} COFI
                </code>{' '}
                tokens to:<br />
                <code className="reservation-value">
                  {destinationCofiWalletAddress}
                </code>
              </Typography>
              <br />
              <Typography className={classes.stakingMessage}>
                <strong>IMPORTANT:</strong> Do NOT send from an exchange since
                we cannot confirm the sender.
              </Typography>
              <br />
              <SignalPopoverText
                text="Don't have any COFI tokens or need more?"
                description={`
                  <div>
                    You can acquire COFI tokens at the following exchanges:
                    <ul>
                      <li>
                        <a
                          href="https://kyber.network/swap/eth_cofi"
                          target="_blank"
                        >
                          Kyber Network
                        </a>
                      </li>
                      <li>
                        <a href="https://www.kucoin.com" target="_blank">
                          KuCoin
                        </a>
                      </li>
                      <li>
                        <a href="https://www.gate.io/" target="_blank">
                          Gate.io
                        </a>
                      </li>
                    </ul>
                  </div>
                `}
              />
              <br />
              <br />
              <Typography className={classes.stakingMessage}>
                Once we receive your tokens, you will receive a confirmation
                email.
              </Typography>
              <br />
              <Typography className={classes.stakingMessage}>
                See you on the other side!
              </Typography>
              <div className={classes.actionsContainer}>
                {this.renderBackButton()}
                {this.renderNextButton('Confirm')}
              </div>
            </StepContent>
          </Step>
        </Stepper>

        {activeStep === this.FINAL_STEP_COUNT && (
          <>
            <Typography className={classes.successMessage}>
              Thank you for your interest in CoinFi Trading Signals!
            </Typography>
            <Typography className={classes.successMessage}>
              We've also sent a copy of the staking instructions to your email
              for your reference.
            </Typography>
            <Typography className={classes.successMessage}>
              If you have any questions, feel free to chat with us or send an
              email to signals@coinfi.com.
            </Typography>
          </>
        )}
      </div>
    )
  }
}

export default withStyles(styles)(SignalReservationForm)
