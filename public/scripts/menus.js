$(() => {
  $(".cart").on("click", function(e) {
    e.preventDefault();
  });

// still working on the counters
  $(".item_counter .add").on("click", function(e) {
    const counter = $(this).parent().find(".count");
    const foodInfo = $(this).parent().parent();
    const id = foodInfo.find(".menu_item_id").text();
    const name = foodInfo.find(".item_name").text();
    const price = foodInfo.find(".item_price").text();
    let count = Number(counter.text()) + 1;
    localStorage.setItem(name, [price, count]);
    const $cartList = $(".sidebar .cart_items");
    const cartItem = $(`.cart_item_id.${id}`);
    if (count === 1) {
      const nameTag =
      `
        <li class="cart_item_id ${id}">
          <div>name: </div><div class="cart_item_name">${name}</div>
          <div>x</div><div class="cart_item_count">${count}</div>
          <div>$</div><div class="cart_item_price">${price}</div>
        </li>
      `;
      $(nameTag).appendTo($cartList);
    } else {
      cartItem.find(".cart_item_count").text(count);
      cartItem.find(".cart_item_price").text(count * price);
    }
    counter.text(count);
  });

  $(".item_counter .subtract").on("click", function(e) {
    const counter = $(this).parent().find(".count");
    const foodInfo = $(this).parent().parent();
    const id = foodInfo.find(".menu_item_id").text();
    const name = foodInfo.find(".item_name").text();
    const price = foodInfo.find(".item_price").text();
    let count = Number(counter.text()) - 1;
    localStorage.setItem(name, [price, count]);
    const cart_item = $(`.cart_item_id.${id}`);
    if (count === 0) {
      cart_item.remove();
      //error!! items cannot be negative
    } else {
      cart_item.find(".cart_item_count").text(count);
      cart_item.find(".cart_item_price").text(count * price);
    }
    counter.text(count);
  });

});


function updateCart (name) {

}
