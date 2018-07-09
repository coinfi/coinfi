import React from "react"

const NewsCoinTags = ({ newsItem, selectCoin }) => (
  <div>
    {newsItem.get("coin_link_data").map((data, index) => (
      <a key={index} className="tag pointer" onClick={() => selectCoin(data)}>
        {data.get("symbol")}
      </a>
    ))}
  </div>
)

export default NewsCoinTags
