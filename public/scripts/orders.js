function checker() {
  if(window.confirm("Are you sure you want to cancel your order?")){
    document.getElementById("cancel").submit();
  } else {
    return;
  }
};
