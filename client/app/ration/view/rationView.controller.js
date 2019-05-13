(function() {
    'use strict';
    //RationViewController.$inject = ['$mdDialog', '$stateParams', '$state', 'authFactory', 'rationFactory', '_']
    angular.module('ration').controller('RationViewController', RationViewController);

    function RationViewController($mdDialog, $stateParams, $state, authFactory, rationFactory, _) {
        var vm = this;
        var rationId = $stateParams.rationId;
        if (!rationId) {
            return;
        }

        authFactory.getSessionData().then(function(data) {
            vm.sessionData = data;
            rationFactory.getRationView(rationId).then(function(rationView) {
                vm.general = rationView.general;
                vm.composition = rationView.composition;
                vm.distribution = rationView.distribution;
                vm.history = rationView.history;
                vm.actions = rationView.actions;

                Highcharts.chart('chart-container', {
                    legend: {
                        itemStyle: {
                            fontWeight: '400'
                        }
                    },
                    chart: { type: 'spline' },
                    title: false,
                    plotOptions: {
                        spline: {
                            lineWidth: 4,
                            marker: { enabled: false }
                        }
                    },
                    xAxis: {
                        categories: vm.history.categories
                    },
                    yAxis: {
                        title: false
                    },
                    series: vm.history.series
                });
            });
        });

        vm.delete = function(ev) {
            var confirm = $mdDialog.confirm()
                .title('Удаление')
                .textContent('Вы хотите удалить рацион "' + vm.general.controls.name.value + '" ?')
                .targetEvent(ev).ok('Да').cancel('Отменить');
            $mdDialog.show(confirm).then(function() {
                rationFactory.deleteRation(rationId).then(function(res) {
                    $state.go('tenant.ration');
                });
            }, function() {});
        };

        vm.edit = function() {
            $state.go('tenant.ration.edit', {
                'rationId': rationId
            });
        };

        vm.copy = function() {
            rationFactory.copyRation(rationId).then(function(response) {
                if (response.message === 'OK') {
                    $state.go('tenant.ration.instance', {
                        'rationId': response.id
                    });
                }
            });
            
        };
        vm.print = function() {
            authFactory.getSessionData().then(function(data) {

                var generalPrint = document.getElementById('general');
                var compositionPrint = document.getElementById('composition');

                var popupWin = window.open('', '_blank');
                popupWin.document.open();
                popupWin.document.write(
                    '<html style="background-color: #fff;">'+
                        '<title>AGRODESK:печать</title>'+
                        '<head>'+
                            '<link rel="stylesheet" type="text/css" href="app.css"/>'+
                            '<link rel="stylesheet" type="text/css" href="libs.css"/>'+
                            '<style type="text/css" media="print">@page { size: landscape; }</style>' +
                        '</head>'+
                        '<body onload="setTimeout(function() {window.print(); window.close();}, 500)" class="ration-view print">' + 
                            '<div class="layout-row ration-title"><h2 class="flex">' + data.user.tenantFullName + ' Рационы</h2><h2>agrodesk.net</h2></div>' +
                            '<div class="layout-row"><h2 class="flex">' + vm.general.controls.name.value + '</h2></div>' +
                            '<div class="layout-row">' + 
                                '<div class="flex-35">' + (generalPrint ? generalPrint.innerHTML  : '') + '</div>' +
                                '<div class="flex">' + (compositionPrint ? compositionPrint.outerHTML : '') + '</div>' +
                            '</div>' +
                        '</body>'+
                    '</html>');
                popupWin.document.close();
                //popupWin.onfocus=function(){ popupWin.close();}
            });
        };
    }
})();