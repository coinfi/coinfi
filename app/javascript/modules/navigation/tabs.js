$(document).ready(() => {
  $('.tab-area').each(function() {
    $(this)
      .find('.tabs')
      .find('.tab')
      .first()
      .addClass('tab-active')
    $(this)
      .find('.tab-content')
      .first()
      .addClass('tab-active')
  })
  $(document).on('click', '.tab', function() {
    console.log('yo')
    $('.tab-active').removeClass('tab-active')
    $(this).addClass('tab-active')
    $(
      `.tab-content[data-position="${$(this).attr('data-position')}"]`
    ).addClass('tab-active')
  })
})
