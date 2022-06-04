$(() => {
  $(".cart").on("click", function(e) {
    e.preventDefault();
  });


  $(".item_counter .add").on("click", function(e) {
    const counter = $(this).parent().find(".count");
    let count = Number(counter.text()) + 1;
    const nameTag = `<li><div>${counter.attr("id")}</div></li>`;
    const $sidebar = $(".sidebar > ol");
    if (count === 1) {
      $(nameTag).appendTo($sidebar);
    } else {
    }
    counter.text(count);
  });


  $(".item_counter .substract").on("click", function(e) {
    const counter = $(this).parent().find(".count");
    let count = Number(counter.text()) - 1;
    const nameTag = `<li><div>${counter.attr("id")}</div></li>`;
    const $sidebar = $(".sidebar > ol");
    if (count === 1) {
      $(nameTag).appendTo($sidebar);
    } else {
    }
    counter.text(count);
  });
});



function checkOrder(counter) {
  if (counter.text > 0) {
    return true;
  }
  return false;
}

