App.coin = App.cable.subscriptions.create('CoinChannel', {
  received: function(data) {
    if (data.action) {
      const coins = data.coins

      $('#coins tbody tr').each(function() {
        let $self = $(this)
        let coinId = $self.data('id')
        let coinData = coins[coinId]

        if (!coinData) { return true }

        $self.find('td:gt(1):lt(5)').remove()
        $self.find('td:nth-child(2)').after(coinData)
      })
    } else {
      this.perform('process', { coins: data, url: window.location.href })
    }
  }
});
