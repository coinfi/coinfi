import React, { Component } from 'react'
import Container from '../containers/ExampleContainer'

class HomePage extends Component {
  render() {
    const { entity } = this.props
    return (
      <div className="container">
        <div className="row no-gutter">
          <div className="col-xs-12 col-md-6 col-lg-4">
            <div className="bg-white tc pa3">
              <img
                className="w4e"
                src={entity.get('imageUrl')}
                alt={entity.get('name')}
              />
              <h1 className="title mt2">{entity.get('name')}</h1>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Container(HomePage)
