import * as React from 'react'
import * as _ from 'lodash'
import Icon from '~/bundles/common/components/Icon'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

interface Props {
  coinObj: any
}

interface Link {
  linkType: string
  value: string
  icon: string
  brand?: boolean
}

class LinksList extends React.Component<Props, {}> {
  public getLinks(coinObj): Link[] {
    const links = []

    if (!!coinObj.website) {
      links.push({
        linkType: 'Website',
        value: coinObj.website,
        icon: 'link',
      })
    }
    if (!!coinObj.whitepaper) {
      links.push({
        linkType: 'Whitepaper',
        value: coinObj.whitepaper,
        icon: 'file-alt',
      })
    }
    if (!!coinObj.explorer) {
      links.push({
        linkType: 'Explorer',
        value: coinObj.explorer,
        icon: 'search',
      })
    }
    if (!!coinObj.twitter) {
      links.push({
        linkType: 'Twitter',
        value: coinObj.twitter,
        icon: 'twitter',
        brand: true,
      })
    }
    if (!!coinObj.reddit) {
      links.push({
        linkType: 'Reddit',
        value: coinObj.reddit,
        icon: 'reddit',
        brand: true,
      })
    }
    if (!!coinObj.medium) {
      links.push({
        linkType: 'Medium',
        value: coinObj.medium,
        icon: 'medium',
        brand: true,
      })
    }
    if (!!coinObj.github) {
      links.push({
        linkType: 'Github',
        value: coinObj.github,
        icon: 'github',
        brand: true,
      })
    }
    if (!!coinObj.telegram) {
      links.push({
        linkType: 'Telegram',
        value: coinObj.telegram,
        icon: 'telegram',
        brand: true,
      })
    }

    return links
  }

  public render() {
    const linkData = this.getLinks(this.props.coinObj)

    return (
      <List dense={true}>
        {linkData.map((item, index) => {
          return (
            <ListItem key={index} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <ListItemIcon style={{ marginRight: 0 }}>
                <Icon
                  brand={item.brand}
                  name={item.icon}
                  className="fa-fw"
                  style={{
                    position: 'relative',
                    top: 0,
                  }}
                />
              </ListItemIcon>
              <ListItemText style={{ paddingLeft: '4px' }}>
                <a
                  href={item.value}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  style={{
                    color: '#000',
                    marginLeft: '.5rem',
                    marginTop: '-.25rem',
                  }}
                >
                  {item.linkType}
                </a>
              </ListItemText>
            </ListItem>
          )
        })}
      </List>
    )
  }
}

export default LinksList
