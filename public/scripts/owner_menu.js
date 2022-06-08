$(() => {
  /* Opens and closes the sidebar when the menu is clicked */
  $(".owner_menu_edit").on("click", function (e) {
    e.preventDefault();
    const menuId = $(this).find(".menu_item_id").text().trim();
    const menuUrl = $(this).find(".menu_item_url").text().trim();
    const menuName = $(this).find(".menu_item_name").text().trim();
    const menuDescription = $(this).find(".menu_item_description").text();
    const menuPrice = $(this).find(".menu_item_price").text().trim();
    const menuForm = $(".owner_menu_edit_form");
    menuForm.text("");
    console.log(menuDescription);
    const formInput =
    `
      <input type="hidden" name="menu_id" value="${menuId}" >
      <div class="form-group">
        <label for="create_menu_name" class="menu-label">Item Name</label>
        <input type="text" class="form-control create_menu_name menu_name" name="edit_menu_name" value="${menuName}">
      </div>
      <div class="form-group">
        <label for="create_menu_photo_url" class="menu-label">Photo</label>
        <input placeholder="Please enter a URL for photo" type="text" class="form-control create_menu_photo_url menu_photo" name="edit_menu_photo_url" value="${menuUrl}">
      </div>
      <div class="form-group">
        <label for="create_menu_description" class="menu-label">Description</label>
        <textarea class="form-control create_menu_description menu_description"  rows="5" name="edit_menu_description">${menuDescription}</textarea>
      </div>
      <div class="form-group">
        <label for="create_menu_price" class="menu-label">Price (e.g. 12.50)</label>
        <div class="form-submit">
        <input type="text" class="form-control create_menu_price menu_price" name="edit_menu_price" value="${menuPrice}">
        <div><button type="submit" class="btn btn-primary create-btn">Edit</button></div>
      </div>
    `;
    $(formInput).appendTo(menuForm);
    const sidebar = $(".sidebar");
    if (sidebar.css("width") === "0px") {
      openSidebar(sidebar);
    } else {
      closeSidebar(sidebar);
    }
  });

  $(".owner_menu_edit_form").on("submit", function(e) {
    e.preventDefault();
    const menuEditedData = $(this).serialize();
    $.post("/api/owner/menu/edit", menuEditedData)
    .then(response => {
      window.location.replace("/api/owner/menu");
    })
    .catch(error => {
      console.log(error);
    })
  });
});

function openSidebar(sidebar) {
  sidebar.css("width", "800px");
  sidebar.css("opacity", "100%");
}
function closeSidebar(sidebar) {
  sidebar.css("width", "0px");
  sidebar.css("opacity", "0%");
}
