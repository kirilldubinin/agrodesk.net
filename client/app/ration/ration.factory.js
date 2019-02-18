angular.module('ration')
.factory('rationFactory', ['$http', '$location', function($http) {

    var host = '';
    var urlBase = host + '/api/';
    var urlBaseRation = urlBase + 'rations/';
    var rationFactory = {};

    // feed
    rationFactory.getRations = function() {
        return $http.get(urlBaseRation);
    };
    rationFactory.getRationDashboard = function() {
        return $http.get(urlBaseRation + 'dashboard');
    };
    rationFactory.saveRation = function(ration) {
        var methode = ration._id ? 'put' : 'post';
        var url = ration._id ? (urlBaseRation + ration._id) : urlBaseRation;
        return $http[methode](url, ration);
    };
    rationFactory.getRationEdit = function (rationId) {
        return $http.get(urlBaseRation + rationId + '/edit');
    };
    rationFactory.getRationView = function(rationId) {
        return $http.get(urlBaseRation + rationId + '/view');
    };
    rationFactory.getEmptyRation = function() {
        return $http.post(urlBaseRation + 'new');
    };

    return rationFactory;
}]);