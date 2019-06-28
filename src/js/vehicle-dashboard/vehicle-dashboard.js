import { CountUp } from "countup.js";

// handle animations on this page
document.addEventListener("DOMContentLoaded", function() {
  $(".countmeup").each(function(index) {
    var $wrapper = $(this).closest(".tile");

    // fade in one-by-one
    $wrapper.delay(250 * index).fadeIn("slow");

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
  });
});
