
var dateFields = {
    'general.startDate': 'date',
    'general.endDate': 'date'
};

var requiredFields = {
    'general.number': 'required',
    'general.rationType': 'required',
    'general.name': 'required',
    'general.cowsNumber': 'required',
    'general.dryMaterialConsumption': 'required',
    'general.estimatedProductivity': 'required',
    'general.actualProductivity': 'required'
};

var enumFields = {
    'general.rationType': 'enum',
    'composition.componentType': 'enum'

};

var disabledFields = {
    'general.ratio': 'disabled',
    'general.rationPrice': 'disabled',
    'general.efficiency': 'disabled',
    'general.estimatedProductivity': 'disabled',
    'general.dryMaterialTMR': 'disabled'
};

var historyFields = {
    'cowsNumber': 'history',
    'dryMaterialConsumption': 'history',
    'estimatedProductivity': 'history',
    'actualProductivity': 'history',
    'dryMaterialTMR': 'history',
    'ratio': 'history',
    'fat': 'history',
    'protein': 'history',
    'rationPrice': 'history',
    'milkPrice': 'history',
    'efficiency': 'history'
};

var milkOnlyFields = {
    'estimatedProductivity': 'milk',
    'actualProductivity': 'milk',
    'fat': 'milk',
    'protein': 'milk',
    'milkPrice': 'milk',
    'efficiency': 'milk',
    'estimatedProductivity': 'milk'
};

/*var enumFields = {
    'general.cowsNumber': 'enum',
    'general.dryMaterialConsumption': 'enum',
    'general.estimatedProductivity': 'enum',
    'general.actualProductivity': 'enum',
    'general.price': 'enum',
    'general.efficiency': 'enum',
    'general.ratio': 'enum'
};*/

module.exports = {
    dateFields: dateFields,
    enumFields: enumFields,
    requiredFields: requiredFields,
    disabledFields: disabledFields,
    historyFields: historyFields,
    milkOnlyFields: milkOnlyFields
};