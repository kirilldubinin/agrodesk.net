(function() {
    'use strict';
    angular.module('feed').controller('DiffController', DiffController);

    function DiffController($state, feedFactory, authFactory, _) {

    	var vm = this;
        vm._ = _;
    	function updateDiffRows(feedsForDiff) {

    		if (!feedsForDiff.length) {
    			vm.diffRows = [];
                vm.headers = [];
    			return;
    		}

    		feedFactory.diffFeeds(feedsForDiff).then(function (result) {

                vm.dryRawValues = result.dryRawValues;
                vm.headers = result.headers;
                vm.diffRows = result.diffs;
    		});
    	}	

        updateDiffRows(_.filter($state.params.feeds.split(':'), Boolean));

        vm.print = function () {
            authFactory.getSessionData().then(function(data) {

                var diffTitlePrint = document.getElementById('diff-title');
                var diffDashboardPrint = document.getElementById('diff-dashboard');

                var popupWin = window.open('', '_blank');
                popupWin.document.open();
                popupWin.document.write(
                    '<html style="background-color: #fff;">'+
                        '<title>AGRODESK:печать</title>'+
                        '<head>'+
                            '<link rel="stylesheet" type="text/css" href="app.css"/>'+
                            '<link rel="stylesheet" type="text/css" href="libs.css"/>'+
                        '</head>'+
                        '<body onload="setTimeout(function() {window.print(); window.close();}, 500)" class="diff print">' + 
                            '<div class="layout-row print-title"><h2 class="flex">' + data.user.tenantFullName + ' Сравнение кормов</h2><h2>agrodesk.net</h2></div>' +
                            (diffTitlePrint ? diffTitlePrint.outerHTML  : '') + 
                            (diffDashboardPrint ? diffDashboardPrint.outerHTML : '') +
                        '</body>'+
                    '</html>');
                popupWin.document.close();
                //popupWin.onfocus=function(){ popupWin.close();}
            });
        }
    }
})();