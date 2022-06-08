$(() => {
  /* Sets cart if any items were added previously */
  setCart();

  /* Handles click event on '+' button to increase item quantity */
  $(".item_counter .add").on("click", function (e) {
    const counter = $(this).parent().find(".count");
    const foodInfo = $(this).parent().parent().parent().parent();
    const id = foodInfo.find(".menu_item_id").text().trim();
    const name = foodInfo.find(".menu_item_name").text();
    const price = foodInfo.find(".menu_item_price").text();
    let count = Number(counter.text()) + 1;
    const $cartList = $(".sidebar .cart_items");
    const cartItem = $(`.cart_item_id.${id}`);
    if (!cartItem.length) {
      const nameTag = `
        <li class="cart_item_id ${id}">
          <span></span><span class="cart_item_name">${name}</span>
          <span>x </span><span class="cart_item_count">${count}</span>
          <span>- $</span><span class="cart_item_price">${price}</span>
        </li>
      `;
      $(nameTag).appendTo($cartList);
    } else {
      cartItem.find(".cart_item_count").text(count);
      cartItem.find(".cart_item_price").text(count * price);
    }
    openSidebar($(".sidebar"));
    localStorage.setItem(id, count);
    updateCartIcon(1);
    updateCartTotal(Number(price));
    counter.text(count);
  });

  /* Handles click event on '-' button to decrease item quantity */
  $(".item_counter .subtract").on("click", function (e) {
    const counter = $(this).parent().find(".count");
    const foodInfo = $(this).parent().parent().parent().parent();
    const id = foodInfo.find(".menu_item_id").text().trim();
    let price = foodInfo.find(".menu_item_price").text();
    let count = Number(counter.text()) - 1;
    const cart_item = $(`.cart_item_id.${id}`);
    if (count > 0) {
      cart_item.find(".cart_item_count").text(count);
      cart_item.find(".cart_item_price").text(count * price);
      updateCartIcon(-1);
    } else if (count === 0) {
      updateCartIcon(-1);
      closeSidebar($(".sidebar"));
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

  /* Handles order submit event */
  $(".place_order_form").on("submit", function (e) {
    e.preventDefault();
    const userInfo = $(this).serializeArray();
    if ($(".cart_total").text() != 0) {
      const orderData = {};
      for (let elem of userInfo) {
        orderData[elem.name] = elem.value;
      }
      for (let key of Object.keys(localStorage)) {
        const value = localStorage.getItem(key);
        orderData[key] = value;
      }
      localStorage.clear();
      $.post("/api/menu", orderData).then(() => {
        window.location.replace("/api/menu/order");
      });
    } else {
      //error show popup to add more items
    }
  });

  /* Clears the cart */
  $(".clear-cart").on("click", function (e) {
    localStorage.clear();
    window.location.replace("/api/menu");
  });

    /* Opens and closes the sidebar when the cart icon is clicked */
    $(".cart-container").on("click", function (e) {
      e.preventDefault();
      const sidebar = $(".sidebar");
      if (sidebar.css("width") === "0px") {
        openSidebar(sidebar);
      } else {
        closeSidebar(sidebar);
      }
    });
});

function openSidebar (sidebar) {
  sidebar.css("width", "270px");
  sidebar.css("opacity", "100%");
}
function closeSidebar (sidebar) {
  sidebar.css("width", "0px");
  sidebar.css("opacity", "0%");
}
/* Helper function to update total price in the cart */
function updateCartTotal(price, total = Number($(".cart_total").text())) {
  const newTotal = total + price;
  $(".cart_total").text(newTotal.toFixed(2));
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("sidebar").style.width = "0";
}

/* Set the cart after refresh */
function setCart() {
  let totalCartPrice = 0;
  let totalCount = 0;
  for (let key of Object.keys(localStorage)) {
    const $cartList = $(".sidebar .cart_items");
    const quantity = Number(localStorage.getItem(key));
    if (quantity != 0) {
      const menuInStorageDetail = $(`.menu_${key}`);
      const name = menuInStorageDetail.find(".menu_item_name").text();
      const price = menuInStorageDetail.find(".menu_item_price").text();
      menuInStorageDetail.find(".count").text(quantity);
      let totalPrice = Number(price) * quantity;
      const nameTag = `
      <li class="cart_item_id ${key}">
        <span></span><span class="cart_item_name">${name}</span>
        <span>x </span><span class="cart_item_count">${quantity}</span>
        <span>- $</span><span class="cart_item_price">${totalPrice.toFixed(
          2
        )}</span>
      </li>
    `;
      $(nameTag).appendTo($cartList);
      totalCartPrice += totalPrice;
      totalCount += quantity;
    }
  }
  updateCartIcon(totalCount);
  updateCartTotal(totalCartPrice, 0);
}

/* Sets the color and sub int value of the cart icon */
function updateCartIcon(quantity) {
  const itemsInCart = $(".items_in_cart");
  let itemsInCartCount = Number(itemsInCart.text());
  if (!itemsInCartCount) {
    itemsInCartCount = 0;
  }
  const totalQuantity = itemsInCartCount + quantity;
  let color = "white";
  if (totalQuantity > 0) {
    color = "red";
  }
  itemsInCart.css("color", color);
  itemsInCart.text(totalQuantity);
}
