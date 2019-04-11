(function() {
    'use strict';
    angular.module('field').controller('FieldViewController', FieldViewController);

    function FieldViewController($mdDialog, $stateParams, $state, authFactory, rationFactory, _) {
        var vm = this;
        var fieldId = $stateParams.fieldId;
        
        vm.actions = [
            {key: "print", label: "печать", icon: "local_print_shop", buttonType: "raised"},
            {key: "edit", label: "редактировать", icon: "edit", buttonType: "raised"},
            {key: "delete", label: "удалить", icon: "delete_forever", buttonType: "warn"}
        ];
        
        vm.field = {
            id: 1,
            cadastral: '47:14:1203001:814',
            name: 'Поле #06 (участок 6)',
            analysis: 1,
            square: 40.6,
            address: 'Великово',
            remoteness: 11,
            currentSeed: {
                type: 'травосмесь',
                year: 2018
            }
        };

        vm.fieldItemSections = [{
            key: 'analysis',
            label: 'анализы',
            width: 40,
            controls: {
                acidity: {label: "Кислотность", value: "4.6-5.0", dimension: "рН", key: "acidity"},
                acidityRate: {label: "Степень кислотности", value: "средне-кислые", dimension: "", key: "acidityRate"},
                mobilePhosphorus: {label: "Подвижный фосфор", value: "151 - 25", dimension: "мг/кг", key: "mobilePhosphorus"},
                mobilePotassium: {label: "Подвижный калий", value: "171 - 250", dimension: "мг/кг", key: "mobilePotassium"},
                K2O: {label: "Обеспеченность К2О", value: "высокая", dimension: "мг/кг", key: "K2O"},
                Р2О5: {label: "Обеспеченность Р2О5", value: "высокая", dimension: "мг/кг", key: "Р2О5"},
                organicMatter: {label: "Органическое вещество", value: "", dimension: "", key: "organicMatter"},
                exchangeSodium: {label: "Обменный натрий", value: "", dimension: "", key: "exchangeSodium"},
                exchangeAmmonium: {label: "Обменный аммоний", value: "", dimension: "", key: "exchangeAmmonium"},
                nitrateNitrogen: {label: "Нитратный азот", value: "", dimension: "", key: "nitrateNitrogen"},
                exchangeCalcium: {label: "Обменный кальций", value: "", dimension: "", key: "exchangeCalcium"},
                exchangeMagnesium: {label: "Обменный магний", value: "", dimension: "", key: "exchangeMagnesium"},
                exchangeMagnesium: {label: "Обменный магний", value: "", dimension: "", key: "exchangeMagnesium"},
                wet: {label: "Влажность", value: "", dimension: "%", key: "wet"},
                chlorides: {label: "Хлориды", value: "", dimension: "", key: "chlorides"},
                sulfates: {label: "Сульфаты", value: "", dimension: "", key: "sulfates"},
                cationExchangeCapacity: {label: "Емкость катионного обмена", value: "", dimension: "", key: "cationExchangeCapacity"},
                grading: {label: "Гранулометрический состав", value: "", dimension: "", key: "grading"},
                manganese: {label: "Марганец", value: "", dimension: "", key: "manganese"},
                copper: {label: "Медь", value: "", dimension: "", key: "copper"},
                cobalt: {label: "Кобальт", value: "", dimension: "", key: "cobalt"},
                zinc: {label: "Цинк", value: "", dimension: "", key: "zinc"},
                sulfur: {label: "Сера", value: "", dimension: "", key: "sulfur"},
                boron: {label: "Бор", value: "", dimension: "", key: "boron"}
            }
        }, {
            key: 'general',
            label: 'основные',
            width: 30,
            controls: {
                name: {label: "Имя", value: "Поле #06 (участок 6)", dimension: "", key: "name"},
                cadastral: {label: "Номер", value: "47:14:1203001:814", dimension: "", key: "cadastral"},
                square: {label: "Площадь", value: "40.6", dimension: "ГА", key: "square"},
                remoteness: {label: "Удаленность", value: "11", dimension: "км", key: "remoteness"},
                address: {label: "Адресс", value: "Великово", dimension: "", key: "address"},
                seedType: {label: "Тип", value: "травосмесь", dimension: "", key: "seedType"},
                seedYear: {label: "Год высева", value: "2018", dimension: "", key: "seedYear"},
                seedNorm: {label: "Норма высева", value: "15", dimension: "кг/ГА", key: "seedNorm"},
                composition: {label: "Состав", value: "Люцерна - 50%, Фестулолиум - 20%, Райграс пастбищный - 15%, Овсяница тростниковая - 15%", dimension: "", key: "composition"},
            }

        }, {
            label: 'история'
        }]
    }
})();