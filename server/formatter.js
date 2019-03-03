function formatDate(date) {
    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();
    return (day < 10 ? ('0' + day) : day) + 
            "/" + 
            (month < 10 ? ('0' + month) : month) + 
            "/" + 
            year;
}

module.exports = {
    formatDate: formatDate
}