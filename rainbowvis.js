/*
RainbowVis-JS 
Released under Eclipse Public License - v 1.0
*/

var Rainbow = (function() {
	function Rainbow()
	{
		this.gradients = [];
		this.minNum = 0;
		this.maxNum = 100;
		this.colors = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
		this.setColors(this.colors);
	}

	Rainbow.prototype.setColors = function (spectrum) 
	{
		if (spectrum.length < 2) {
			throw new Error('Rainbow must have two or more colors.');
		} else {
			var numParts = spectrum.length - 1;

			var increment = (this.maxNum - this.minNum) / numParts;
			
			for (var i = 0; i < numParts; i++) {
				this.gradients[i] = this.gradients[i] || new ColorGradient();

				this.gradients[i].setGradient(spectrum[i], spectrum[i + 1]);
				this.gradients[i].setNumberRange(this.minNum + increment * i, this.minNum + increment * (i + 1)); 
			}

			this.gradients.splice(numParts);

			this.colors = spectrum;
			return this;
		}
	}

	Rainbow.prototype.setColorsByArray = function () {
		return this.setColors(arguments);
	}

	Rainbow.prototype.colorAt = function (number)
	{
		if (isNaN(number)) {
			throw new TypeError(number + ' is not a number');
		} else if (this.gradients.length === 1) {
			return this.gradients[0].colorAt(number);
		} else {
			var segment = (this.maxNum - this.minNum)/(this.gradients.length);
			var deltaNum = Math.max(number, this.minNum) - this.minNum
			var index = Math.min(Math.floor(deltaNum / segment), this.gradients.length - 1);
			return this.gradients[index].colorAt(number);
		}
	}

	Rainbow.prototype.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			this.minNum = minNumber;
			this.maxNum = maxNumber;
			this.setColors(this.colors);
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
		return this;
	}

	return Rainbow;
})();

var ColorGradient = (function() {
	ColorGradient.colorNames =
		[['red'   , 'lime'  , 'blue'  , 'yellow', 'orange', 'aqua'  , 'fuchsia', 'white' , 'black' , 'gray'  , 'grey'  , 'silver', 'maroon', 'olive' , 'green' , 'teal'  , 'navy'  , 'purple'],
		 ['ff0000', '00ff00', '0000ff', 'ffff00', 'ff8000', '00ffff', 'ff00ff' , 'ffffff', '000000', '808080', '808080', 'c0c0c0', '800000', '808000', '008000', '008080', '000080', '800080']];

	ColorGradient.hexRegex = /^#?[0-9a-fA-F]{6}$/i;


	function ColorGradient() 
	{
		this.startColor = 'ff0000';
		this.endColor = '0000ff';
		this.minNum = 0;
		this.maxNum = 100;
	}

	ColorGradient.prototype.setGradient = function (colorStart, colorEnd)
	{
		this.startColor = ColorGradient.getHexColor(colorStart);
		this.endColor = ColorGradient.getHexColor(colorEnd);
	}

	ColorGradient.prototype.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			this.minNum = minNumber;
			this.maxNum = maxNumber;
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
	}

	ColorGradient.prototype.colorAt = function (number)
	{
		return this.calcHex(number, this.startColor.substring(0,2), this.endColor.substring(0,2)) 
			+ this.calcHex(number, this.startColor.substring(2,4), this.endColor.substring(2,4)) 
			+ this.calcHex(number, this.startColor.substring(4,6), this.endColor.substring(4,6));
	}
	
	ColorGradient.prototype.calcHex = function (number, channelStart_Base16, channelEnd_Base16)
	{
		if (number < this.minNum) {
			number = this.minNum;
		}
		if (number > this.maxNum) {
			number = this.maxNum;
		} 
		var numRange = this.maxNum - this.minNum;
		var cStart_Base10 = parseInt(channelStart_Base16, 16);
		var cEnd_Base10 = parseInt(channelEnd_Base16, 16); 
		var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
		var c_Base10 = Math.round(cPerUnit * (number - this.minNum) + cStart_Base10);
		return ColorGradient.formatHex(c_Base10.toString(16));
	}

	ColorGradient.formatHex = function (hex) 
	{
		if (hex.length === 1) 
			return '0' + hex;
		else 
			return hex;
	} 
	
	ColorGradient.isHexColor = function (string)
	{
		return ColorGradient.hexRegex.test(string);
	}

	ColorGradient.getHexColor = function (string)
	{
		if (ColorGradient.isHexColor(string)) {
			return string.substring(string.length - 6, string.length);
		} else {
			var cn = ColorGradient.colorNames;
			var pos = cn[0].indexOf(string.toLowerCase());

			if (pos != -1)
				return cn[1][pos];
			else
				throw new Error(string + ' is not a valid color.');
		}
	}

	return ColorGradient;
})();