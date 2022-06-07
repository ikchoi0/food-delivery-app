$(() => {
  $(".decline").on("submit", function (e) {
    e.preventDefault();
    const data = $(this).serialize();
    $.post("/api/owner/order/decline", data);
    $(this).parent().parent().parent().remove();
  });

  $(".confirm_order_form").on("submit", function (e) {
    e.preventDefault();
    const orderId = $(this).serialize();
    console.log(orderId);
    $.post("/api/owner/order/confirm", orderId)
    .then(response => {
      window.location.replace('http://localhost:8080/api/owner');
    })
    .catch(error => {
      console.log(error);
    });
  });

  $(".complete_order_form").on("submit", function (e) {
    e.preventDefault();
    const orderId = $(this).serialize();
    $.post("/api/owner/order/complete", orderId)
    .then(response => {
      window.location.replace('http://localhost:8080/api/owner');
    })
    .catch(error => {
      console.log(error);
    });
  });
});
