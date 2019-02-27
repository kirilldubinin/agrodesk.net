function dimension(key) {
	var dimensionObj = {
        fat: '%',
        protein: '%',
        dryMaterialConsumption: 'кг',
        estimatedProductivity: 'л',
        actualProductivity: 'л',
        rationPrice: 'руб',
        milkPrice: 'руб/л',
        dryMaterialTMR: '%'
    };

    return dimensionObj[key] || '';
}

module.exports = dimension;