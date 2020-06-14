PI-Fan
---

This is a super simple node script to control the fan speed based on the temperature
of the raspberry pi's CPU. 

Note that this is just experimental, since temperature control of the cpu can be considered cirtical there are probably more reliable ways to controlit and the memory foodbprint of javascript is not the best for background services as this.

But that doens't mean we cant play around with it. And for a hobby project this might just be the right fit considered the low
price and hackability.

### Setup

This script makes use of (pigpio)[https://github.com/fivdi/pigpio], so we need to install the pigpio C library.
For more details on the lib check the previous link!

```bash
sudo apt-get update
sudo apt-get install pigpio
```

Then install node modules as normal.

```javascript
npm install
```

And to start the script simply run `node start`, you might have to `sudo node start` because pigpio root/sudo privileges to
access hardware peripherals

### Hardware configuration

 - A fan (One of an old pc will do fine)
 - Transistor *BD135 (Others can be used depending on the fan current)
 - 1k ohm resistor 
 - 4.7uF ~ 47uF capacitor
 - And some wires

