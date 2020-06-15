PI-Fan
---

This is a super simple node script to control the fan speed based on the temperature
of the raspberry pi's CPU. 

**Note** that this is just experimental, since temperature control of the cpu can be considered cirtical there are probably more reliable ways to control it and the memory footprint of javascript might is not the best for background services as this.

But that doens't mean we cant play around with it and for a hobby project this might just be the right fit considering the low
price and hackability.

### Setup

This script makes use of [pigpio](https://github.com/fivdi/pigpio), so we need to install the pigpio C library.
For more details you can check the previous link to pigpio!

```bash
sudo apt-get update
sudo apt-get install pigpio
```

Then install node modules as usual.

```javascript
npm install
```

### Usage

**fanPin (required)**
The Gpio control pin the fan is connected to. **!Note** that it is the GPIO pin not the physical one `GPIO 17 === pin 11`.

**dutyCycleOffset (required)**
Offset for the pulse width sins chances are the fan wont start turining at a pulse width of 1.
This depends on the fan used.

For example if the fan circuit is running on 12V then this is then devided over the amount of 'pwm steps' (which is 255).
So `12V / 255 = 0,047V` increase at each sinble step. If we configure and offset of 80, then the script will start at a 
step 80 which is equal to `0,047 * 80 =  3,76V` causing the fan to spin at a low pace.

**tempTreshold (default 40)**

This is the treshold that needs to be surpassed in orde for the script to trigger the fan temperture below this is considered 
`ok` withoud additional cooling. As for the raspberry a good temperature is usually below 40 hence the default.

**criticalTempTreshold (defaul 80)**

Critical treshold is the end of the temperatur range over which we will spread the pwm steps. At this temperature the fan must
be running at max rate to control temperature. 

```bash
node ./src/index.js --fanPin 17 -dutyCycleOffset 75 -tempTreshold 40 -criticalTempTreshold 80
```

And to start the script simply run `node start`, you might have to `sudo node start` because pigpio root/sudo privileges to
access hardware peripherals.

### Hardware configuration

 - A fan (One of an old pc will do fine)
 - Transistor *BD135 (Others can be used depending on the fan current)
 - 1k ohm resistor 
 - 4.7uF ~ 47uF capacitor
 - a diode
 - And some wires

