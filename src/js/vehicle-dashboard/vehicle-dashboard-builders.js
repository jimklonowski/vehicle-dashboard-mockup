import { fail } from "assert";
import moment from "moment";
import Swal from "sweetalert2";
import { CountUp } from "countup.js";
import { createError, createGoogleMap, createTile } from "../util/util";

/**
 * Set DataTables defaults for history tables
 */
export function setDataTablesDefaults() {
  // $.
  // Prevent DataTables from showing an alert when ajax error occurs
  $.fn.dataTable.ext.errMode = "none";
  // Number of pagination buttons
  $.fn.dataTable.ext.pager.numbers_length = 7;
  // Helper to truncate a long string and append ...
  $.fn.dataTable.render.ellipsis = function(cutoff) {
    return function(data, type, row) {
      return type === "display" && data.length > cutoff
        ? data.substr(0, cutoff) + "..."
        : data;
    };
  };
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
    order: [[0, "desc"]],
    processing: true,
    language: {
      emptyTable: "No rows found",
      processing:
        '<i class="fas fa-spinner fa-spin fa-fw"></i><span class="sr-only">Loading...</span>',
      loadingRecords:
        '<i class="fas fa-spinner fa-spin fa-fw"></i><span class="sr-only">Loading...</span>',
      paginate: {
        previous: "&laquo;",
        next: "&raquo;"
      },
      aria: {
        paginate: {
          previous: "Previous",
          next: "Next"
        }
      }
    },
    drawCallback: () => $("ul.pagination").addClass("pagination-sm")
  });
}

/**
 * Create Vehicle Search Bar
 * @param {*} vehicleNumber
 */
export function createVehicleDashboardSearch(vehicleNumber) {
  vehicleNumber = vehicleNumber || "";

  let search = $(
    `<form class="mb-4">
      <input type="hidden" name="command" value="VehicleDash">
      <label class="col-form-label col-form-label-sm" data-i18n="vehicle_dashboard.vehicle_number">Vehicle Number</label>
      <input type="search" name="vehicle" id="vehicle" class="form-control form-control-sm col-lg-6" data-i18n="[placeholder]vehicle_dashboard.search" value="${vehicleNumber}">
    </form>`
  );
  $("#VehicleDashboardSearch").html(search, () =>
    $("#VehicleDashboardSearch").localize()
  );
}

/**
 * Load vehicle detail panel.
 * @requires JSON object keys to match data-fields in panel
 * @param {*} vehicleNumber
 */
export function createVehicleDetailPanel(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.vehicleDetails&vehicle=${vehicleNumber}`;
  let $panel = $("#VehicleSummary");
  let namespace = "vehicle_summary";

  $.getJSON(endpoint)
    .done(response => {
      let vehicle = response.data;
      if (vehicle === null) {
        console.error(`Error (createVehicleDetailPanel): ${response.message}`);
        fail();
        return false;
      }

      // Each key in the returned json should align with a data-field attribute in the html template
      for (const [key, value] of Object.entries(vehicle)) {
        $panel.find(`[data-field='${namespace}.${key}']`).text(value);
      }
    })
    .fail(response => {
      console.error("Error in createVehicleDetailPanel");
      let errorText = response.responseJSON
        ? response.responseJSON.message
        : response.statusText;
      $panel.html(
        createError("Error", errorText, "alert-danger m-0 rounded-0 w-100")
      );
    });
}

/**
 * Load driver detail panel.
 * @requires JSON object keys to match data-fields in panel
 * @param {*} vehicleNumber
 */
export function createDriverDetailPanel(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.driverDetails&vehicle=${vehicleNumber}`;
  let $panel = $("#DriverSummary");
  let namespace = "driver_summary";

  $.getJSON(endpoint)
    .done(response => {
      let driver = response.data;
      if (driver === null) {
        console.error(`Error (createDriverDetailPanel): ${response.message}`);
        fail();
        return false;
      }

      // Each key in json should match a data-field attribute in the html template
      for (const [key, value] of Object.entries(driver)) {
        $panel.find(`[data-field='${namespace}.${key}']`).text(value);
      }
    })
    .fail(response => {
      console.error("Error in createDriverDetailPanel");
      let errorText = response.responseJSON
        ? response.responseJSON.message
        : response.statusText;
      $panel.html(
        createError("Error", errorText, "alert-danger m-0 rounded-0 w-100")
      );
    });
}

/**
 * Initialize and fill the Fuel History DataTable with data from json.
 * @param {*} vehicleNumber
 */
export function createFuelHistoryTable(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.fuelHistory&vehicle=${vehicleNumber}`;
  let $table = $("#FuelHistory");

  // Define DataTable options
  const options = {
    ajax: {
      url: endpoint,
      dataSrc: json => (json.data === null ? [] : json.data)
    },
    autoWidth: false,
    columns: [
      {
        data: "date",
        type: "date",
        width: "10%",
        render: data => {
          if (data) {
            let date = moment(data, "MM/DD/YYYY");
            return date && date.isValid() ? date.format("L") : "";
          }
          return "";
        }
      },
      { data: "odometer", width: "10%" },
      { data: "driver", width: "20%" },
      {
        data: "merchant_address",
        className: "map-link",
        width: "20%",
        render: data =>
          //prettier-ignore
          `<button type='button' class='btn btn-sm text-decoration-none btn-link text-primary' data-title="${data}" data-url='https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(data)}&key=${process.env.GOOGLE_MAPS_API_KEY}'>
            <i class="fas fa-fw fa-map-marker-alt text-info"></i>&nbsp;
            ${data}
          </button>`
      },
      {
        data: "type",
        width: "10%",
        render: data => {
          let type = data.toLowerCase();
          let colorClass = "";
          //prettier-ignore
          switch(true){
            case /wash/.test(type): colorClass = "badge-info"; break;
            case /prem/.test(type):
            case /unl/.test(type):
            case /gas/.test(type): colorClass = "badge-primary"; break;
            case /tax/.test(type): 
            case /sal/.test(type): 
            case /misc/.test(type): colorClass = "badge-warning"; break; 
            default: colorClass = "badge-secondary"; break;
          }
          return `<span class="badge ${colorClass} text-light">${data}</span>`;
        }
      },
      { data: "quantity", width: "10%" },
      { data: "unit_cost", width: "10%" },
      { data: "amount", width: "10%" }
    ],
    initComplete: (settings, json) => {
      $table.on("click", "td.map-link > button", event => {
        let url = $(event.target).data("url");
        let title = $(event.target).data("title");
        createGoogleMap(url, title);
      });
    }
  };

  // Initialize the DataTable
  $table.DataTable(options);
}

/**
 * Initialize and fill the Maintenance History DataTable with data from json.
 * @param {*} vehicleNumber
 */
export function createMaintenanceHistoryTable(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.maintenanceHistory&vehicle=${vehicleNumber}`;
  /** @type {DataTables.Api} */
  let table;
  let $tableElem = $("#MaintenanceHistory");

  // Click to show maintenance group details
  let showDetails = function(data) {
    let $details = $("<table style=''>");
    $.each(data.maintenance_items, function(index, row) {
      let $tr = $("<tr>");

      //spacer, service, quantity, amount, spacer
      $tr.append(`<td style="width:50%;" colspan="4"></td>`);
      //prettier-ignore
      $tr.append(`<td style="width:20%;font-style:italic;">${row["service"]}</td>`);
      $tr.append(`<td style="width:10%;">${row["quantity"]}</td>`);
      $tr.append(`<td style="width:15%;">${row["amount"]}</td>`);
      $tr.append(`<td style="width:5%;"></td>`);

      $details.append($tr);
    });
    $details.append(
      $(`<tr>
          <td style="width:10%;"></td>
          <td style="width:10%;"></td>
          <td style="width:20%;"></td>
          <td style="width:10%;"></td>
          <th style="width:20%;border-top:2px solid;">Total:</th>
          <th style="width:10%;border-top:2px solid;"></th>
          <th style="width:15%;border-top:2px solid;">${data.total_amount}</th>
          <td style="width:5%;"></td>
        </tr>`)
    );
    return $details[0].outerHTML;
  };

  // Define DataTable options
  /** @type {DataTables.Settings} */
  const options = {
    ajax: {
      url: endpoint,
      dataSrc: json => (json.data === null ? [] : json.data)
    },
    autoWidth: false,
    columns: [
      {
        data: "date",
        type: "date",
        width: "10%",
        render: data => {
          if (data) {
            let date = moment(data, "MM/DD/YYYY");
            return date && date.isValid() ? date.format("L") : "";
          }
          return "";
        }
      },
      { data: "odometer", width: "10%" },
      { data: "vendor", width: "20%" },
      {
        data: "in_network",
        width: "10%",
        //prettier-ignore
        render: data => `<i class='fas ${data ? "fa-check-circle text-success" : "fa-times-circle text-danger"}'></i>`
      },
      { data: "service", width: "20%", className: "font-italic" },
      { data: "quantity", width: "10%" },
      { data: "total_amount", width: "15%" },
      {
        data: null,
        orderable: false,
        className: "details-control",
        defaultContent: "<i class='fas fa-fw fa-plus text-primary'></i>",
        width: "5%"
      }
    ],
    initComplete: (settings, json) => {
      $tableElem.on("click", "tr td.details-control", function() {
        let $icon = $(this).find("[data-icon]");
        let $tr = $(this).closest("tr");
        let $row = table.row($tr);

        if ($row.child.isShown()) {
          // this row is already open - close it
          $row.child.hide();
          $tr.removeClass("shown");
          $icon.attr("data-icon", "plus");
        } else {
          // Open this row
          $row.child(showDetails($row.data()), "p-0").show();
          $tr.addClass("shown");
          $icon.attr("data-icon", "minus");
        }
        console.log("clicked expand, data: ");
      });
    }
  };

  // Initialize the DataTable
  table = $tableElem.DataTable(options);
}

/**
 * Initialize and fill the Toll History DataTable with data from json.
 * @param {*} vehicleNumber
 */
export function createTollHistoryTable(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.tollHistory&vehicle=${vehicleNumber}`;
  let $table = $("#TollHistory");

  // Define DataTable options
  const options = {
    ajax: {
      url: endpoint,
      dataSrc: json => (json.data === null ? [] : json.data)
    },
    columns: [
      {
        data: "date_time",
        type: "date",
        render: data => {
          if (data) {
            let date = moment(data, "DD-MMM-YYYY HH:mm:ss");
            return date && date.isValid() ? date.format("lll") : "";
          }
          return "";
        }
      },
      {
        data: "description",
        render: data => data.split(":")[0].trim()
      },
      {
        data: "description",
        className: "map-link",
        //prettier-ignore
        render: data => {
          let parts = data.split(":");
          let location = parts[parts.length - 1].trim();
          return `<button type="button" class="btn btn-sm text-decoration-none btn-link text-primary" data-title="${location}" data-url='https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}'>
            <i class="fas fa-fw fa-map-marker-alt text-info"></i>&nbsp;
            ${location}
          </button>`;
        }
      },
      { data: "amount" }
    ],
    initComplete: (settings, json) => {
      $table.on("click", "td.map-link > button", event => {
        let url = $(event.target).data("url");
        let title = $(event.target).data("title");
        createGoogleMap(url, title);
      });
    }
  };

  // Initialize the DataTable
  $table.DataTable(options);
}

/**
 * Initialize and fill the Billing History DataTable with data from json.
 * @param {*} vehicleNumber
 */
export function createBillingHistoryTable(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.billingHistory&vehicle=${vehicleNumber}`;
  let $table = $("#BillingHistory");

  // Define DataTable options
  const options = {
    dom: `<'row no-gutters'
      <'col-12 table-responsive'tr>
    ><'row no-gutters'
      <'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>
    >`,
    pageLength: 5,
    ajax: {
      url: endpoint,
      dataSrc: json => (json.data === null ? [] : json.data)
    },
    columns: [
      {
        data: "bill_date",
        type: "date",
        render: data => {
          if (data) {
            let date = moment(data, "MMM-YY");
            return date && date.isValid() ? date.format("MMM YYYY") : "";
          }
          return "";
        }
      },
      {
        data: "type",
        //prettier-ignore
        render: data => {
          return `<span class="badge ${data.toLowerCase().indexOf("rental") !== -1 ? "badge-secondary" : "badge-primary"} text-light">${data.toUpperCase().replace("BILLING", "").trim()}</span>`
        }
      },
      { data: "amount" },
      {
        data: null,
        render: (data, type, row, meta) =>
          //prettier-ignore
          `<button type="button" class="btn btn-sm btn-link text-decoration-none text-primary" data-type-desc="${row["type"]}" data-bill-date="${row["bill_date"]}" data-bill-for-date="${row["bill_for_date"]}" data-center="${row["center"]}" data-invoice="${row["invoice"]}">
            <span data-i18n="common:view"></span>&nbsp;
            <i class="fas fa-fw fa-file-invoice-dollar"></i>
          </button>`
      }
    ],
    drawCallback: () => {
      // smaller pager
      $("ul.pagination").addClass("pagination-sm");
      // only call localization if the i18n library is ready
      if (window.$.i18n) {
        $table.localize();
      }
    },
    initComplete: (settings, json) => createBillingDetailsPopups(vehicleNumber)
  };

  // Initialize the DataTable
  $table.DataTable(options);
}

/**
 * Bind click handler and setup DataTable to show billing details in a sweetalert
 * @param {*} vehicleNumber
 */
function createBillingDetailsPopups(vehicleNumber) {
  // Use a delegated click handler since only the first page of data is visible in DataTables
  //prettier-ignore
  $('#BillingHistory').on("click", "button[data-invoice]", event => {
    let center = $(event.target).data("center");
    let invoice = $(event.target).data("invoice");
    let billDate = moment($(event.target).data("bill-date"), "MMM-YY").format("MM/YYYY");
    let billForDate = moment($(event.target).data("bill-for-date"), "MMM-YY").format("MM/YYYY");
    let typeDesc = $(event.target).data("type-desc");
    let endpoint = `services?command=VehicleDash.ajax.billingTransactionDetails&vehicle=${vehicleNumber}&invoice=${invoice}&center=${center}&billDate=${billDate}&billForDate=${billForDate}&typeDesc=${typeDesc}`;

    // Show the details in a SweetAlert2 popup
    Swal.fire({
      title: `Invoice #${invoice} Details`,
      html: 
      `<table id="BillingDetails" class="table">
        <thead>
          <tr>
            <th data-i18n="billing_history.bill_date"></th>
            <th data-i18n="billing_history.voucher"></th>
            <th data-i18n="billing_history.voucher_date"></th>
            <th data-i18n="billing_history.description"></th>
            <th data-i18n="billing_history.amount"></th>
          </tr>
        </thead>
        <tbody>
        </tbody>
        <tfoot>
          <tr>
            <th colspan="3"></th>
            <th style="border-top:2px solid;">Invoice Total: </th>
            <th style="border-top:2px solid;"></th>
          </tr>
        </tfoot>
      </table>`,
      width: 900,
      type: "info",
      buttonsStyling: false,
      // localize the column headers
      onOpen: () => $('.swal2-show').localize(),
      customClass: {
        confirmButton: "btn btn-block btn-primary",
        content: "swal-datatable"
      }
    });

    // Define DataTable options
    const options = {
      ajax: {
        url: endpoint,
        dataSrc: json => (json.data === null ? [] : json.data)
      },
      dom: 
      `<'row no-gutters'
        <'col-12 table-responsive'tr>
      ><'row no-gutters'
        <'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>
      >`,
      pageLength: 5,
      autoWidth: false,
      columns: [
        { data: "bill_date", width: "15%" },
        { data: "voucher", width: "20%" },
        { data: "voucher_date", width: "15%" },
        { data: "description", width: "25%" },
        { data: "amount", width: "25%" }
      ],
      footerCallback: function(row, data, start, end, display) {
        // Aggregating total amount in footer
        let api = this.api();

        let getNumericValue = (i) => Number(i.toString().replace(/[^0-9.-]+/g, ""));

        let total = api.column(4).data().reduce(function(a,b){
          if(isNaN(getNumericValue(a))){
            return "";
          }else{
            a = getNumericValue(a);
          }
          if(isNaN(getNumericValue(b))){
            return "";
          }else{
            b = getNumericValue(b);
          }
          return (a + b).toFixed(2);
        }, 0);

        $(api.column(4).footer()).html(`$${total}`);
      }
    };

    // Initialize the DataTable
    $('#BillingDetails').DataTable(options);
  })
}

/**
 * Initialize and fill the Licensing History DataTable with data from json.
 * @param {*} vehicleNumber
 */
export function createLicensingHistoryTable(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.licensingHistory&vehicle=${vehicleNumber}`;
  let $table = $("#LicensingHistory");

  // Define DataTable options
  const options = {
    ajax: {
      url: endpoint,
      dataSrc: json => (json.data === null ? [] : json.data)
    },
    dom: `<'row no-gutters'
      <'col-12 table-responsive'tr>
    ><'row no-gutters'
      <'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>
    >`,
    pageLength: 5,
    columns: [
      {
        data: "exp_date",
        type: "date",
        render: data => {
          if (data) {
            let date = moment(data, "MM/DD/YY");
            return date && date.isValid() ? date.format("L") : "";
          }
          return "";
        }
      },
      {
        data: "status",
        //prettier-ignore
        render: data => `<span class="badge ${data.toLowerCase().indexOf("completed") !== -1 ? "badge-success" : "badge-secondary"} text-light">${data.toUpperCase()}</span>`
      },
      {
        data: null,
        render: (data, type, row, meta) =>
          //prettier-ignore
          `<button type='button' class='btn btn-sm btn-link text-decoration-none text-primary' data-licensing-details-period="${row["period"]}">
            <span data-i18n="common:view"></span>&nbsp;
            <i class="fas fa-fw fa-file-invoice-dollar"></i>
          </button>`
      },
      {
        data: null,
        render: (data, type, row, meta) =>
          //prettier-ignore
          row["status"].toLowerCase().indexOf("completed") == -1 
          ? `<button type="button" class="btn btn-sm btn-link text-decoration-none text-warning" data-needs="${row["status"]}" data-licensing-needs-period="${row["period"]}" >
            <span data-i18n="common:view"></span>&nbsp;
            <i class='fas fa-fw fa-exclamation-triangle'></i>
          </button>` 
          : ""
      }
    ],
    drawCallback: () => {
      // smaller pager
      $("ul.pagination").addClass("pagination-sm");
      // only call localization if the i18n library is ready
      if (window.$.i18n) {
        $table.localize();
      }
    },
    initComplete: (settings, json) => createLicensingPopups(vehicleNumber)
  };

  // Initialize the DataTable
  $table.DataTable(options);
}

/**
 * Bind Licensing Table button click popup handlers
 * @param {*} vehicleNumber
 */
export function createLicensingPopups(vehicleNumber) {
  createLicensingDetailsPopup(vehicleNumber);
  createLicensingNeedsPopup(vehicleNumber);
}

/**
 * Bind Licensing Details Click popup
 * @param {*} vehicleNumber
 */
function createLicensingDetailsPopup(vehicleNumber) {
  //prettier-ignore
  $("#LicensingHistory").on("click", "button[data-licensing-details-period]", event => {
    let period = $(event.target).data("licensing-details-period");
    let endpoint = `services?command=VehicleDash.ajax.licensingHistoryDetails&vehicle=${vehicleNumber}&period=${period}`;

    // Define SweetAlert options
    const swalOptions = {
      title: `Licensing History Details`,
      html: 
      `<table id="LicensingHistoryDetails" class="table">
        <thead>
          <tr>
            <th data-i18n="licensing_history.date"></th>
            <th data-i18n="licensing_history.description"></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>`,
      width: 900,
      type: "info",
      // localize the column headers
      onOpen: () => $('.swal2-show').localize(),
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-block btn-primary",
        content: "swal-datatable"
      }
    };

    // Show Details in Sweetalert
    Swal.fire(swalOptions);

    // Define DataTable options
    const dtOptions = {
      ajax: {
        url: endpoint,
        dataSrc: json => (json.data === null ? [] : json.data)
      },
      autoWidth: false,
      dom: 
      `<'row no-gutters'
        <'col-12 table-responsive'tr>
      ><'row no-gutters'
        <'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>
      >`,
      columns: [
        { data: "date", type: "date", width: "25%" },
        { data: "description", width: "75%" }
      ]
    };

    // Initialize the DataTable
    $("#LicensingHistoryDetails").DataTable(dtOptions);
  });
}

/**
 * Bind Licensing Needs Click popup
 * @param {*} vehicleNumber
 */
function createLicensingNeedsPopup(vehicleNumber) {
  //prettier-ignore
  $("#LicensingHistory").on("click", "button[data-needs]", event => {
    let period = $(event.target).data("licensing-needs-period");
    let endpoint = `services?command=VehicleDash.ajax.licensingHistoryNeeds&vehicle=${vehicleNumber}&period=${period}`;

    // Define SweetAlert options
    const swalOptions = {
      title: `Licensing Needs`,
      html: 
      `<table id="LicensingHistoryNeeds" class="table">
        <thead>
          <tr>
            <th data-i18n="licensing_history.date"></th>
            <th data-i18n="licensing_history.description"></th>
            <th data-i18n="licensing_history.status"></th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>`,
      width: 900,
      type: "info",
      // localize the column headers
      onOpen: () => $('.swal2-show').localize(),
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-block btn-primary",
        content: "swal-datatable"
      }
    };

    // Show Needs in SweetAlert
    Swal.fire(swalOptions);

    // Define DataTable options
    const dtOptions = {
      ajax: {
        url: endpoint,
        dataSrc: json => (json.data === null ? [] : json.data)
      },
      autoWidth: false,
      dom: 
      `<'row no-gutters'
        <'col-12 table-responsive'tr>
      ><'row no-gutters'
        <'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>
      >`,
      columns: [
        { data: "date", type: "date", width: "30%" },
        { data: "description", width: "35%" },
        { data: "status", width: "35%" }
      ]
    }

    // Initialize the DataTable
    $('#LicensingHistoryNeeds').DataTable(dtOptions);
  });
}

/**
 * Initialize and fill the Violation History DataTable with data from json.
 * @param {*} vehicleNumber
 */
export function createViolationHistoryTable(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.violationHistory&vehicle=${vehicleNumber}`;
  let $table = $("#ViolationHistory");

  // Define DataTables options
  const options = {
    ajax: {
      url: endpoint,
      dataSrc: json => (json.data === null ? [] : json.data)
    },
    dom: `<'row no-gutters'
      <'col-12 table-responsive'tr>
    ><'row no-gutters'
      <'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>
    >`,
    pageLength: 5,
    columns: [
      {
        data: "date",
        type: "date",
        render: data => {
          if (data) {
            let date = moment(data, "MM/DD/YY");
            return date && date.isValid() ? date.format("L") : "";
          }
          return "";
        }
      },
      {
        data: "paid_date",
        type: "date",
        render: data => {
          if (data) {
            let date = moment(data, "MM/DD/YY");
            return date && date.isValid() ? date.format("L") : "";
          }
          return "";
        }
      },
      {
        data: "type",
        //prettier-ignore
        render: data => `<span class="badge ${data.toLowerCase().indexOf("parking") !== -1 ? "badge-warning" : "badge-danger"} text-light">${data.toUpperCase().split(" ")[0].trim()}</span>`
      },
      { data: "amount" },
      {
        data: "number",
        render: data =>
          //prettier-ignore
          `<button type="button" class="btn btn-sm btn-link text-decoration-none text-primary" data-violation="${data}" >
            <span data-i18n="common:view"></span>&nbsp;
            <i class='fas fa-fw fa-exclamation-triangle'></i>
          </button>`
      }
    ],
    drawCallback: () => {
      // smaller pager
      $("ul.pagination").addClass("pagination-sm");
      // only call localization if the i18n library is ready
      if (window.$.i18n) {
        $table.localize();
      }
    },
    initComplete: (settings, json) => createViolationPopups(vehicleNumber)
  };

  // Initialize the DataTable
  $table.DataTable(options);
}

/**
 * Bind Violation Click popup
 * @param {*} vehicleNumber
 */
function createViolationPopups(vehicleNumber) {
  $("#ViolationHistory").on("click", "button[data-violation]", event => {
    let violation = $(event.target).data("violation");
    let endpoint = "https://www.fillmurray.com/400/250";

    // Define SweetAlert options
    const swalOptions = {
      title: `Violation #${violation}`,
      text:
        "Populate this with the violation image (too much work to load from dev2 so here's Bill Murray)",
      type: "info",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-block btn-primary"
        //content: "swal-datatable"
      },
      imageUrl: endpoint,
      imageHeight: 250,
      imageAlt: "Bill Murray",
      showCancelButton: false,
      showCloseButton: true
    };

    // Show Violation in SweetAlert
    Swal.fire(swalOptions);
  });
}

/**
 * Initialize and fill the Inspection History DataTable with data from json.
 * @param {*} vehicleNumber
 */
export function createInspectionHistoryTable(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.inspectionHistory&vehicle=${vehicleNumber}`;
  let $table = $("#InspectionHistory");

  // Define DataTables options
  const options = {
    ajax: {
      url: endpoint,
      dataSrc: json => (json.data === null ? [] : json.data)
    },
    dom: `<'row no-gutters'
      <'col-12 table-responsive'tr>
    ><'row no-gutters'
      <'col-6 my-2 py-2 px-3'i><'col-6 my-1 px-3'p>
    >`,
    pageLength: 5,
    columns: [
      {
        data: "date",
        type: "date",
        render: data => {
          if (data) {
            let date = moment(data, "MM/DD/YYYY h:mm a");
            return date && date.isValid() ? date.format("L") : "";
          }
          return "";
        }
      },
      {
        data: "comments",
        render: $.fn.dataTable.render.ellipsis(25)
      },
      {
        data: null,
        render: (data, type, row, meta) =>
          //prettier-ignore
          `<button type='button' class='btn btn-sm btn-link text-decoration-none text-primary' data-inspection="${row["id"]}">
            <span data-i18n="common:view"></span>&nbsp;
            <i class="fas fa-fw fa-camera"></i>
          </button>`
      }
    ],
    drawCallback: () => {
      // smaller pager
      $("ul.pagination").addClass("pagination-sm");
      // only call localization if the i18n library is ready
      if (window.$.i18n) {
        $table.localize();
      }
    },
    initComplete: (settings, json) => createInspectionPopups(vehicleNumber)
  };

  // Initialize the DataTable
  $table.DataTable(options);
}

/**
 * Bind Inspection Click popup
 * @param {*} vehicleNumber
 */
function createInspectionPopups(vehicleNumber) {
  $("#InspectionHistory").on("click", "button[data-inspection]", event => {
    let inspection = $(event.target).data("report-id");
    let endpoint = "https://www.fillmurray.com/400/250";

    // Define SweetAlert options
    const swalOptions = {
      title: `Inspection #${inspection}`,
      text: `Populate this with the inspection images? (too much work for dev2 server to access docImages, so here's Bill Murray)`,
      type: "info",
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-block btn-primary"
      },
      imageUrl: endpoint,
      imageHeight: 250,
      imageAlt: "Bill Murray",
      showCancelButton: false,
      showCloseButton: true
    };

    // Show Inspection in SweetAlert
    Swal.fire(swalOptions);
  });
}

/**
 * Generate and animate Vehicle Tiles from json
 * @param {*} vehicleNumber
 */
export function createVehicleTiles(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.vehicleTiles&vehicle=${vehicleNumber}`;

  $.getJSON(endpoint)
    .done(response => {
      let tiles = response.data;
      $.each(tiles, (index, tile) => {
        let $tile = createTile(tile);
        animateTile($tile);
        $("#VehicleTiles").append($tile);
      });
    })
    .fail(response => {
      let errorText = response.responseJSON
        ? response.responseJSON.error
        : response.statusText;
      //prettier-ignore
      let $error = createError("Error", errorText, "alert-danger mx-3 p-4 w-100");
      $("#VehicleTiles").append($error);
    });
}

/**
 * Generate and animate Licensing Tiles from json
 * @param {*} vehicleNumber
 */
export function createLicensingTiles(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.licensingTiles&vehicle=${vehicleNumber}`;

  $.getJSON(endpoint)
    .done(response => {
      let tiles = response.data;
      $.each(tiles, (index, tile) => {
        let $tile = createTile(tile);
        animateTile($tile);
        $("#LicensingTiles").append($tile);
      });
    })
    .fail(response => {
      let errorText = response.responseJSON
        ? response.responseJSON.error
        : response.statusText;
      //prettier-ignore
      let $error = createError("Error", errorText, "alert-danger mx-3 p-4 w-100");
      $("#LicensingTiles").append($error);
    });
}

/**
 * Generate and animate Fuel Tiles from json
 * @param {*} vehicleNumber
 */
export function createFuelTiles(vehicleNumber) {
  let endpoint = `services?command=VehicleDash.ajax.fuelTiles&vehicle=${vehicleNumber}`;

  $.getJSON(endpoint)
    .done(response => {
      let tiles = response.data;
      $.each(tiles, (index, tile) => {
        let $tile = createTile(tile);
        animateTile($tile);
        $("#FuelTiles").append($tile);
      });
    })
    .fail(response => {
      let errorText = response.responseJSON
        ? response.responseJSON.error
        : response.statusText;
      //prettier-ignore
      let $error = createError("Error", errorText, "alert-danger mx-3 p-4 w-100");
      $("#FuelTiles").append($error);
    });
}

/**
 * Apply counter animations based on data-attributes
 */
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

  $(target).on("click", () => {
    animation.reset();
    animation.start();
  });
}
