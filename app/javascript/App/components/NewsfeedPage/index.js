import React, {Component} from 'react';
import debounce from 'debounce';
import newsfeedContainer from '../../containers/newsfeed';
import LayoutDesktop from './LayoutDesktop';
import LayoutTablet from './LayoutTablet';
import LayoutMobile from './LayoutMobile';

class NewsfeedPage extends Component {
  state = {
    coinDetailVisible: false,
  };

  componentWillMount() {
    window.addEventListener('resize', debounce(() => this.forceUpdate()), 500);
  }

  hideCoinDetail() {
    this.setState({
      coinDetailVisible: false,
    });
  }

  showCoinDetail(slug) {
    this.setState({
      coinDetailVisible: true,
      coinSlug: slug
    });
  }

  render() {
    if (window.isMobile) {
      return (
        <LayoutMobile
          {...this.props}
          showCoinDetail={this.showCoinDetail.bind(this)}
          hideCoinDetail={this.hideCoinDetail.bind(this)}
          coinDetailVisible={this.state.coinDetailVisible}
          coinSlug={this.state.coinSlug}
        />
      );
    } else if (window.isTablet) {
      return <LayoutTablet {...this.props} />;
    } else {
      return <LayoutDesktop {...this.props} />;
    }
  }
}

export default newsfeedContainer(NewsfeedPage);
