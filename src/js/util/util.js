import "jquery";
import Swal from "sweetalert2";

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
  let $wrapper = $(`<div class="${tileJSON.wrapperClass}"></div>`);
  if (tileJSON.aos.enabled) {
    $wrapper.addClass(tileJSON.wrapperClass);
    $wrapper.attr({
      "data-aos": `${tileJSON.aos.fn}`,
      "data-aos-delay": `${tileJSON.aos.delay}`,
      "data-aos-easing": `${tileJSON.aos.easing}`,
      "data-aos-id": `${tileJSON.aos.id}`
    });
  }
  let $counter = $(`<div class="tile-subtitle">${tileJSON.value}</div>`);

  if (tileJSON.counter.enabled) {
    $counter.addClass("countmeup");
    $counter.attr({
      "data-countup-enabled": `${tileJSON.counter.enabled}`,
      "data-countup-start-val": `${tileJSON.counter.start || 0}`,
      "data-countup-decimal-places": `${tileJSON.counter.decimals || 0}`,
      "data-countup-delay": `${tileJSON.counter.delay || 0}`,
      "data-countup-duration": `${tileJSON.counter.duration || 0}`,
      "data-countup-prefix": `${tileJSON.counter.prefix || ""}`,
      "data-countup-suffix": `${tileJSON.counter.suffix || ""}`,
      "data-countup-end-val": `${tileJSON.value}`
    });
  }
  //prettier-ignore
  let $tile = 
  $(`<div class="tile tile-${tileJSON.colorClass}">
    <div class="tile-dataviz">
      <i class="fas fa-fw fa-3x ${tileJSON.iconClass}"></i>
    </div>
    <div class="tile-text">
      <div class="tile-title">${tileJSON.title}</div>
      ${$counter[0].outerHTML}
    </div>
  </div>`);

  $wrapper.html($tile);
  return $wrapper;
}

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

function toggleSidebar(e) {
  $("#wrapper, .overlay").toggleClass("active");
  $("body").toggleClass("modal-open");
  $("#sidebarCollapse").toggleClass("is-active");
}

$(function() {
  $("#sidebarCollapse, #EmkayLogo, .overlay").on("click", toggleSidebar);
  $("#logoff").on("click", confirmLogoff);
});
