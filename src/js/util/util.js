import "jquery";
import Swal from "sweetalert2";

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
