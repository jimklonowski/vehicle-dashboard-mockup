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
      "<'row no-gutters px-3 py-1'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
      "<'row no-gutters'<'col-sm-12'tr>>" +
      "<'row no-gutters px-3 py-1'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    //dom: "Bflrtip",
    //buttons: ["copy", "csv"],
    ajax: {
      // this could be a url instead of a file
      url: "/dist/assets/json/fuel-data.json"
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
          return `<a href='#'>${data} <i class="fas fa-fw fa-map-marker-alt"></i></a>`;
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
      "<'row no-gutters px-3 py-1'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
      "<'row no-gutters'<'col-sm-12'tr>>" +
      "<'row no-gutters px-3 py-1'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
    //dom: "Bflrtip",
    //buttons: ["copy", "csv"],
    ajax: {
      url: "/dist/assets/json/maintenance-data.json"
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

// handle animations on this page
document.addEventListener("DOMContentLoaded", function() {
  AOS.init({
    once: true
  });

  fuelTiles();
  fuelTable();
  maintenanceTable();
  //console.log(fuelData);
});
