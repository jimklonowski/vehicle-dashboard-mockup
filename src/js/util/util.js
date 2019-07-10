import "jquery";
import Swal from "sweetalert2";

// Prevent DataTables from showing an alert when ajax error occurs
$.fn.dataTable.ext.errMode = "none";

function confirmLogoff() {
  //alert("wow");
  Swal.fire({
    title: "Log Out",
    text: "Do you really want to log out?",
    type: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, get out."
  }).then(result => {
    if (result.value) {
      Swal.fire("Too Bad", "You're stuck here forever", "error");
    }
  });
}

export function createError(title, text, classes) {
  let error = $(
    `<aside class="alert ${classes}" data-aos="fade-in">
      <strong>${title}</strong> ${text}
    </aside>`
  );
  return error;
}

export function createGoogleMap(url, title = "Map") {
  Swal.fire({
    title: title,
    width: "auto",
    padding: "1.5rem",
    buttonsStyling: false,
    customClass: {
      confirmButton: "btn btn-block btn-primary"
    },
    html: `<iframe width="500" height="350" frameborder="0" style="border:0;" src="${url}"></iframe>`
  });
}

// Generate Tiles using template fed by json
export function createTile(tileJSON) {
  //prettier-ignore
  let wrapper = $(
    `<div class="${tileJSON.wrapperClasses}" data-aos="${tileJSON.wrapperAOS.aos}" data-aos-delay="${tileJSON.wrapperAOS.aosDelay}" data-aos-easing="${tileJSON.wrapperAOS.aosEasing}" data-aos-id="${tileJSON.wrapperAOS.aosId}"></div>`
  );
  //prettier-ignore
  let tile = 
  `<div class="tile tile-${tileJSON.color}">
    <div class="tile-dataviz">
      <i class="${tileJSON.iconClasses}"></i>
    </div>
    <div class="tile-text">
      <div class="tile-title">${tileJSON.title}</div>
      <div class="tile-subtitle countmeup" 
        data-countup-start-val="${tileJSON.countup.start}"
        data-countup-decimal-places="${tileJSON.countup.decimals}"
        data-countup-delay="${tileJSON.countup.delay}"
        data-countup-duration="${tileJSON.countup.duration}"
        data-countup-prefix="${tileJSON.countup.prefix}"
        data-countup-suffix="${tileJSON.countup.suffix}"
        data-countup-end-val="${tileJSON.value}">
        ${tileJSON.value}
      </div>
    </div>
  </div>`;

  wrapper.html(tile);

  return wrapper;
}

function toggleSidebar(e) {
  $("#wrapper, .overlay").toggleClass("active");
  $("body").toggleClass("modal-open");
  $("#sidebarCollapse").toggleClass("is-active");
}

$(function() {
  $("#sidebarCollapse, #EmkayLogo, .overlay").on("click", toggleSidebar);
  $("#logoff").on("click", confirmLogoff);
});
