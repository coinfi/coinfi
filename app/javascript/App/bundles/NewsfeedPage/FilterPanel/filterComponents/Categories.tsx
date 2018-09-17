import { WindowScreenType } from '../../../common/types'
declare const window: WindowScreenType

import * as React from 'react'
import classNames from 'classnames'
import withDevice from '~/bundles/common/utils/withDevice'

interface Props {
  items: string[]
  selectedItems: string[]
  onChange: (item: string) => void
  isMobile: boolean
}

class Categories extends React.Component<Props, {}> {
  public isSelected = (item) => this.props.selectedItems.includes(item)

  public render() {
    let colSize = 0
    if (this.props.isMobile) {
      colSize = 2
    } else {
      colSize = 3
    }

    const itemGroups = this.props.items
      .map((x, i) => {
        return i % colSize === 0 ? this.props.items.slice(i, i + colSize) : null
      })
      .filter((x) => x != null)

    return (
      <div className="item-selector-alt nh1 nt1">
        {itemGroups.map((groups, index) => {
          return (
            <div className="row" key={index}>
              {groups.map((item, innerIndex) => {
                let itemLabel
                if (item === 'Events - Conferences, Meetups, Launches, etc.') {
                  itemLabel = 'Events'
                } else if (item === 'Security (Vulnerabilities)') {
                  itemLabel = 'Security'
                } else {
                  itemLabel = item
                }
                return (
                  // @ts-ignore
                  <div className="col category-btn" span={8} key={innerIndex}>
                    <button
                      style={{ cursor: 'pointer' }}
                      className={classNames({
                        selected: this.isSelected(item),
                      })}
                      onClick={() => this.props.onChange(item)}
                    >
                      {itemLabel}
                    </button>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

export default withDevice(Categories)
