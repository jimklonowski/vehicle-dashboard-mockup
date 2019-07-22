// Sweetalert2
import Swal from "sweetalert2";

// this is part of corejs now
//import { URLSearchParams } from "url";

// Number Animation
import { CountUp } from "countup.js";

// Create HTML from json
import {
  createError,
  createTile,
  createGoogleMap,
  createVehicleSearch,
  tileAnimations
} from "../util/util";

// Animate On Scroll
import AOS from "aos";
import "aos/dist/aos.css";

// Date/Time formatting/sorting
var moment = require("moment");

const isProduction = process.env.NODE_ENV === "production";
//console.log(isProduction);
const webroot = isProduction ? process.env.WEBROOT : "";

function vehicleDashboardHeader(vehicleNumber) {
  //let header = $(`<h1 class="jumbotron display-4 mt-3">Vehicle Dashboard</h1>`);
  let search = createVehicleSearch(vehicleNumber);
  //header.append(search);

  $("#VehicleDashboardHeader").append(search);
}

// Fill Vehicle Detail Panel with data
//prettier-ignore
function vehicleDetailPanel(vehicleNumber) {
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file
  let endpoint = isProduction
      ? `services?command=VehicleDash.ajax.vehicleDetails&vehicle=${vehicleNumber}`
      : `${webroot}/assets/json/${vehicleNumber}/vehicle-data.json`;
  

  // Insert vehicle detail from json into lists (change this to a get request URL)
  $.getJSON(endpoint).done(function(vehicle) {
    // 1st column
    $("#VehicleSummary").find("[data-field='customer_number']").text(vehicle.customer_number);
    $("#VehicleSummary").find("[data-field='billing_sort']").text(vehicle.billing_sort);
    $("#VehicleSummary").find("[data-field='vin']").text(vehicle.vin);
    $("#VehicleSummary").find("[data-field='ymm']").text(`${vehicle.vehicle_year} ${vehicle.vehicle_make} ${vehicle.vehicle_model}`);
    $("#VehicleSummary").find("[data-field='vehicle_exterior_color']").text(vehicle.vehicle_exterior_color);
    // 2nd column
    $("#VehicleSummary").find("[data-field='customer_center']").text(vehicle.customer_center);
    $("#VehicleSummary").find("[data-field='customer_center_description']").text(vehicle.customer_center_description);
    $("#VehicleSummary").find("[data-field='customer_vehicle_number']").text(vehicle.customer_vehicle_number);
    $("#VehicleSummary").find("[data-field='vehicle_status']").text(vehicle.vehicle_status);
    $("#VehicleSummary").find("[data-field='vehicle_classification']").text(vehicle.vehicle_classification);
    // 3rd column
    $("#VehicleSummary").find("[data-field='customer_use_1']").text(vehicle.customer_use_1);
    $("#VehicleSummary").find("[data-field='customer_use_2']").text(vehicle.customer_use_2);
    $("#VehicleSummary").find("[data-field='customer_use_3']").text(vehicle.customer_use_3);
    $("#VehicleSummary").find("[data-field='customer_use_4']").text(vehicle.customer_use_4);
    $("#VehicleSummary").find("[data-field='customer_use_5']").text(vehicle.customer_use_5);
  }).fail(function(response){
    let errorText = response.responseJSON ? response.responseJSON.error : response.statusText;
    let error = createError("ERROR", errorText, "alert-danger m-0 rounded-0 w-100");
    $('#VehicleSummary').html(error);
  });
}

// Apply countup animation to a tile
function animateTile(tile) {
  let target = $(tile).find(".countmeup")[0];
  let options = {};
  let delay = $(target).data("countup-delay") || 0;
  let value = $(target).data("countup-end-val");

  options.startVal = $(target).data("countup-start-val");
  options.decimalPlaces = $(target).data("countup-decimal-places");
  options.duration = $(target).data("countup-duration");
  options.prefix = $(target).data("countup-prefix") || "";
  options.suffix = $(target).data("countup-suffix") || "";

  let animation = new CountUp(target, value, options);
  setTimeout(
    () =>
      animation.start(function() {
        $(".countmeup").on("click", ".countmeup", function() {
          animation.reset();
          animation.start();
        });
      }),
    delay
  );

  // target.addEventListener("click", () => {
  //   animation.reset();
  //   animation.start();
  // });

  $(target).on("click", () => {
    //console.log("clicked!");
    animation.reset();
    animation.start();
  });
}

// Create Licensing Tiles
function licensingTiles(vehicleNumber) {
  let endpoint = isProduction
    ? `services?command=VehicleDash.ajax.licensingTiles&vehicle=${vehicleNumber}`
    : `${webroot}/assets/json/${vehicleNumber}/licensing-tile-data.json`;
  //let endpoint = `services?command=VehicleDash.ajax.licensingTiles&vehicle=${vehicleNumber}`;
  // Read licensing json and create html
  $.getJSON(endpoint)
    .done(response => {
      $.each(response, (index, t) => {
        let tile = createTile(t);
        animateTile(tile);
        $("#LicensingTiles").append(tile);
      });
    })
    .fail(response => {
      let errorText = response.responseJSON
        ? response.responseJSON.error
        : response.statusText;
      let error = createError(
        "ERROR",
        errorText,
        "alert-danger mx-3 p-4 w-100"
      );
      $("#LicensingTiles").append(error);
    });
}

// Create Vehicle Tiles
function vehicleTiles(vehicleNumber) {
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file

  let endpoint = isProduction
    ? `services?command=VehicleDash.ajax.vehicleTiles&vehicle=${vehicleNumber}`
    : `${webroot}/assets/json/${vehicleNumber}/vehicle-tile-data.json`;

  // Read vehicle-tile-json and create html
  $.getJSON(endpoint)
    .done(response => {
      $.each(response, (index, t) => {
        let tile = createTile(t);
        animateTile(tile);
        $("#VehicleTiles").append(tile);
      });
    })
    .fail(response => {
      let errorText = response.responseJSON
        ? response.responseJSON.error
        : response.statusText;
      //prettier-ignore
      let error = createError("ERROR", errorText, "alert-danger mx-3 p-4 w-100");
      $("#VehicleTiles").append(error);
    });
}

// Fill Driver Detail Panel with data
//prettier-ignore
function driverDetailPanel(vehicleNumber) {
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file
  let endpoint = isProduction ? `services?command=VehicleDash.ajax.driverDetails&vehicle=${vehicleNumber}` : `${webroot}/assets/json/${vehicleNumber}/driver-data.json`;

  // Insert vehicle detail from json into lists
  $.getJSON(endpoint).done(function(driver) {
    // 1st column
    $("#DriverSummary").find("[data-field='driver_last_name']").text(driver.driver_last_name);
    $("#DriverSummary").find("[data-field='driver_first_name']").text(driver.driver_first_name);
    $("#DriverSummary").find("[data-field='driver_address_1']").text(driver.driver_address_1);
    $("#DriverSummary").find("[data-field='driver_address_2']").text(driver.driver_address_2);
    $("#DriverSummary").find("[data-field='driver_city_region_postal']").text(`${driver.driver_city}, ${driver.driver_region} ${driver.driver_postal_code}`);
    $("#DriverSummary").find("[data-field='driver_county']").text(driver.county);
    $("#DriverSummary").find("[data-field='driver_phone']").text(driver.phone);
    $("#DriverSummary").find("[data-field='driver_cell']").text(driver.cell);
    $("#DriverSummary").find("[data-field='driver_fax']").text(driver.fax);
    // 2nd column
    $("#DriverSummary").find("[data-field='driver_email']").text(driver.driver_email);
    $("#DriverSummary").find("[data-field='driver_id']").text(driver.employee_id);
    $("#DriverSummary").find("[data-field='driver_misc_1']").text(driver.driver_misc_1);
    $("#DriverSummary").find("[data-field='driver_misc_2']").text(driver.driver_misc_2);
    $("#DriverSummary").find("[data-field='driver_misc_3']").text(driver.driver_misc_3);
    $("#DriverSummary").find("[data-field='driver_misc_4']").text(driver.driver_misc_4);
  }).fail(function(response) {
    let errorText = response.responseJSON ? response.responseJSON.error : response.statusText;
    let error = createError("ERROR", errorText, "alert-danger m-0 rounded-0 w-100");
    $('#DriverSummary').html(error);
  });
}

// Create Fuel Tiles
function fuelTiles(vehicleNumber) {
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file
  //let endpoint = `${webroot}/assets/json/${vehicleNumber}/fuel-tile-data.json`;

  let endpoint = isProduction
    ? `services?command=VehicleDash.ajax.fuelTiles&vehicle=${vehicleNumber}`
    : `${webroot}/assets/json/${vehicleNumber}/fuel-tile-data.json`;

  $.getJSON(endpoint)
    .done(response => {
      $.each(response, (index, t) => {
        let tile = createTile(t);
        animateTile(tile);
        $("#FuelTiles").append(tile);
      });
    })
    .fail(response => {
      let errorText = response.responseJSON
        ? response.responseJSON.error
        : response.statusText;
      let error = createError(
        "ERROR",
        errorText,
        "alert-danger mx-3 p-4 w-100"
      );
      $("#FuelTiles").html(error);
    });
}

// Fuel History DataTable
//prettier-ignore
function fuelHistoryTable(vehicleNumber) {
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file
  let endpoint = `${webroot}/assets/json/${vehicleNumber}/fuel-data.json`;
  $('#FuelSummary').on('error.dt', function(e,settings,techNote,message){
    $('#FuelSummary').html(createError("ERROR", `No fuel data for ${vehicleNumber}.`, "alert-danger m-0 rounded-0 w-100"));
  });

  $("#FuelSummary").DataTable({
    ajax: endpoint,
    columns: [
      {
        data: "date",
        type: "date",
        render: data => moment(data).format("L")
      },
      { data: "odometer" },
      { data: "driver" },
      { data: "merchant" },
      {
        data: "merchant_address",
        className: "map-link",
        render: (data) =>
          //prettier-ignore
          `<button type='button' class='btn btn-sm text-decoration-none btn-link' data-title="${data}" data-url='https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(data)}&key=${process.env.GOOGLE_MAPS_API_KEY}'>${data} <i class="fas fa-fw fa-map-marker-alt"></i></button>`        
      },
      {
        data: "type",
        render: (data) => `<span class="badge ${data.toLowerCase().indexOf("gas") !== -1 ? "badge-warning" : "badge-info"} text-light">${data}</span>`
      },
      { data: "quantity" },
      { data: "unit_cost" },
      { data: "amount" }
    ],
    initComplete: (settings, json) => {
      $("#FuelSummary td.map-link > button").on("click", (event) => {
        let url = $(event.target).data("url");
        let title = $(event.target).data('title');
        createGoogleMap(url, title);
      });
    }
  });
}

// Maintenance History Table
//prettier-ignore
function maintenanceHistoryTable(vehicleNumber) {
  let endpoint = `${webroot}/assets/json/${vehicleNumber}/maintenance-data.json`;
  $("#MaintenanceSummary").on("error.dt", function(e,settings,techNote,message) {
    $("#MaintenanceSummary").html(
      createError(
        "ERROR",
        `No maintenance data for ${vehicleNumber}.`,
        "alert-danger m-0 rounded-0 w-100"
      )
    );
  });

  $("#MaintenanceSummary").DataTable({
    ajax: endpoint,
    columns: [
      {
        data: "date",
        type: "date",
        render: data => moment(data).format("L")
      },
      { data: "odometer" },
      { data: "vendor" },
      {
        data: "in_network",
        render: function(data) {
          return (data) ? "<i class='fas fa-check-circle text-success'></i>" : "<i class='fas fa-times-circle text-danger'></i>";
        }
      },
      { data: "service" },
      { data: "amount" }
    ]
  });
}

// Toll History Table
//prettier-ignore
function tollHistoryTable(vehicleNumber){
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file
  let endpoint = `${webroot}/assets/json/${vehicleNumber}/toll-data.json`;
  $('#TollSummary').on('error.dt', function(e,settings,techNote,message){
    $('#TollSummary').html(createError("ERROR", `No toll data for ${vehicleNumber}.`, "alert-danger m-0 rounded-0 w-100"));
  });

  $('#TollSummary').DataTable({
    ajax: endpoint,
    columns: [
      {
        data: "date_time",
        type: "date",
        render: data => moment(data).format("LLL")
      },
      { data: "vehicle_number" },
      { 
        data: "location",
        className: "map-link",
        //prettier-ignore
        render: data => `<button type='button' class='btn btn-sm text-decoration-none btn-link' data-title="${data}" data-url='https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(data)}&key=${process.env.GOOGLE_MAPS_API_KEY}'>${data} <i class="fas fa-fw fa-map-marker-alt"></i></button>`
      },
      { data: "description" },
      { data: "amount" }
    ],
    initComplete: (settings,json) => 
    $("#TollSummary td.map-link > button").on("click", (event) => {
      let url = $(event.target).data("url");
      let title = $(event.target).data('title');
      createGoogleMap(url, title);
    })
  });
}

// Billing History Table
function billingHistoryTable(vehicleNumber) {
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file
  let endpoint = `${webroot}/assets/json/${vehicleNumber}/billing-data.json`;

  $("#BillingSummary").on("error.dt", function(e, settings, techNote, message) {
    $("#BillingSummary").html(
      createError(
        "ERROR",
        `No billing data for ${vehicleNumber}.`,
        "alert-danger m-0 rounded-0 w-100"
      )
    );
  });

  $("#BillingSummary").DataTable({
    dom: "",
    ajax: endpoint,
    columns: [
      {
        data: "bill_date",
        type: "date",
        render: data => moment(data).format("MMM YYYY")
      },
      {
        data: "description",
        render: data =>
          `<span class="badge ${
            data.toLowerCase().indexOf("rental") !== -1
              ? "badge-info"
              : "badge-primary"
          } text-light">${data.toUpperCase()}</span>`
      },
      { data: "amount" },
      {
        data: "invoice",
        render: data =>
          `<button type='button' class='btn btn-sm btn-link text-decoration-none' data-invoice="${data}">View <i class="fas fa-fw fa-file-invoice-dollar"></i></button>`
      }
    ],
    initComplete: (settings, json) =>
      $("[data-invoice]").on("click", event => {
        let invoice = $(event.target).data("invoice") || "error";
        Swal.fire({
          title: "Billing Details",
          text: `Populate this with GET request that returns invoice #${invoice}`,
          type: "info",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-block btn-primary"
          }
        });
      })
  });
}

// Licensing History Table
function licensingHistoryTable(vehicleNumber) {
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file
  let endpoint = `${webroot}/assets/json/${vehicleNumber}/licensing-data.json`;

  $("#LicensingSummary").on("error.dt", function(
    e,
    settings,
    techNote,
    message
  ) {
    $("#LicensingSummary").html(
      createError(
        "ERROR",
        `No licensing data for ${vehicleNumber}.`,
        "alert-danger m-0 rounded-0 w-100"
      )
    );
  });

  $("#LicensingSummary").DataTable({
    dom: "",
    ajax: endpoint,
    columns: [
      {
        data: "exp_date",
        type: "date",
        render: data => moment(data).format("L")
      },
      {
        data: "plate",
        render: data =>
          `<span class="badge badge-secondary text-light">${data.toUpperCase()}</span>`
      },
      { data: "title" },
      {
        data: "status",
        render: data =>
          `<span class="badge ${
            data.toLowerCase().indexOf("completed") !== -1
              ? "badge-success"
              : "badge-info"
          } text-light">${data.toUpperCase()}</span>`
      },
      {
        data: "status",
        render: data =>
          data.toLowerCase().indexOf("completed") == -1
            ? `<button type="button" class="btn btn-sm btn-link text-decoration-none" data-need="${data}" >View&nbsp;<i class='fas fa-fw fa-exclamation-triangle'></i></button>`
            : ""
      }
    ],
    initComplete: (settings, json) =>
      $("[data-need]").on("click", event => {
        let need = $(event.target).data("need") || "error";
        Swal.fire({
          title: `${need.toUpperCase()} needed`,
          text: `info goes here`,
          type: "info",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-block btn-primary"
          },
          showCancelButton: false,
          showCloseButton: true
        });
      })
  });
}

// Violation History Table
function violationHistoryTable(vehicleNumber) {
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file
  let endpoint = `${webroot}/assets/json/${vehicleNumber}/violation-data.json`;

  $("#ViolationSummary").on("error.dt", function(
    e,
    settings,
    techNote,
    message
  ) {
    $("#ViolationSummary").html(
      createError(
        "ERROR",
        `No violation data for ${vehicleNumber}.`,
        "alert-danger m-0 rounded-0 w-100"
      )
    );
  });

  $("#ViolationSummary").DataTable({
    dom: "",
    ajax: endpoint,
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
        render: data =>
          `<span class='badge ${
            data.toLowerCase().indexOf("parking") !== -1
              ? "badge-warning"
              : "badge-danger"
          } text-light'>${data.toUpperCase()}</span>`
      },
      {
        data: "amount"
      },
      {
        data: "violation",
        render: data =>
          `<button type="button" class="btn btn-sm btn-link text-decoration-none" data-violation="${data}" >View&nbsp;<i class='fas fa-fw fa-exclamation-triangle'></i></button>`
      }
    ],
    initComplete: (settings, json) => {
      $("[data-violation]").on("click", event => {
        let violation = $(event.target).data("violation") || "error";
        Swal.fire({
          title: `Violation #${violation}`,
          text: `Populate this with GET request for violation #${violation}.`,
          type: "info",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-block btn-primary"
          },
          imageUrl: "https://www.fillmurray.com/400/250",
          imageHeight: 250,
          imageAlt: "Bill Murray",
          showCancelButton: false,
          showCloseButton: true
        });
      });
    }
  });
}

// Inspection History Table
function inspectionHistoryTable(vehicleNumber) {
  // in production, we would have a GET endpoint that takes in a vehicle number and returns json.  for testing, only vehicle /123456/ exists and is served from a static file
  let endpoint = `${webroot}/assets/json/${vehicleNumber}/inspection-data.json`;

  $("#InspectionSummary").on("error.dt", function(
    e,
    settings,
    techNote,
    message
  ) {
    $("#InspectionSummary").html(
      createError(
        "ERROR",
        `No inspection data for ${vehicleNumber}.`,
        "alert-danger m-0 rounded-0 w-100"
      )
    );
  });

  $("#InspectionSummary").DataTable({
    dom: "",
    ajax: endpoint,
    columns: [
      {
        data: "date",
        type: "date",
        render: data => moment(data).format("L")
      },
      { data: "comments" },
      {
        data: "inspection",
        render: data =>
          `<button type="button" class="btn btn-sm btn-link text-decoration-none" data-inspection="${data}" >View&nbsp;<i class='fas fa-fw fa-camera'></i></button>`
      }
    ],
    initComplete: (settings, json) => {
      $("[data-inspection]").on("click", event => {
        let inspection = $(event.target).data("inspection") || "error";
        Swal.fire({
          title: "Inspection Report",
          text: `Populate this modal with GET request for inspection #${inspection}.`,
          type: "info",
          buttonsStyling: false,
          customClass: {
            confirmButton: "btn btn-block btn-primary"
          },
          showCancelButton: false,
          showCloseButton: true
        });
      });
    }
  });
}

function getCounterOptions(elem) {
  let options = {};

  options.startVal = $(elem).data("countup-start-val");
  options.decimalPlaces = $(elem).data("countup-decimal-places");
  options.duration = $(elem).data("countup-duration");
  options.prefix = $(elem).data("countup-prefix") || "";
  options.suffix = $(elem).data("countup-suffix") || "";

  return options;
}

// DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  //set datatables defaults
  $.extend($.fn.dataTable.defaults, {
    searching: true,
    ordering: true,
    dom: `<'row no-gutters'
      <'col-6 px-3'l><'col-6 px-3'f>
    ><'row no-gutters'
      <'col-12 table-responsive'tr>
    ><'row no-gutters'
      <'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>
    >`,
    order: [[0, "desc"]]
  });

  // get the vehicle number being queried from the get parameter
  let vehicleNumber = new URLSearchParams(window.location.search).get(
    "vehicle"
  );
  // Initialize the animate-on-scroll animations
  AOS.init({ once: true });

  if (!vehicleNumber) {
    // remove all elements except title image
    $("#container")
      .children()
      .not("#VehicleDashboardHeader")
      .remove();
    vehicleDashboardHeader();
    //$("#container").append(createVehicleSearch());
    //.insertAfter(".container h1");
  } else {
    //tileAnimations();
    // Bind CountUp animations on tiles after each aos fade-in event is triggered on an element with data-aos-id='counterTile'
    //setupCounterAnimations();
    vehicleDashboardHeader(vehicleNumber);

    // populate the detail panels and tiles from json data
    licensingTiles(vehicleNumber);
    vehicleDetailPanel(vehicleNumber);
    vehicleTiles(vehicleNumber);
    driverDetailPanel(vehicleNumber);
    fuelTiles(vehicleNumber);

    // fill the tables
    fuelHistoryTable(vehicleNumber);
    maintenanceHistoryTable(vehicleNumber);
    tollHistoryTable(vehicleNumber);
    billingHistoryTable(vehicleNumber);
    licensingHistoryTable(vehicleNumber);
    violationHistoryTable(vehicleNumber);
    inspectionHistoryTable(vehicleNumber);
    //console.log(fuelData);
  }
});
