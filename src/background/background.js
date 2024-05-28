// Imports
import { registerTabListener } from "../utils/tabHelper.js";

/**
 * Init
 */
(function initializeBackgroundScript() {
  console.log("INIT!");
  registerTabListener();
})();
