window.$ = window.jQuery = require("jquery");

// Import bootstrap JS
import "bootstrap";

// Import DataTables
import "datatables.net";
import "datatables.net-buttons";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons-bs4/js/buttons.bootstrap4";
import "datatables.net-bs4/css/dataTables.bootstrap4.css";
import "datatables.net-buttons-bs4/css/buttons.bootstrap4.css";

// initialize counter animations
import "./vehicle-dashboard/vehicle-dashboard";

// attach sweetalert handlers
import "./util/util";

// Import what we need from KendoUI
import "@progress/kendo-ui/js/kendo.dataviz.gauge";
import "@progress/kendo-ui/css/web/kendo.common.css";
import "@progress/kendo-ui/css/web/kendo.default.css";

// Import FontAwesome
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faTachometerAlt,
  faFileInvoice,
  faShippingFast,
  faExclamationCircle,
  faToolbox,
  faSignOutAlt,
  faBell,
  faComments,
  faCogs,
  faCog,
  faPowerOff,
  faAlignLeft,
  faArrowLeft,
  faSearch,
  faUser,
  faCircle,
  faGasPump,
  faDollarSign,
  faBatteryThreeQuarters,
  faEllipsisV,
  faTimesCircle,
  faCheckCircle,
  faMapMarkerAlt,
  faCamera
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faTachometerAlt,
  faFileInvoice,
  faShippingFast,
  faExclamationCircle,
  faToolbox,
  faSignOutAlt,
  faBell,
  faComments,
  faCogs,
  faCog,
  faPowerOff,
  faAlignLeft,
  faArrowLeft,
  faSearch,
  faUser,
  faCircle,
  faGasPump,
  faDollarSign,
  faBatteryThreeQuarters,
  faEllipsisV,
  faTimesCircle,
  faCheckCircle,
  faMapMarkerAlt,
  faCamera
);

dom.watch();

// Import Stylesheets
import "../scss/index.scss";
