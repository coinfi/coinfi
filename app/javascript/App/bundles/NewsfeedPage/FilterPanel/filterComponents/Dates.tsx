import * as React from 'react'
import * as moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker-cssmodules.css'
import withDevice from '~/bundles/common/utils/withDevice'

interface Props {
  publishedSince?: string
  publishedUntil?: string
  onSinceChange: (since: string) => void
  onUntilChange: (until: string) => void
  isMobile: boolean
}

class Dates extends React.Component<Props, {}> {
  public sinceChange = (item: moment.Moment) => {
    this.props.onSinceChange(item.format('YYYY-MM-DD'))
  }

  public untilChange = (item: moment.Moment) => {
    this.props.onUntilChange(item.format('YYYY-MM-DD'))
  }

  public itemLabel = (item) => {
    if (item instanceof Object) {
      return item.name || item.title || item.label
    }
    return item
  }

  public render() {
    const publishedSince = !!this.props.publishedSince
      ? moment(this.props.publishedSince)
      : null

    const publishedUntil = !!this.props.publishedUntil
      ? moment(this.props.publishedUntil)
      : null

    return (
      <div className="item-selector-alt nh1 nt1">
        <div className="pv4">
          <div
            className="w-50 dib"
            style={!this.props.isMobile ? { maxWidth: '50%' } : {}}
          >
            <DatePicker
              selected={publishedSince}
              placeholderText="Start Date"
              selectsStart={true}
              startDate={publishedSince}
              endDate={publishedUntil}
              onChange={this.sinceChange}
              className="from"
            />
          </div>
          <div
            className="w-50 dib"
            style={!this.props.isMobile ? { maxWidth: '50%' } : {}}
          >
            <DatePicker
              selected={publishedUntil}
              placeholderText="End Date"
              selectsEnd={true}
              startDate={publishedSince}
              endDate={publishedUntil}
              onChange={this.untilChange}
              className="to"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withDevice(Dates)
