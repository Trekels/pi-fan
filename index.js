const fs = require('fs');
const Gpio = require('pigpio').Gpio;

const fanPin = 17;
const tempTreshold = 40;
const dutyCycleOffset = 70;
const criticalTempTreshold = 80;
const fan = new Gpio(fanPin, {mode: Gpio.OUTPUT});

// Ensure the pin is set ot 0 if the scripts exits 
function exitHandler() {
  fan.digitalWrite(0);
  process.exit();
}

const readCPUTemp = () => {
  try {
    return parseInt(fs.readFileSync('/sys/class/thermal/thermal_zone0/temp', 'utf8'), 10) / 1000;
  } catch(e) {
    return null;
  }
}

// Since the fan rotations starts around a dutyCycle of 80 the availabe range is 255 - 70 = 185
// The ideal temp of a pi is around 40°C and has a critical limit at 80°C we will map the pwm range over these 40 degrees
// This gives a 185/40 = 4.37 step per degree
const linearFanSpeed = (temp) => {
  console.log('Measured temp' + temp);
  if (temp >= criticalTempTreshold) {
    return 255;
  } else if (temp <= tempTreshold) {
    return 0;
  }

  return temp >= criticalTempTreshold ? 255 : Math.round(((temp - tempTreshold) * 4.62) + dutyCycleOffset);
}

// Keep the current dutyCycle in memory to check against changes in speed.
// If it is a state change from 0 to ... or ... to 0 we delay it by a measure cycle to reduce racing.
let activeFanSpeed = null;
const setFanSpeed = (fanSpeed) => {
  console.log('Requested fan speed: ' + fanSpeed);

  if (activeFanSpeed === 0 && fanSpeed !==0) {
    activeFanSpeed = fanSpeed;
    return;
  }

  if (activeFanSpeed !== 0 && fanSpeed === 0) {
    activeFanSpeed = fanSpeed;
    return;
  }

  console.log('Fanspeed set at: ' + fanSpeed);
  fan.pwmWrite(fanSpeed);
  activeFanSpeed = fanSpeed;
}

setInterval(() => {
  setFanSpeed(
    linearFanSpeed(
      readCPUTemp()
    )
  );
}, 500);

// Cleanup if the app crashes or is being closed
process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);
