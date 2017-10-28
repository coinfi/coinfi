$(function() {
  $('#article_coin_id').selectize({
    sortField: 'text'
  });

  $('#article_tag_list').selectize({
    delimiter: ',',
    persist: false,
    create: function(input) {
      return {
        value: input,
        text: input
      }
    }
  });
});
