var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RationSchema = new Schema({
    historyId: {
        type: Schema.Types.ObjectId,
        required: false
    },
    changeAt: {
        type: Date,
        default: Date.now,
        required: true
    },
	createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdBy: {
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            required: true
        }
    },
    general: {
        // number
        number: {
            type: String,
            required: true
        },
        startDate: Date,
        endDate: Date,
        // rationType
        rationType: {
            type: String,
            required: true
        },
        // name
        name: {
            type: String,
            required: true
        },
        // name of cow group
        groupName: {
            type: String
        },
        // nomber of cows
        cowsNumber: {
            type: Number,
            required: true
        },
        // consumption of dry material
        dryMaterialConsumption: {
            type: Number,
            required: true
        },
        // estimated productivity
        estimatedProductivity: {
            type: Number,
            required: true
        },
        // actual productivity
        actualProductivity: {
            type: Number,
            required: true
        },
        dryMaterialTMR: {
            type: Number,
            required: false
        },
        // ratio OK/KK
        ratio: {
            type: String,
            required: true
        },
        fat: {
            type: Number,
            required: false
        },
        protein: {
            type: Number,
            required: false
        },
        // ration price
        rationPrice: {
            type: Number,
            required: true
        },
        // milk price
        milkPrice: {
            type: Number,
            required: true
        },
        // efficiency
        efficiency: {
            type: Number,
            required: true
        }
    },
    composition: [{
        // if from FEED
        _id: {
            type: Schema.Types.ObjectId,
            required: false
        },
        number: String,
        name: String,
        componentType: String, // 'OK,KK,MK'
        price: Number, // for kilo,
        value: Number, // for cow per day kile
        proportion: Number, // for by dry materail
        dryMaterial: Number
    }]
});

var goldObject = {
    general: {
        number: '01',
        startDate: new Date(),
        endDate: Date,
        rationType: 'milk',
        name: '',
        groupName: '',
        cowsNumber: 0,
        dryMaterialConsumption: 0,
        estimatedProductivity: 0,
        actualProductivity: 0,
        dryMaterialTMR: 0,
        ratio: '',
        fat: 0,
        protein: 0,
        rationPrice: 0,
        milkPrice: 0,
        efficiency: 0
    },
    composition: [{
        number: '01',
        name: 'Новый компонент',
        componentType: 'ok',
        price: 1,
        value: 1,
        proportion: 20,
        dryMaterial: 0.5
    }]
};

RationSchema.statics.getEmptyRation = function() {
    return goldObject;
};
RationSchema.statics.sort = function(object, rootProperty) {
    var result = {};
    _.forEach(_.isArray(goldObject[rootProperty]) ? goldObject[rootProperty][0] : goldObject[rootProperty], function(value, key) {
        if ((_.isBoolean(object[key]) || _.isNumber(object[key]) || object[key])) {
            result[key] = object[key];
        }
    });
    return result;
};
RationSchema.pre('validate', function(next) {
    // general properies
    if (!this.general.rationType || 
        !this.general.name) {
        return next(Error('"Тип" и "Имя" рациона обязательны для заполнения.'));
    } 

    // VALIDATION OK
    return next();
});

module.exports = mongoose.model('Ration', RationSchema);