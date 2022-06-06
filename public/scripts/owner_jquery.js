$(() => {

$('.decline').on('submit', function(e) {
  e.preventDefault();
  const data = $(this).serialize();
  $.post("/api/owner/decline", data);
  $(this).parent().parent().remove();
})
});
