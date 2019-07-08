const googleMapsAPI = "AIzaSyDQcpakP7kJkqfH9EnJjraIjycONBmd8aY";
// Sweetalert2
import Swal from "sweetalert2";
// Number Animation
import { CountUp } from "countup.js";
// Animate On Scroll
import AOS from "aos";
import "aos/dist/aos.css";
// Date/Time formatting/sorting
var moment = require("moment");

function vehicleDetail() {
  // Insert vehicle detail from json into lists
  $.getJSON("./assets/json/vehicle-data.json").done(function(vehicle) {
    // 1st column
    $("#VehicleSummary")
      .find("[data-field='account']")
      .text(vehicle.account);
    $("#VehicleSummary")
      .find("[data-field='billing-sort']")
      .text(vehicle.billing_sort);
    $("#VehicleSummary")
      .find("[data-field='vin']")
      .text(vehicle.vin);
    $("#VehicleSummary")
      .find("[data-field='ymm']")
      .text(
        `${vehicle.vehicle_year} ${vehicle.vehicle_make} ${
          vehicle.vehicle_model
        }`
      );
    $("#VehicleSummary")
      .find("[data-field='ext-color']")
      .text(vehicle.ext_color);
    // 2nd column
    $("#VehicleSummary")
      .find("[data-field='center']")
      .text(vehicle.center);
    $("#VehicleSummary")
      .find("[data-field='center-description']")
      .text(vehicle.center_description);
    $("#VehicleSummary")
      .find("[data-field='client-vehicle-number']")
      .text(vehicle.client_vehicle_number);
    $("#VehicleSummary")
      .find("[data-field='status']")
      .text(vehicle.vehicle_status);
    $("#VehicleSummary")
      .find("[data-field='vehicle-classification']")
      .text(vehicle.vehicle_classification);
    // 3rd column
    $("#VehicleSummary")
      .find("[data-field='department']")
      .text(vehicle.department);
    $("#VehicleSummary")
      .find("[data-field='project']")
      .text(vehicle.project);
    $("#VehicleSummary")
      .find("[data-field='division']")
      .text(vehicle.division);
    $("#VehicleSummary")
      .find("[data-field='group']")
      .text(vehicle.group);
    $("#VehicleSummary")
      .find("[data-field='client-use']")
      .text(vehicle.client_use);
  });
}

function driverDetail() {
  // Insert vehicle detail from json into lists
  $.getJSON("./assets/json/driver-data.json").done(function(driver) {
    //debugger;
    $("#DriverSummary")
      .find("[data-field='last-name']")
      .text(driver.last_name);
    $("#DriverSummary")
      .find("[data-field='first-name']")
      .text(driver.first_name);
    $("#DriverSummary")
      .find("[data-field='address-1']")
      .text(driver.address_1);
    $("#DriverSummary")
      .find("[data-field='address-2']")
      .text(driver.address_2);
    $("#DriverSummary")
      .find("[data-field='city-state-zip']")
      .text(`${driver.city}, ${driver.state} ${driver.zip}`);
    $("#DriverSummary")
      .find("[data-field='county']")
      .text(driver.county);
    $("#DriverSummary")
      .find("[data-field='phone']")
      .text(driver.phone);
    $("#DriverSummary")
      .find("[data-field='cell']")
      .text(driver.cell);
    $("#DriverSummary")
      .find("[data-field='fax']")
      .text(driver.fax);

    $("#DriverSummary")
      .find("[data-field='email']")
      .text(driver.email);
    $("#DriverSummary")
      .find("[data-field='employee-id']")
      .text(driver.employee_id);
    $("#DriverSummary")
      .find("[data-field='driver-misc-1']")
      .text(driver.driver_misc_1);
    $("#DriverSummary")
      .find("[data-field='driver-misc-2']")
      .text(driver.driver_misc_2);
    $("#DriverSummary")
      .find("[data-field='driver-misc-3']")
      .text(driver.driver_misc_3);
    $("#DriverSummary")
      .find("[data-field='driver-misc-4']")
      .text(driver.driver_misc_4);
    $("#DriverSummary")
      .find("[data-field='selector-level']")
      .text(driver.selector_level);
  });
}

// Fill fuel tiles
function fuelTiles() {
  $(".countmeup").each(function(index) {
    var $wrapper = $(this).closest(".tile");

    var options = {};
    var target = this;
    var value = $(this).data("countup-end-val");
    options.startVal = $(this).data("countup-start-val");
    options.decimalPlaces = $(this).data("countup-decimal-places");
    options.duration = $(this).data("countup-duration");
    options.suffix = $(this).data("countup-suffix") || "";
    options.prefix = $(this).data("countup-prefix") || "";
    // for cleaner animations, we might want to delay the countup visual until the animate-on-scroll animation finishes
    var delay = $(this).data("countup-delay") || 0;
    var animation = new CountUp(target, value, options);
    // start countup animation
    setTimeout(() => animation.start(), delay);

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
        className: "map-link",
        render: function(data) {
          return `<a href='#!' data-url='https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
            data
          )}&key=${googleMapsAPI}'>${data} <i class="fas fa-fw fa-map-marker-alt"></i></a>`;
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
    initComplete: function(settings, json) {
      //let url = $(this).data("url");
      $("#FuelSummary td.map-link > a").on("click", function() {
        let url = $(this).data("url");
        Swal.fire({
          title: "Map",
          width: "auto",
          padding: "1.5em",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-lg btn-primary"
          },
          //text: `I havent set up a working google maps api key yet, but this is an easy map-in-a-modal.`,
          html: `<iframe width="500" height="350" frameborder="0" style="border:0;" src="${url}"></iframe>`
        });
      });
    },
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
        className: "map-link",
        render: function(data) {
          if (data) {
            return `<a href='#!' data-url='https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
              data
            )}&key=${googleMapsAPI}'>${data} <i class="fas fa-fw fa-map-marker-alt"></i></a>`;
          }
        }
      },
      { data: "description" },
      { data: "amount" }
    ],
    initComplete: function(settings, json) {
      //let url = $(this).data("url");
      $("#TollSummary td.map-link > a").on("click", function() {
        let url = $(this).data("url");
        Swal.fire({
          title: "Map",
          width: "auto",
          padding: "1.5em",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-lg btn-primary"
          },
          html: `<iframe width="500" height="350" frameborder="0" style="border:0;" src="${url}"></iframe>`
        });
      });
    },
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
          type: "info",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-lg btn-primary"
          }
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
    ajax: {
      url: "./assets/json/licensing-data.json"
    },
    // when data is finished loading, add click handler to the details column
    initComplete: function(settings, json) {
      $(".licensing-needs").on("click", function() {
        let need = $(this).data("need") || "error";
        Swal.fire({
          title: `${need.toUpperCase()} needed.`,
          text: `info goes here`,
          type: "info",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-lg btn-primary"
          },
          showCancelButton: false,
          showCloseButton: true
        });
      });
    },
    columns: [
      {
        data: "exp_date",
        type: "date",
        render: data => moment(data).format("L")
      },
      {
        data: "plate",
        render: data =>
          `<span class='badge badge-dark text-light'>${data.toUpperCase()}</span>`
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
            return `<a href='#!' class='licensing-needs' data-need='${data}'>View&nbsp;<i class='fas fa-fw fa-exclamation-triangle'></i></a>`;
          } else {
            return "";
          }
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

function violationTable() {
  $("#ViolationSummary").DataTable({
    dom: "",
    ajax: {
      url: "./assets/json/violation-data.json"
    },
    // when data is finished loading, add click handler to the details column
    initComplete: function(settings, json) {
      $(".violation-image").on("click", function() {
        let violation = $(this).data("violation") || "error";
        Swal.fire({
          title: `Violation #${violation}`,
          text: `Data for violation goes here. This is Bill Murray.`,
          type: "info",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-lg btn-primary"
          },
          imageUrl: "https://www.fillmurray.com/400/250",
          imageHeight: 250,
          imageAlt: "Bill Murray",
          showCancelButton: false,
          showCloseButton: true
        });
      });
    },
    columns: [
      {
        data: "date",
        type: "date",
        render: data => moment(data).format("L")
      },
      {
        data: "date_paid",
        type: "date",
        render: data => moment(data).format("L")
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
      {
        data: "amount"
      },
      {
        data: "violation",
        render: data =>
          `<a href='#!' class='violation-image' data-violation='${data}'>View&nbsp;<i class='fas fa-fw fa-camera'></i></a>`
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

function inspectionsTable() {
  $("#InspectionSummary").DataTable({
    dom: "",
    ajax: {
      url: "./assets/json/inspection-data.json"
    },
    // when data is finished loading, add click handler to the details column
    initComplete: function(settings, json) {
      $(".inspection-report").on("click", function() {
        let inspection = $(this).data("inspection") || "error";
        Swal.fire({
          title: "Inspection Report",
          text: `Data for Inspection #${inspection} goes here`,
          type: "info",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-lg btn-primary"
          },
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
        data: "comments"
      },
      {
        data: "inspection",
        render: function(data) {
          return `<a href='#!' class='inspection-report' data-inspection='${data}'>View&nbsp;<i class='fas fa-fw fa-camera'></i></a>`;
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

// handle animations on this page
document.addEventListener("DOMContentLoaded", function() {
  // populate the description lists from json requests before beginning the animations from AOS
  driverDetail();
  vehicleDetail();

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
