window.$ = window.jQuery = require("jquery");
// Import bootstrap JS
import "bootstrap";

// Import DataTables
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons-bs4";
//import "datatables.net-responsive-bs4";
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons-bs4/js/buttons.bootstrap4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-buttons-bs4/css/buttons.bootstrap4.css";
//import "datatables.net-responsive-bs4/css/responsive.bootstrap4.css";

// initialize vehicle dashboard
import "./vehicle-dashboard/vehicle-dashboard";

// attach sweetalert handlers
import "./util/util";

// Import what we need from KendoUI
// import "@progress/kendo-ui/js/kendo.dataviz.gauge";
// import "@progress/kendo-ui/css/web/kendo.common.css";
// import "@progress/kendo-ui/css/web/kendo.default.css";

// Import FontAwesome
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faAlignLeft,
  faAngry,
  faArrowLeft,
  faBatteryThreeQuarters,
  faBell,
  faCalendarAlt,
  faCamera,
  faCheckCircle,
  faCircle,
  faCog,
  faCogs,
  faComments,
  faDollarSign,
  faEllipsisV,
  faExclamationCircle,
  faExclamationTriangle,
  faFileInvoice,
  faFileInvoiceDollar,
  faGasPump,
  faHandHoldingUsd,
  faHistory,
  faMapMarkerAlt,
  faParking,
  faPowerOff,
  faSearch,
  faShippingFast,
  faSignOutAlt,
  faTachometerAlt,
  faTimesCircle,
  faToolbox,
  faUser
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faAlignLeft,
  faAngry,
  faArrowLeft,
  faBatteryThreeQuarters,
  faBell,
  faCalendarAlt,
  faCamera,
  faCheckCircle,
  faCircle,
  faCog,
  faCogs,
  faComments,
  faDollarSign,
  faEllipsisV,
  faExclamationCircle,
  faExclamationTriangle,
  faFileInvoice,
  faFileInvoiceDollar,
  faGasPump,
  faHandHoldingUsd,
  faHistory,
  faMapMarkerAlt,
  faParking,
  faPowerOff,
  faSearch,
  faShippingFast,
  faSignOutAlt,
  faTachometerAlt,
  faTimesCircle,
  faToolbox,
  faUser
);

dom.watch();

// Import Stylesheets
import "../scss/index.scss";
