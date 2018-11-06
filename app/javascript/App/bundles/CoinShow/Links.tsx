import * as React from 'react'
import Icon from '~/bundles/common/components/Icon'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

interface Props {
  coinObj: any
}

interface State {
  linkData: Link[]
}

interface Link {
  linkType: string
  value: string
  icon: string
  brand?: boolean
}

class Links extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const linkData = this.getLinks(props)

    this.state = {
      linkData,
    }
  }

  public getLinks(props) {
    const { coinObj } = props
    const links = []

    if (typeof coinObj.website !== 'undefined') {
      links.push({
        linkType: 'Website',
        value: coinObj.website,
        icon: 'link',
      })
    }
    if (typeof coinObj.whitepaper !== 'undefined') {
      links.push({
        linkType: 'Whitepaper',
        value: coinObj.whitepaper,
        icon: 'file-alt',
      })
    }
    if (typeof coinObj.explorer !== 'undefined') {
      links.push({
        linkType: 'Explorer',
        value: coinObj.explorer,
        icon: 'search',
      })
    }
    if (typeof coinObj.twitter !== 'undefined') {
      links.push({
        linkType: 'Twitter',
        value: coinObj.twitter,
        icon: 'twitter',
        brand: true,
      })
    }
    if (typeof coinObj.reddit !== 'undefined') {
      links.push({
        linkType: 'Reddit',
        value: coinObj.reddit,
        icon: 'reddit',
        brand: true,
      })
    }
    if (typeof coinObj.medium !== 'undefined') {
      links.push({
        linkType: 'Medium',
        value: coinObj.medium,
        icon: 'medium',
        brand: true,
      })
    }
    if (typeof coinObj.github !== 'undefined') {
      links.push({
        linkType: 'Github',
        value: coinObj.github,
        icon: 'github',
        brand: true,
      })
    }
    if (typeof coinObj.telegram !== 'undefined') {
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
    return (
      <List dense={true}>
        {this.state.linkData.map((item, index) => {
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

export default Links
