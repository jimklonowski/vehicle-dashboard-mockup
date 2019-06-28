window.$ = window.jQuery = require("jquery");

// Import bootstrap JS
import "bootstrap";

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
