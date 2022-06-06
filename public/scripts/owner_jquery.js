$(() => {

$('.decline').on('submit', function(e) {
  e.preventDefault();
  const data = $(this).serialize();
  $.post("/api/owner/decline", data)
    $(this).parent().parent().parent().remove();
});

$('.confirm').on('submit', function(e) {
  e.preventDefault();
  const formData= $(this).serialize();
  $.post("/api/owner/confirm", formData, (result, error) => {
    $(`.order_form-${result.data.id}`).hide();

    renderTimer(result.confirm_time, result.data.id);

    $('.completed').on('submit', function(e) {
      e.preventDefault();
      const completedId = result.data.id;
      $.post("/api/owner/confirm/completed", {completedId})
      $(`.order-${completedId}`).remove();
    })
  })
});

});

const renderTimer = (time, orderId) => {
  const $timer = `
  <div>
    <h2 class="countdown">${time}</h2>
    <label>mins</label>
  </div>
  <form class="completed" method="POST">
  <div>
    <button type="submit">completed</button>
  </div>
  </form>
  `
  $(`.counter_form-${orderId}`).append($timer);

    var doUpdate = function() {
      $('.countdown').each(function() {
        var count = parseInt($(this).html());
        if (count !== 0) {
          $(this).html(count - 1);
        }
      });
    };

    setInterval(doUpdate, 60000);
}
