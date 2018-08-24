import React from 'react'
import moment from 'moment'
import styled from 'styled-components'

const ListingItem = (props) => {
  const { listing } = props
  return (
    <div className="b--b tiber flex flex-auto">
      <div className="fl w-third pa3">
        <h3 className="ma0">{listing.symbol}</h3>
      </div>
      <div className="fl w-third pa3">{listing.exchange_name}</div>
      <div className="fl w-third pa3">
        <SpanDate>{moment(listing.detected_at).format('MMM DD, YYYY')} {' '}</SpanDate>
        <Span>{moment(listing.detected_at).format('hh:mm')}</Span>
      </div>
    </div>
  )
}

export default ListingItem

const SpanDate = styled.span`
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
`

const Span = styled.span`
  font-size:12px;
  color:rgba(0, 0, 0, 0.54);
  margin-left:5px;
`