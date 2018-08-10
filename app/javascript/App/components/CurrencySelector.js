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
      {currency === 'USD' && 'USD'}
      {currency === 'BTC' && 'BTC'}
      <i className="material-icons">expand_more</i>
    </Button>
  </Dropdown>
)

export default CurrencySelector
