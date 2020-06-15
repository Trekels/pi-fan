
const fs = require('fs');

// On a raspbery the temp is stored in the /sys/class/thermal/thermal_zone0/temp file
// The temp is stored in milidegrees so we need to adjust it.
exports.read = () => {
  try {
    return parseInt(fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8'), 10) / 1000;
  } catch(e) {
    return console.error(e.message);
  }
}