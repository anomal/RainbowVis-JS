RainbowVis-JS
=============

A JavaScript library for colour data visualization. Easily map numbers to a smooth-transitioning colour legend.

The Rainbow class by default maps the range 0 to 100 (inclusive) to the colours of the rainbow from red to blue (e.g. red, yellow, lime, blue).

[See example.](example.html)

`var rainbow = new Rainbow();` creates new instance of Rainbow. By default, the number range is from 0 to 100.

`colourAt(number)` returns the colour string corresponding to the number in hex colour format (e.g., 'ffffff'). If number is out of range, it returns the appropriate hex colour corresponding to either the minNumber or maxNumber.

`setSpectrum(colour1, colour2 [,colourN])` sets the spectrum of the Rainbow object. You must have a minimum of two colours, but you can specify more than two colours. Colours can be in the form 'red', 'ff0000', or '#ff0000'. For example, `rainbow.setSpectrum('red', 'yellow', 'white');` makes the "rainbow" a colour gradient from red to yellow to white.

`setNumberRange(minNumber, maxNumber)` sets the number range of the Rainbow object. It currently works for positive numbers. 
