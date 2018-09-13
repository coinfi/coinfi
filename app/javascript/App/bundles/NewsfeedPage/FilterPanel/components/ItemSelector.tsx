import * as React from 'react'

const itemLabel = (item) => {
  if (/www/.exec(item) !== null) {
    item = item.replace('www.', '')
  }
  if (item instanceof Object) {
    return item.name || item.title || item.label
  }
  return item
}

const ItemLink = (props) => (
  <label htmlFor={props.item} className="mid-gray">
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
  items: string[]
  selectedItems: string[]
  onChange: (item: string) => void
}

const ItemSelector = (props: Props) => {
  return (
    <div className="item-selector-alt">
      <ul>
        {props.items.map((item, i) => {
          if (/www/.exec(item) !== null) {
            item = item.replace('.www', '').replace(/^/, 'www.')
          }
          return (
            <li className="mv2" key={i}>
              <ItemLink
                item={item}
                onChange={() => props.onChange(item)}
                isSelected={props.selectedItems.includes(item)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ItemSelector
