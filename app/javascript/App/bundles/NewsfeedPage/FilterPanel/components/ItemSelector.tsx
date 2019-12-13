import * as React from 'react'
import { withStyles, createStyles } from '@material-ui/core/styles'
import { midGray } from '~/bundles/common/styles/colors'

const styles = (theme) => {
  const isDarkMode = theme.palette.type === 'dark'

  return createStyles({
    itemLink: {
      color: isDarkMode ? theme.palette.text.secondary : midGray,
    },
  })
}

const stripWww = (text) => {
  if (/www/.exec(text) !== null) {
    return text.replace('www.', '')
  } else {
    return text
  }
}

const itemLabel = (item) => {
  item = stripWww(item)
  if (item instanceof Object) {
    return item.name || item.title || item.label
  }
  return item
}

const ItemLink = (props) => (
  <label htmlFor={props.item} className={props.classes.itemLink}>
    <input
      id={props.item}
      type="checkbox"
      className="mr2 w-auto"
      checked={props.isSelected}
      onChange={props.onChange}
    />
    {itemLabel(props.item)}
  </label>
)

interface Props {
  classes: any
  items: string[]
  selectedItems: string[]
  onChange: (item: string) => void
}

const ItemSelector = (props: Props) => {
  return (
    <div className="item-selector-alt">
      <ul>
        {props.items.map((item, i) => {
          return (
            <li className="mv2" key={i}>
              <ItemLink
                item={item}
                onChange={() => props.onChange(item)}
                isSelected={props.selectedItems.includes(item)}
                classes={props.classes}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default withStyles(styles)(ItemSelector)
