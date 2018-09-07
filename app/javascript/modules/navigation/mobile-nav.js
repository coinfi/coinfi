export const toggleOverlay = (element) => {
  $('body').toggleClass('overflow-hidden')
  const e = $(element)
  let c = ['active', 'visible']
  let delay = 1
  if (e.hasClass('active')) {
    c.reverse()
    delay = 750
  }
  e.toggleClass(c[0])
  setTimeout(() => {
    e.toggleClass(c[1])
  }, delay)
  return e
}

$(document).ready(() => {
  $('.registration-form-wrapper form').on('submit', function() {
    $(this).find('input[type=submit]').prop('disabled', true).text('Processing...');
  })

  if (document.querySelector('.register-set-password') !== null)
    fbq('track', 'Lead', {});

})
