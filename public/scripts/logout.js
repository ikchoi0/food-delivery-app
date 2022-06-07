$(() => {
  /* handles logout: clears the cart by clearing localstorage  */
  $(".logout_button").on("click", function(e) {
    e.preventDefault();
    $.post("/auth/logout")
    .then(response => {
      localStorage.clear();
      window.location.replace("/");
    })
    .catch(error => {
      console.log(error);
    });
  });
});
