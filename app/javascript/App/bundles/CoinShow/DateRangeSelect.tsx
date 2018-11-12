import * as React from 'react'
import * as moment from 'moment'
import { Select, MenuItem, FormControl } from '@material-ui/core'

type DateValues = '7-days' | '30-days' | '3-months' | '12-months' | 'all-time'

const dates = [
  { value: '7-days', label: 'Last 7 Days' },
  { value: '30-days', label: 'Last 30 Days' },
  { value: '3-months', label: 'Last 3 Months' },
  { value: '12-months', label: 'Last 12 Months' },
  { value: 'all-time', label: 'All Time' },
]

interface Props {
  className: any
  initialValue?: DateValues
  minDate?: string
  maxDate?: string
  onChangeHandler?: (startDate: string, endDate: string) => void
}

interface State {
  selectValue: DateValues
}

class DateRangeSelect extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const selectValue = props.initialValue || 'all-time'

    if (props.initialValue && props.onChangeHandler) {
      const { startDate, endDate } = this.getDateRange(selectValue)
      props.onChangeHandler(startDate, endDate)
    }

    this.state = {
      selectValue,
    }
  }

  public getEndDate(candidateDate) {
    const max = moment(this.props.maxDate)
    const candidate = moment(candidateDate)

    if (!candidateDate && !this.props.maxDate) {
      return null
    } else if (!candidateDate) {
      return max
    } else if (!this.props.maxDate) {
      return candidate
    }

    return max >= candidate ? candidate : max
  }

  public getStartDate(candidateDate) {
    const min = moment(this.props.minDate)
    const candidate = moment(candidateDate)

    if (!candidateDate && !this.props.minDate) {
      return null
    } else if (!candidateDate) {
      return min
    } else if (!this.props.minDate) {
      return candidate
    }

    return min <= candidate ? candidate : min
  }

  public getDateRange(dateValue: DateValues) {
    let startDate
    let endDate

    switch (dateValue) {
      case '7-days': {
        startDate = this.getStartDate(moment().subtract(7, 'days'))
        endDate = this.getEndDate(moment())
        break
      }
      case '30-days': {
        startDate = this.getStartDate(moment().subtract(30, 'days'))
        endDate = this.getEndDate(moment())
        break
      }
      case '3-months': {
        startDate = this.getStartDate(moment().subtract(3, 'months'))
        endDate = this.getEndDate(moment())
        break
      }
      case '12-months': {
        startDate = this.getStartDate(moment().subtract(12, 'months'))
        endDate = this.getEndDate(moment())
        break
      }
      default:
      case 'all-time': {
        startDate = this.getStartDate(null)
        endDate = this.getEndDate(moment())
        break
      }
    }

    if (startDate) {
      startDate = startDate.format('YYYY-MM-DD')
    }
    if (endDate) {
      endDate = endDate.format('YYYY-MM-DD')
    }

    return {
      startDate,
      endDate,
    }
  }

  public onChangeHandler = (event) => {
    const selectValue = event.target.value
    const { startDate, endDate } = this.getDateRange(selectValue)

    if (this.props.onChangeHandler) {
      this.props.onChangeHandler(startDate, endDate)
    }

    this.setState({
      selectValue,
    })
  }

  public render() {
    const { className } = this.props
    const { selectValue } = this.state

    return (
      <FormControl className={className}>
        <Select value={selectValue} onChange={this.onChangeHandler}>
          {dates.map((date, index) => (
            <MenuItem value={date.value} key={index}>
              {date.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }
}

export default DateRangeSelect
