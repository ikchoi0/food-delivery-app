$(() => {

$('.decline').on('submit', function(e) {
  e.preventDefault();
  $.post("/api/", )
  $(this).parent().parent().remove();
})
})
