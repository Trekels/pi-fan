const args = require('yargs')
  .usage('Usage: $0 --fanPin 17 -dutyCycleOffset 75 -tempTreshold 40 -criticalTempTreshold 80')
  .option('fanPin', {
    alias: 'p',
    type: 'number',
    required: true,
    description: 'Fan gpio pin',
  })
  .option('dutyCycleOffset', {
    alias: 'o',
    type: 'number',
    required: true,
    description: 'Pulse width offset',
  })
  .option('tempTreshold', {
    alias: 't',
    type: 'number',
    default: 40,
    description: 'Start fan above this temp',
  })
  .option('criticalTempTreshold', {
    alias: 'c',
    type: 'number',
    default: 80,
    description: 'Critical temp level',
  })
  .help('h')
  .alias('h', 'help')
  .argv;

const temperature = require('./temp');
const fanControl = require('./fan').init({
  fanPin: args.fanPin,
  tempTreshold: args.tempTreshold,
  dutyCycleOffset: args.dutyCycleOffset,
  criticalTempTreshold: args.criticalTempTreshold,
});

setInterval(() => {
  fanControl.setFanSpeed(
    fanControl.calcFanSpeed(
      temperature.read()
    )
  );
}, 1500);

// Ensure the pin is set ot 0 if the scripts exits 
function exitHandler() {
  fanControl.stopFan();
  process.exit();
}

// Cleanup if the app crashes or is being closed
process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);
process.on('uncaughtException', exitHandler);
