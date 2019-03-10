var _ = require('lodash');
var langObj = {
    general: 'Парметры',
    number: 'Номер',
    rationType: 'Тип',
    milkPrice: 'Цена молока',
    componentType: 'Тип компонента',
    name: 'Имя',
    fat: 'Жир',
    protein: 'Белок',
    groupName: 'Имя группы',
    cowsNumber: 'Количество коров',
    dryMaterialConsumption: 'Потребление СВ',
    estimatedProductivity: 'Расчетная продуктивность',
    actualProductivity: 'Фактическая продуктивность',
    dryMaterialTMR: 'СВ в TMR',
    rationPrice: 'Цена рациона',
    efficiency: 'Коэффициент эффективности',
    ratio: 'Соотношение ОК/КК',
    startDate: 'Дата начала кормления',
    endDate: 'Дата окончания кормления',
    proportion: 'Доля',
    milk: 'дойный',
    dry: 'сухостой',
    productivityRate: 'Коэфициент продуктивности',

    edit: 'редактировать',
    delete: 'удалить',
    print: 'печать',
    copy: 'копировать',

    chartsRation: 'Аналитика',
    addRation: 'Добавить'
};
function lang(key) {

    if (_.isBoolean(key)) {
        return key ? 'Да' : 'Нет';
    }

    return langObj[key] || key;
}

module.exports = lang;