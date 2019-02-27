import * as React from 'react'
import classNames from 'classnames'
import withDevice from '~/bundles/common/utils/withDevice'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { white08 } from '~/bundles/common/styles/colors'

interface Props {
  classes: any
  items: string[]
  selectedItems: string[]
  onChange: (item: string) => void
  isMobile: boolean
}

const styles = (theme) =>
  createStyles({
    categoryButton: {
      background: `${theme.palette.background.input} !important`,
      borderColor: `${theme.palette.border.input} !important`,
      borderStyle: 'solid',
      borderWidth: '1px',
      padding: '0.5rem 0.8rem',
      color: `${theme.palette.text.hint} !important`,
      fontSize: '0.88rem',
      width: '100%',
      height: '100%',
      '&.selected': {
        borderColor: `${theme.palette.primary.main} !important`,
        color: `${theme.palette.primary.main} !important`,
      },
    },
  })

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
                      className={classNames(this.props.classes.categoryButton, {
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

export default withStyles(styles)(withDevice(Categories))
