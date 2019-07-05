// Sweetalert2
import Swal from "sweetalert2";
// Number Animation
import { CountUp } from "countup.js";
// Animate On Scroll
import AOS from "aos";
import "aos/dist/aos.css";

var moment = require("moment");
//import fuel data
//import fuelData from "../../assets/json/fuel-data.json";
//const fuelData = require("../../assets/json/fuel-data.json");
//import * as fuelData from "../../assets/json/fuel-data.json";
//import fuelData from "../../assets/json/fuel-data.json";
//import * as fuelData from "../../../dist/assets/json/fuel-data.json";
//const fuelData = require("../../../dist/assets/json/fuel-data.json");

function fuelTiles() {
  $(".countmeup").each(function(index) {
    var $wrapper = $(this).closest(".tile");

    // fade in one-by-one
    //$wrapper.delay(250 * index).fadeIn("slow");

    var options = {};
    var target = this;
    var value = $(this).data("countup-end-val");
    options.startVal = $(this).data("countup-start-val");
    options.decimalPlaces = $(this).data("countup-decimal-places");
    options.duration = $(this).data("countup-duration");
    options.suffix = $(this).data("countup-suffix") || "";
    options.prefix = $(this).data("countup-prefix") || "";
    var animation = new CountUp(target, value, options);
    // start countup animation
    animation.start();

    target.addEventListener("click", function() {
      animation.reset();
      animation.start();
    });
  });
}

function fuelTable() {
  $("#FuelSummary").DataTable({
    dom:
      "<'row no-gutters'" +
      "<'col-6 px-3'l><'col-6 px-3'f>" +
      ">" +
      "<'row no-gutters'" +
      "<'col-12 table-responsive'tr>" +
      ">" +
      "<'row no-gutters'" +
      "<'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>" +
      ">",
    //dom: "Bflrtip",
    //buttons: ["copy", "csv"],
    ajax: {
      // this could be a url instead of a file
      url: "./assets/json/fuel-data.json"
    },
    columns: [
      {
        data: "date",
        type: "date",
        render: function(data) {
          //console.log(data);
          //var date = Date.parse(data);
          return moment(data).format("L");
        }
      },
      { data: "odometer" },
      { data: "driver" },
      { data: "merchant" },
      {
        data: "merchant_address",
        render: function(data) {
          return `<a href='#!'>${data} <i class="fas fa-fw fa-map-marker-alt"></i></a>`;
        }
      },
      {
        data: "type",
        render: function(data) {
          if (data.toLowerCase().indexOf("gas") !== -1) {
            return `<span class='badge badge-warning text-light'>${data}</span>`;
          } else if (data.toLowerCase().indexOf("wash") !== -1) {
            return `<span class='badge badge-info text-light'>${data}</span>`;
          } else {
            return data;
          }
        }
      },
      { data: "quantity" },
      { data: "unit_cost" },
      { data: "amount" }
    ],
    order: [[0, "desc"]],
    processing: true,
    language: {
      loadingRecords: "&nbsp;",
      processing: "Loading..."
    }
  });
}

function maintenanceTable() {
  $("#MaintenanceSummary").DataTable({
    dom:
      "<'row no-gutters'" +
      "<'col-6 px-3'l><'col-6 px-3'f>" +
      ">" +
      "<'row no-gutters'" +
      "<'col-12 table-responsive'tr>" +
      ">" +
      "<'row no-gutters'" +
      "<'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>" +
      ">",
    //dom: "Bflrtip",
    //buttons: ["copy", "csv"],
    ajax: {
      url: "./assets/json/maintenance-data.json"
    },
    columns: [
      {
        data: "date",
        type: "date",
        render: function(data) {
          //console.log(data);
          //var date = Date.parse(data);
          return moment(data).format("L");
        }
      },
      { data: "odometer" },
      { data: "vendor" },
      {
        data: "in_network",
        render: function(data) {
          if (data) {
            return "<i class='fas fa-check-circle text-success'></i>";
          } else {
            return "<i class='fas fa-times-circle text-danger'></i>";
          }
        }
      },
      { data: "service" },
      { data: "amount" }
    ],
    order: [[0, "desc"]],
    processing: true,
    language: {
      loadingRecords: "&nbsp;",
      processing: "Loading..."
    }
  });
}

function tollTable() {
  $("#TollSummary").DataTable({
    dom:
      "<'row no-gutters'" +
      "<'col-6 px-3'l><'col-6 px-3'f>" +
      ">" +
      "<'row no-gutters'" +
      "<'col-12 table-responsive'tr>" +
      ">" +
      "<'row no-gutters'" +
      "<'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>" +
      ">",
    //dom: "Bflrtip",
    //buttons: ["copy", "csv"],
    ajax: {
      url: "./assets/json/toll-data.json"
    },
    columns: [
      {
        data: "date_time",
        type: "date",
        render: function(data) {
          //console.log(data);
          //var date = Date.parse(data);
          return moment(data).format("LLL");
        }
      },
      { data: "vehicle_number" },
      {
        data: "location",
        render: function(data) {
          if (data) {
            return `<a href='#!'>${data} <i class="fas fa-fw fa-map-marker-alt"></i></a>`;
          }
        }
      },
      { data: "description" },
      { data: "amount" }
    ],
    order: [[0, "desc"]],
    processing: true,
    language: {
      loadingRecords: "&nbsp;",
      processing: "Loading..."
    }
  });
}

function billingTable() {
  $("#BillingSummary").DataTable({
    dom: "",
    // "<'row no-gutters px-3 py-1'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
    // "<'row no-gutters'<'col-sm-12'tr>>" +
    // "<'row no-gutters px-3 py-1'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    //dom: "Bflrtip",
    //buttons: ["copy", "csv"],
    ajax: {
      url: "./assets/json/billing-data.json"
    },
    // when data is finished loading, add click handler to the details column
    initComplete: function(settings, json) {
      $(".billing-invoice").on("click", function() {
        let invoice = $(this).data("invoice") || "error";
        Swal.fire({
          title: "Billing Details",
          text: `Invoice #${invoice}`,
          type: "info"
        });
      });
    },
    columns: [
      {
        data: "bill_date",
        type: "date",
        render: function(data) {
          //console.log(data);
          //var date = Date.parse(data);
          return moment(data).format("MMM YYYY");
        }
      },
      {
        data: "description",
        render: function(data) {
          if (data.toLowerCase().indexOf("rental") !== -1) {
            return `<span class='badge badge-info text-light'>${data.toUpperCase()}</span>`;
          } else {
            return `<span class='badge badge-primary text-light'>${data.toUpperCase()}</span>`;
          }
        }
      },
      { data: "amount" },
      {
        data: "invoice",
        render: function(data) {
          return `<a href="#!" title="Invoice Details" data-invoice="${data}" class='billing-invoice'>View <i class="fas fa-fw fa-file-invoice-dollar"></i></a>`;
        }
      }
    ],
    order: [[0, "desc"]],
    processing: true,
    language: {
      loadingRecords: "&nbsp;",
      processing: "Loading..."
    }
  });
}

function licensingTable() {
  $("#LicensingSummary").DataTable({
    dom: "",
    // "<'row no-gutters px-3 py-1'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
    // "<'row no-gutters'<'col-sm-12'tr>>" +
    // "<'row no-gutters px-3 py-1'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    //dom: "Bflrtip",
    //buttons: ["copy", "csv"],
    ajax: {
      url: "./assets/json/licensing-data.json"
    },
    // when data is finished loading, add click handler to the details column
    initComplete: function(settings, json) {
      $(".licensing-needs").on("click", function() {
        Swal.fire({
          title: "Licensing Needs",
          text: `stuff goes here`,
          type: "info",
          showCancelButton: false,
          showCloseButton: true
        });
      });
    },
    columns: [
      {
        data: "exp_date",
        type: "date",
        render: function(data) {
          //console.log(data);
          //var date = Date.parse(data);
          return moment(data).format("L");
        }
      },
      {
        data: "plate",
        render: function(data) {
          return `<span class='badge badge-dark text-light'>${data.toUpperCase()}</span>`;
        }
      },
      { data: "state" },
      { data: "title" },
      {
        data: "status",
        render: function(data) {
          if (data.toLowerCase().indexOf("completed") !== -1) {
            return `<span class='badge badge-success text-light'>${data.toUpperCase()}</span>`;
          } else {
            return `<span class='badge badge-info text-light'>${data.toUpperCase()}</span>`;
          }
        }
      },
      {
        data: "status",
        render: function(data) {
          if (data.toLowerCase().indexOf("completed") == -1) {
            return `<a href='#!' class='licensing-needs'>View&nbsp;<i class='fas fa-fw fa-exclamation-triangle'></i></a>`;
          } else {
            return "";
          }
        }
      }
      // {
      //   data: "status",
      //   render: function(data) {
      //     if (data.toLowerCase().indexOf("completed") !== -1) {
      //       return `<span class='badge badge-success text-light'>${data.toUpperCase()}</span>`;
      //     } else {
      //       return `<span class='badge badge-info text-light'>${data.toUpperCase()}</span>`;
      //     }
      //   }
      // },
      // {
      //   data: "status",
      //   render: function(data) {
      //     if (data.toLowerCase().indexOf("completed") == -1) {
      //       return `<a href='#!' class='licensing-needs'><i class='fas fa-fw fa-exclamation-triangle'></i></a>`;
      //     }
      //   }
      // }
    ],
    order: [[0, "desc"]],
    processing: true,
    language: {
      loadingRecords: "&nbsp;",
      processing: "Loading..."
    }
  });
}

function violationTable() {
  $("#ViolationSummary").DataTable({
    dom: "",
    ajax: {
      url: "./assets/json/violation-data.json"
    },
    // when data is finished loading, add click handler to the details column
    initComplete: function(settings, json) {
      $(".violation-image").on("click", function() {
        Swal.fire({
          title: "Violation Image",
          text: `show it here`,
          type: "info",
          showCancelButton: false,
          showCloseButton: true
        });
      });
    },
    columns: [
      {
        data: "date",
        type: "date",
        render: function(data) {
          //console.log(data);
          //var date = Date.parse(data);
          return moment(data).format("L");
        }
      },
      {
        data: "date_paid",
        type: "date",
        render: function(data) {
          //console.log(data);
          //var date = Date.parse(data);
          return moment(data).format("L");
        }
      },
      {
        data: "type",
        render: function(data) {
          if (data.toLowerCase().indexOf("parking") !== -1) {
            return `<span class='badge badge-warning text-light'>${data.toUpperCase()}</span>`;
          } else if (data.toLowerCase().indexOf("moving") !== -1) {
            return `<span class='badge badge-danger text-light'>${data.toUpperCase()}</span>`;
          } else {
            return "";
          }
        }
      },
      // {
      //   data: "violation",
      //   render: function(data) {
      //     return data;
      //   }
      // },
      {
        data: "amount"
      },
      {
        data: "violation",
        render: function(data) {
          return `<a href='#!' class='violation-image'>View&nbsp;<i class='fas fa-fw fa-camera'></i></a>`;
        }
      }
    ],
    order: [[0, "desc"]],
    processing: true,
    language: {
      loadingRecords: "&nbsp;",
      processing: "Loading..."
    }
  });

  $(".violation-image").on("click", function() {
    Swal.fire({
      title: "Violation",
      type: "error",
      text: "Bill Murray",
      imageUrl: "https://www.fillmurray.com/400/250",
      imageHeight: 250,
      imageAlt: "Bill Murray"
    });
  });
}

function inspectionsTable() {
  $(".inspection").on("click", function() {
    Swal.fire({});
  });
}

// handle animations on this page
document.addEventListener("DOMContentLoaded", function() {
  AOS.init({
    once: true
  });

  fuelTiles();
  fuelTable();
  maintenanceTable();
  tollTable();
  licensingTable();
  violationTable();
  billingTable();
  inspectionsTable();
  //console.log(fuelData);
});
