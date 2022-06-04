$(() => {
  $(".cart").on("click", function(e) {
    e.preventDefault();
  });

// still working on the counters
  $(".item_counter .add").on("click", function(e) {
    const counter = $(this).parent().find(".count");
    let count = Number(counter.text());
    if (count === 0) {
      const nameTag = `<li><div>${counter.attr("id")}</div></li>`;
      const $sidebar = $(".sidebar > ol");
      $(nameTag).appendTo($sidebar);
    } else {
    }
    counter.text(count + 1);
  });

// still working on the counters
  $(".item_counter .substract").on("click", function(e) {
    const counter = $(this).parent().find(".count");
    let count = Number(counter.text());
    if (count === 0) {
    } else {
      const nameTag = `<li><div>${counter.attr("id")}</div></li>`;
      const $sidebar = $(".sidebar > ol");
      $(nameTag).appendTo($sidebar);
    }
    counter.text(count - 1);
  });
});



function checkOrder(counter) {
  if (counter.text > 0) {
    return true;
  }
  return false;
}

