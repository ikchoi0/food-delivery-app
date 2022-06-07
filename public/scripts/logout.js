$(() => {
  $(".logout_button").on("click", function(e) {
    e.preventDefault();
    $.post("/auth/logout")
    .then(response => {
      window.location.replace("/");
    })
    .catch(error => {
      console.log(error);
    });
  });
});
