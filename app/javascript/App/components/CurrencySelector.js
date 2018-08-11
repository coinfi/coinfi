import React from 'react'
import { Button, Menu, Dropdown, Icon } from 'antd'

const currencyMenu = (changeCurrencyHandler) => (
  <Menu onClick={changeCurrencyHandler}>
    <Menu.Item key="USD">USD</Menu.Item>
    <Menu.Item key="BTC">BTC</Menu.Item>
  </Menu>
)

const CurrencySelector = ({ currency, changeCurrencyHandler }) => (
  <Dropdown overlay={currencyMenu(changeCurrencyHandler)}>
    <Button>
      <span style={{ position: 'relative', top: -5, left: -8 }}>
        {currency === 'USD' && 'USD'}
        {currency === 'BTC' && 'BTC'}
      </span>
      <i
        className="material-icons"
        style={{ top: 2, marginLeft: -15, position: 'relative', left: 12 }}
      >
        expand_more
      </i>
    </Button>
  </Dropdown>
)

export default CurrencySelector
