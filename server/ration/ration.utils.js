
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
    'general.actualProductivity': 'required',
    'general.productivityRate': 'required'
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
    'productivityRate': 'milk'
};

var hideOnViewFields = {
    'productivityRate': 'hide'
};

var hideForNonSA = {
    'productivityRate': 'hide'
};

var viewLeftFields = {
    'number': 'left',
    'name': 'left',
    'rationType': 'left',
    'startDate': 'left',
    'endDate': 'left',
    'groupName': 'left',
    'cowsNumber': 'left',
    'rationPrice': 'left',
    'milkPrice': 'left'
};
var viewRightFields = {
    'dryMaterialConsumption': 'right',
    'estimatedProductivity': 'right',
    'actualProductivity': 'right',
    'productivityRate': 'right',
    'dryMaterialTMR': 'right',
    'ratio': 'right',
    'fat': 'right',
    'protein': 'right',
    'efficiency': 'left',
    'productivityRate': 'right'
};

var editLeftFields = {
    'number': 'left',
    'name': 'left',
    'rationType': 'left',
    'cowsNumber': 'left',
    'startDate': 'left',
    'endDate': 'left',
    'groupName': 'left'
};

var editCenterFields = {
    'dryMaterialConsumption': 'right',
    'estimatedProductivity': 'right',
    'actualProductivity': 'right',
    'productivityRate': 'right',
    'dryMaterialTMR': 'right',
    'ratio': 'right',
    'efficiency': 'left'
};

var editRightFields = {
    'productivityRate': 'right',
    'rationPrice': 'left',
    'milkPrice': 'left',
    'fat': 'right',
    'protein': 'right'
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
    milkOnlyFields: milkOnlyFields,
    hideOnViewFields: hideOnViewFields,
    hideForNonSA: hideForNonSA,
    viewLeftFields: viewLeftFields,
    viewRightFields: viewRightFields,
    editLeftFields: editLeftFields,
    editCenterFields: editCenterFields,
    editRightFields: editRightFields
};