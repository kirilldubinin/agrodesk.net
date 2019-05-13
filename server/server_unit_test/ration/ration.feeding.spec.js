var expect = require("chai").expect;
var feeding = require('../../ration/ration.feeding');
var Ration = require('../../models/ration');
var _ = require('lodash');

describe('ration.feeding', function() {
    describe('get rations feeding', function () {
        
        it.only('feeding', function () {
            
            var rations = [{
                distributionRation: [60,20, 20],
                mixerSize: 1800,
                general: {
                    cowsNumber: 124,
                    dryMaterialConsumption: 15.6
                },
                "composition": [
                    {
                      "_id": "5c0c324970a69b6ce8400178",
                      "name": "Сенаж смесь трав Тр. 7 (2018)",
                      "price": 0.85,
                      "dryMaterial": 0.29,
                      "value": 14.5,
                      "componentType": "ok",
                      "number": "01",
                      "proportion": 27
                    },
                    {
                      "_id": "5c0c38a670a69b6ce8400181",
                      "name": "Силос кукурузный Тр. 3 (2018)",
                      "price": 1.92,
                      "dryMaterial": 0.33,
                      "value": 8.7,
                      "componentType": "ok",
                      "number": "02",
                      "proportion": 18.5
                    },
                    {
                      "_id": "5c0c373170a69b6ce840017f",
                      "name": "Силос кукурузный Тр. 4 (2017)",
                      "price": 1.92,
                      "value": 4.4,
                      "componentType": "ok",
                      "number": "03",
                      "proportion": 6.7,
                      "dryMaterial": 0.24
                    },
                    {
                      "_id": "5c4848c7d0c83867f815e7f2",
                      "name": "Сенаж суданка Курган 2 (2016)",
                      "price": 0.85,
                      "dryMaterial": 0.44,
                      "value": 2.8,
                      "componentType": "ok",
                      "number": "04",
                      "proportion": 7.9
                    },
                    {
                      "name": "Сено клевер+злаки",
                      "price": 5,
                      "dryMaterial": 0.86,
                      "value": 0.5,
                      "componentType": "ok",
                      "number": "05",
                      "proportion": 2.5
                    },
                    {
                      "name": "Рапсовый жмых 38%",
                      "price": 22,
                      "dryMaterial": 0.901,
                      "value": 1.39,
                      "componentType": "kk",
                      "number": "06",
                      "proportion": 8
                    },
                    {
                      "_id": "5c0c412270a69b6ce840018d",
                      "name": "Плющеная кукуруза Тр. 6 (2018)",
                      "price": 4,
                      "dryMaterial": 0.63,
                      "value": 1.39,
                      "componentType": "kk",
                      "number": "07",
                      "proportion": 5.6
                    },
                    {
                      "name": "Кукуруза (зерно)",
                      "price": 8,
                      "dryMaterial": 0.897,
                      "value": 1.39,
                      "componentType": "kk",
                      "number": "08",
                      "proportion": 8
                    },
                    {
                      "name": "Соевый шрот 49%",
                      "price": 42,
                      "dryMaterial": 0.881,
                      "value": 0.92,
                      "componentType": "kk",
                      "number": "09",
                      "proportion": 5.2
                    },
                    {
                      "name": "Горох (зерно)",
                      "price": 13.5,
                      "dryMaterial": 0.85,
                      "value": 0.92,
                      "componentType": "kk",
                      "number": 10,
                      "proportion": 5
                    },
                    {
                      "name": "Ячмень (зерно)",
                      "price": 5,
                      "dryMaterial": 0.873,
                      "value": 0.46,
                      "componentType": "kk",
                      "number": 11,
                      "proportion": 2.6
                    },
                    {
                      "name": "Тирзана",
                      "price": 170,
                      "dryMaterial": 0.2,
                      "value": 0.16,
                      "componentType": "kk",
                      "number": 12,
                      "proportion": 0.2
                    },
                    {
                      "name": "Сода",
                      "price": 30,
                      "dryMaterial": 0.99,
                      "value": 0.1,
                      "componentType": "mk",
                      "number": 13
                    },
                    {
                      "name": "Премикс Камисан",
                      "price": 115,
                      "dryMaterial": 0.95,
                      "value": 0.2,
                      "componentType": "mk",
                      "number": 14
                    },
                    {
                      "name": "Мел",
                      "price": 4.8,
                      "dryMaterial": 0.98,
                      "value": 0.05,
                      "componentType": "mk",
                      "number": 15
                    },
                    {
                      "name": "Соль",
                      "price": 4.8,
                      "dryMaterial": 0.97,
                      "value": 0.05,
                      "componentType": "mk",
                      "number": 16
                    },
                    {
                      "name": "КД Кристалл Хефе",
                      "price": 170,
                      "dryMaterial": 0.9,
                      "value": 0.05,
                      "componentType": "mk",
                      "number": 17
                    }
                ]
            }]
            
            console.log(feeding(rations));
        });
    });
});