import React, { Component, PropTypes } from "react";
import ListingItem from "./ListingItem";

class ListingsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listings: props.initialListings,
      detectedSince: null
    };
  }

  setActiveCoin = coin => {
    const { setActiveEntity, setFilter, disableUI, enableUI } = this.props;
    setActiveEntity({
      type: "coin",
      id: coin.get("id"),
      label: coin.get("name")
    });
    const value = [coin.get("name")];
    setFilter({ key: "coins", value });
    if (!window.isDesktop) disableUI("coinListDrawer");
    if (window.isMobile) enableUI("bodySectionDrawer", { fullScreen: true });
  };

  onComponentMount() {
    this.fetchListings();
  }

  fetchListings = () =>
    fetch("http://localhost:3000/api/exchange_listings.json")
      .then(response => response.json())
      .then(result => this.onSetResult(result));

  onSetResult = result =>
    this.setState({
      listings: result
    });

  render() {
    const { listings } = this.state;
    return (
      <div>
        {listings.map(listing => {
          return <ListingItem key={listing.id} listing={listing} />;
        })}
      </div>
    );
  }
}

export default ListingsList;
