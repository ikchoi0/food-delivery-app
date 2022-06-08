$(() => {
  $(".login-form").on("submit", function(e) {
    e.preventDefault();
    const loginInfo = $(this).serialize();

    $.post("/auth/login", loginInfo)
    .then(response => {
      const user = response.logged_in_as;
      console.log(user);
      if (user === "owner"){
        window.location.replace("api/owner")
      } else {
        window.location.replace("api/menu")
      }
    })
    .catch(error => {
      window.alert(error.responseJSON.message);
    })
  });

  $(".register-form").on("submit", function(e) {
    e.preventDefault();
    const loginInfo = $(this).serialize();
    $.post("/auth/register", loginInfo)
    .then(response => {
      window.location.replace("../api/menu")
    })
    .catch(error => {
      window.alert(error.responseJSON.message);
    })
  });
});
