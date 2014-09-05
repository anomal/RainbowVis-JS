/*
RainbowVis-JS 
Released under Eclipse Public License - v 1.0
*/

var Rainbow = (function() {
	function Rainbow()
	{
		this.gradients = null;
		this.minNum = 0;
		this.maxNum = 100;
		this.colours = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
		this.setColours(this.colours);
	}

	Rainbow.prototype.setColours = function (spectrum) 
	{
		if (spectrum.length < 2) {
			throw new Error('Rainbow must have two or more colours.');
		} else {
			var increment = (this.maxNum - this.minNum)/(spectrum.length - 1);
			var firstGradient = new ColourGradient();
			firstGradient.setGradient(spectrum[0], spectrum[1]);
			firstGradient.setNumberRange(this.minNum, this.minNum + increment);
			this.gradients = [ firstGradient ];
			
			for (var i = 1; i < spectrum.length - 1; i++) {
				var colourGradient = new ColourGradient();
				colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
				colourGradient.setNumberRange(this.minNum + increment * i, this.minNum + increment * (i + 1)); 
				this.gradients[i] = colourGradient; 
			}

			this.colours = spectrum;
			return this;
		}
	}

	Rainbow.prototype.setColors = Rainbow.prototype.setColours;

	Rainbow.prototype.setSpectrum = function () 
	{
		return this.setColours(arguments);
	}

	Rainbow.prototype.setSpectrumByArray = function (array)
	{
	    return this.setColours(array);
	}

	Rainbow.prototype.colourAt = function (number)
	{
		if (isNaN(number)) {
			throw new TypeError(number + ' is not a number');
		} else if (this.gradients.length === 1) {
			return this.gradients[0].colourAt(number);
		} else {
			var segment = (this.maxNum - this.minNum)/(this.gradients.length);
			var index = Math.min(Math.floor((Math.max(number, this.minNum) - this.minNum)/segment), this.gradients.length - 1);
			return this.gradients[index].colourAt(number);
		}
	}

	Rainbow.prototype.colorAt = Rainbow.prototype.colourAt;

	Rainbow.prototype.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			this.minNum = minNumber;
			this.maxNum = maxNumber;
			this.setColours(this.colours);
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
		return this;
	}

	return Rainbow;
})();

var ColourGradient = (function() {
	ColourGradient.colourNames =
	[
		['red', 'ff0000'],
		['lime', '00ff00'],
		['blue', '0000ff'],
		['yellow', 'ffff00'],
		['orange', 'ff8000'],
		['aqua', '00ffff'],
		['fuchsia', 'ff00ff'],
		['white', 'ffffff'],
		['black', '000000'],
		['gray', '808080'],
		['grey', '808080'],
		['silver', 'c0c0c0'],
		['maroon', '800000'],
		['olive', '808000'],
		['green', '008000'],
		['teal', '008080'],
		['navy', '000080'],
		['purple', '800080']
	];

	ColourGradient.hexRegex = /^#?[0-9a-fA-F]{6}$/i;


	function ColourGradient() 
	{
		this.startColour = 'ff0000';
		this.endColour = '0000ff';
		this.minNum = 0;
		this.maxNum = 100;
	}

	ColourGradient.prototype.setGradient = function (colourStart, colourEnd)
	{
		this.startColour = ColourGradient.getHexColour(colourStart);
		this.endColour = ColourGradient.getHexColour(colourEnd);
	}

	ColourGradient.prototype.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			this.minNum = minNumber;
			this.maxNum = maxNumber;
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
	}

	ColourGradient.prototype.colourAt = function (number)
	{
		return this.calcHex(number, this.startColour.substring(0,2), this.endColour.substring(0,2)) 
			+ this.calcHex(number, this.startColour.substring(2,4), this.endColour.substring(2,4)) 
			+ this.calcHex(number, this.startColour.substring(4,6), this.endColour.substring(4,6));
	}
	
	ColourGradient.prototype.calcHex = function (number, channelStart_Base16, channelEnd_Base16)
	{
		var num = number;
		if (num < this.minNum) {
			num = this.minNum;
		}
		if (num > this.maxNum) {
			num = this.maxNum;
		} 
		var numRange = this.maxNum - this.minNum;
		var cStart_Base10 = parseInt(channelStart_Base16, 16);
		var cEnd_Base10 = parseInt(channelEnd_Base16, 16); 
		var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
		var c_Base10 = Math.round(cPerUnit * (num - this.minNum) + cStart_Base10);
		return ColourGradient.formatHex(c_Base10.toString(16));
	}

	ColourGradient.formatHex = function (hex) 
	{
		if (hex.length === 1) 
			return '0' + hex;
		else 
			return hex;
	} 
	
	ColourGradient.isHexColour = function (string)
	{
		return ColourGradient.hexRegex.test(string);
	}

	ColourGradient.getHexColour = function (string)
	{
		if (ColourGradient.isHexColour(string)) {
			return string.substring(string.length - 6, string.length);
		} else {
			var cn = ColourGradient.colourNames;

			for (var i = 0; i < cn.length; i++) {
				if (string.toLowerCase() === cn[i][0]) {
					return cn[i][1];
				}
			}
			throw new Error(string + ' is not a valid colour.');
		}
	}

	return ColourGradient;
})();