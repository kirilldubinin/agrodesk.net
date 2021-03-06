var _ = require('lodash');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var RationSchema = new Schema({
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
        productivityRate: {
            type: Number,
            required: true
        },
        // productivity rate
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
    }],
    distribution: {
        mixerSize: Number,
        ratio: [Number] 
    },
    history: [{
        date: Date,
        cowsNumber: {type: Number },
        dryMaterialConsumption: { type: Number },
        estimatedProductivity: { type: Number },
        actualProductivity: { type: Number },
        productivityRate: { type: Number },
        dryMaterialTMR: { type: Number },
        ratio: { type: String },
        fat: { type: Number },
        protein: { type: Number },
        rationPrice: { type: Number },
        milkPrice: { type: Number },
        efficiency: {type: Number },
        general: {
            cowsNumber: {type: Number },
            dryMaterialConsumption: { type: Number },
            estimatedProductivity: { type: Number },
            actualProductivity: { type: Number },
            productivityRate: { type: Number },
            dryMaterialTMR: { type: Number },
            ratio: { type: String },
            fat: { type: Number },
            protein: { type: Number },
            rationPrice: { type: Number },
            milkPrice: { type: Number },
            efficiency: {type: Number }
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
    }]
});

var goldObject = {
    general: {
        number: '01',
        rationType: 'milk',
        name: '',
        startDate: new Date(),
        endDate: null,
        groupName: '',
        cowsNumber: 0,
        dryMaterialConsumption: 0,
        estimatedProductivity: 0,
        actualProductivity: 0,
        productivityRate: 1,
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
    }],
    distribution: {
        mixerSize: 1000,
        ratio: [100] 
    }
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
        !this.general.name ||
        !_.isNumber(this.general.cowsNumber) ||
        !_.isNumber(this.general.dryMaterialConsumption) ||
        !_.isNumber(this.general.productivityRate) ||
        !_.isNumber(this.general.estimatedProductivity) ||
        !_.isNumber(this.general.actualProductivity) ||
        !this.general.ratio ||
        !_.isNumber(this.general.rationPrice) ||
        !_.isNumber(this.general.milkPrice) ||
        !_.isNumber(this.general.efficiency)
    ) {
        return next(Error('Обязательные поля не заполнены !'));
    } 

    // VALIDATION OK
    return next();
});

module.exports = mongoose.model('Ration', RationSchema);