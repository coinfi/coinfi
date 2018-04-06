$(function () {
  $(".datetimepicker").datetimepicker({
    debug: false,
    format: "YYYY-MM-DD HH:mm:ss",
  });

  $('form').on('cocoon:after-insert', function(e, added_item) {
    added_item.find('.datetimepicker').datetimepicker({
      debug: false,
      format: 'YYYY-MM-DD HH:mm:ss'
    });
  });
});
