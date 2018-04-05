import React from 'react'

export default ({ coin }) => {
  const { name, image_url, symbol, slug } = coin
  return (
    <a href={`/coins/${slug}`} className="flex items-center">
      {image_url && <img className="w2e h2e mr3" src={image_url} alt="" />}
      <h1 className="ma0 lh-solid f3">
        <div className="">
          {name} <span className="f6 fw9 o-50 mb1">{symbol}</span>
        </div>
      </h1>
    </a>
  )
}
