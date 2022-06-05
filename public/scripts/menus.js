$(() => {
  const CUSTOMER_ID = 1;

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
    localStorage.setItem(id, count);
    updateCartTotal(Number(price));
    counter.text(count);
  });

  $(".item_counter .subtract").on("click", function(e) {
    const counter = $(this).parent().find(".count");
    const foodInfo = $(this).parent().parent();
    const id = foodInfo.find(".menu_item_id").text();
    let price = foodInfo.find(".item_price").text();
    let count = Number(counter.text()) - 1;
    const cart_item = $(`.cart_item_id.${id}`);
    if (count > 0) {
      cart_item.find(".cart_item_count").text(count);
      cart_item.find(".cart_item_price").text(count * price);
    } else if (count === 0) {
      cart_item.remove();
    } else {
      //error!! items cannot be negative
      price = 0;
      count = 0;
    }
    updateCartTotal(-Number(price));
    localStorage.setItem(id, count);
    counter.text(count);
  });

  $(".place_order_form").on("submit", function(e) {
    e.preventDefault();
    const userInfo = $(this).serializeArray();
    if(Object.keys(localStorage).length) {
      const orderData = {};
      for(let elem of userInfo) {
        orderData[elem.name] = elem.value;
      }
      for(let key of Object.keys(localStorage)){
        const value = localStorage.getItem(key);
        orderData[key] = value;
      }
      localStorage.clear();
      $.post("/api/menu", orderData)
      .then(() => {
        window.location.replace("/api/order");
      });
    } else {
      //error
    }

  })
});


function updateCartTotal (price) {
  const cartTotal = $(".cart_total");
  const newTotal = Number(cartTotal.text()) + price;
  cartTotal.text(Math.round(newTotal));
}
