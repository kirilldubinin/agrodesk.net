(function() {
    'use strict';
    angular.module('ration').controller('RationController', RationController);

    function RationController($scope, $window, $state, rationFactory, feedFactory, $mdDialog) {
        var vm = this;
        function getRationsList() {
            rationFactory.getRations().then(function(result) {
                vm.rationItems = result.rations;
            });
        }

        vm.onRationClick = function(rationItem) {
            vm.selectedItemId = rationItem._id;
            $state.go('tenant.ration.instance', { 'rationId': rationItem._id });
        };

        // actions
        vm.addRation = function() {
            $state.go('tenant.ration.new');
        };

        vm.onAddFeed = function (feedItem) {
            $scope.$broadcast('ADD_FEED_TO_RATION', feedItem);
        };

        vm.toggleChart = function (ration) {
            ration.showChart = !ration.showChart;
            if (!ration.chartRender && _.size(ration.series)) {
                setTimeout(function () {
                    ration.chartRender = true;
                    Highcharts.chart('container-' + ration._id, {
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
                            categories: ration.categories
                        },
                        yAxis: {
                            title: false,
                            /*plotBands: [{
                                from: 34,
                                to: 35,
                                color: 'rgba(68, 170, 213, 0.1)',
                                label: {
                                    text: 'Расчетная продуктивность',
                                    style: {
                                        color: '#606060'
                                    }
                                }
                            }]*/
                        },
                        series: ration.series
                    });
                }, 100);
            }
        }

        $scope.$on('$stateChangeSuccess', function (event, newState, params, oldState) {
            vm.editMode = (newState.name === 'tenant.ration.new' || 
                            newState.name === 'tenant.ration.edit');

            // update list
            if (!vm.editMode && newState.data.module === 'ration') {
                getRationsList();
            }

            if (vm.editMode) {
                feedFactory.getFeedsForRation().then(function(result) {
                    vm.feedItems = result.feeds;
                });
            } 
            // get dashboard
            else if (newState.name === 'tenant.ration') {
                rationFactory.getRationDashboard().then(function (dashboard) {
                    vm.dashboard = dashboard;
                    vm.history = dashboard.history;
                    
                    setTimeout(function () {
                        Highcharts.chart('all-rations', {
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
                                title: false,
                                /*plotBands: [{
                                    from: 34,
                                    to: 35,
                                    color: 'rgba(68, 170, 213, 0.1)',
                                    label: {
                                        text: 'Расчетная продуктивность',
                                        style: {
                                            color: '#606060'
                                        }
                                    }
                                }]*/
                            },
                            series: vm.history.series
                        });
                    }, 100);
                });
            }
        });
    }
})();