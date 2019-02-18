function dimension(key) {
	var dimensionObj = {
        fat: '%',
        dryMaterialConsumption: 'кг',
        estimatedProductivity: 'л',
        actualProductivity: 'л',
        rationPrice: 'руб',
        milkPrice: 'руб/л'
    };

    return dimensionObj[key] || '';
}

module.exports = dimension;