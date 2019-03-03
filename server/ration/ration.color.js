function color(key) {
	var colorObj = {
        actualProductivity: '#90d9fd'
    };

    return colorObj[key] || undefined;
}

module.exports = color;