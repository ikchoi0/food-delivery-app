$(() => {
  $(".cart").on("click", function(e) {
    e.preventDefault();
  });

// still working on the counters
  $(".item_counter .add").on("click", function(e) {
    const counter = $(this).parent().find(".count");
    const foodInfo = $(this).parent().parent();
    const name = foodInfo.find(".item_name").text();
    const price = foodInfo.find(".item_price").text();
    let count = Number(counter.text());
    localStorage.setItem(name, [price, count]);
    // $(this).parent().find(".count");
    // if (count === 0) {
    //   const nameTag = `<li><div class="${name}">${name}</div></li>`;
    //   const $sidebar = $(".sidebar > ol");
    //   $(nameTag).appendTo($sidebar);
    // }
    counter.text(count + 1);
  });
  window.addEventListener('storage', (e) => {
    // When local storage changes, dump the list to
    // the console.
    console.log(e);
  });
});

function updateCart (name) {

}
// // still working on the counters
//   $(".item_counter .substract").on("click", function(e) {
//     const counter = $(this).parent().find(".count");
//     let count = Number(counter.text());
//     if (count === 0) {
//     } else {
//       const nameTag = `<li><div>${counter.attr("id")}</div></li>`;
//       const $sidebar = $(".sidebar > ol");
//       $(nameTag).appendTo($sidebar);
//     }
//     counter.text(count - 1);
//   });
