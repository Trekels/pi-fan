const Gpio = require('pigpio').Gpio;

exports.init = config => {

  let activeFanSpeed = null;
  const fan = new Gpio(config.fanPin, {mode: Gpio.OUTPUT});
  const { tempTreshold, criticalTempTreshold, dutyCycleOffset } = config;

  const stopFan = () => {
    fan.digitalWrite(0);
  };

  // Keep the current dutyCycle in memory to check against changes in speed.
  // If it is a state change from 0 to ... or ... to 0 we delay it by a measure cycle to reduce racing.
  const setFanSpeed = (fanSpeed) => {
    if (activeFanSpeed === 0 && fanSpeed !==0) {
      activeFanSpeed = fanSpeed;
      return;
    }
  
    if (activeFanSpeed !== 0 && fanSpeed === 0) {
      activeFanSpeed = fanSpeed;
      return;
    }

    fan.pwmWrite(fanSpeed);
    activeFanSpeed = fanSpeed;
  }

  // Since the fan rotations starts around a dutyCycle of 80 the availabe range is 255 - 70 = 185
  // The ideal temp of a pi is around 40°C and has a critical limit at 80°C we will map the pwm range over these 40 degrees
  // This gives a 185/40 = 4.37 step per degree
  const calcFanSpeed = temp => {
    if (temp >= criticalTempTreshold) {
      return 255;
    } else if (temp <= tempTreshold) {
      return 0;
    }

    return temp >= criticalTempTreshold ? 255 : Math.round(((temp - tempTreshold) * 4.62) + dutyCycleOffset);
  }

  return { setFanSpeed, calcFanSpeed, stopFan };
}