// Animate On Scroll
import AOS from "aos";
import "aos/dist/aos.css";

// Dashboard Section Builders
import {
  createVehicleDetailPanel,
  createVehicleTiles,
  createFuelTiles,
  createLicensingTiles,
  createDriverDetailPanel,
  createFuelHistoryTable,
  createMaintenanceHistoryTable,
  createTollHistoryTable,
  createBillingHistoryTable,
  createLicensingHistoryTable,
  createViolationHistoryTable,
  createInspectionHistoryTable,
  createVehicleDashboardSearch,
  setDataTablesDefaults
} from "./vehicle-dashboard-builders";

import { initLocalization } from "../util/i18n";

//const isProduction = process.env.NODE_ENV === "production";
//const webroot = isProduction ? process.env.WEBROOT : "";

//document.addEventListener("DOMContentLoaded", function() {

// DOM is loaded - Start Building the Dashboard
$(function() {
  //set datatables defaults
  setDataTablesDefaults();

  //startup localization/internationalization (i18n)
  initLocalization();

  // get the vehicle number being queried from the get parameter
  //prettier-ignore
  let vehicleNumber = new URLSearchParams(window.location.search).get("vehicle");

  // Initialize the animate-on-scroll animations
  AOS.init({ once: true });

  if (vehicleNumber) {
    // search header
    createVehicleDashboardSearch(vehicleNumber);

    // build the detail panels
    createVehicleDetailPanel(vehicleNumber);
    createDriverDetailPanel(vehicleNumber);

    // build the tiles
    //createLicensingTiles(vehicleNumber);
    createVehicleTiles(vehicleNumber);
    createFuelTiles(vehicleNumber);

    // build the tables
    createFuelHistoryTable(vehicleNumber);
    createMaintenanceHistoryTable(vehicleNumber);
    createTollHistoryTable(vehicleNumber);
    createBillingHistoryTable(vehicleNumber);
    createLicensingHistoryTable(vehicleNumber);
    createViolationHistoryTable(vehicleNumber);
    createInspectionHistoryTable(vehicleNumber);
  } else {
    // remove all elements except search
    $("#container")
      .children()
      .not("#VehicleDashboardHeader")
      .remove();
    createVehicleDashboardSearch();
  }
});
