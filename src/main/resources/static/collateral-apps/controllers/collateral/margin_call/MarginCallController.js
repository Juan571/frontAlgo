'use strict';

var DashboardApp = angular.module('DashboardApp');

DashboardApp.filter('statusArrayFilter', function() {
    return function (status) {
        return status;
    };
});
var MarginCallCtrl = DashboardApp.controller('MarginCallController', ['$scope', '$document', '$timeout', '$request',
    '$interval', 'localStorageService', 'uiGridConstants', 'MarginCallService','ArrayService',
    function ($scope, $document, $timeout, $request, $interval, $localStorage,
              uiGridConstants, MarginCallService, ArrayService) {

        $scope.$on('$includeContentLoaded', function () {
        });
        $scope.splitPaneProperties = {};
        $scope.propsPane = {};
        $scope.marginCallWorkspaceTabs = {
            name: 'margin-call-tabs',
            active: true,
            tabList: [{
                head: {
                    icon: 'fa fa-home',
                    text: 'Main'
                },
                templateUrl: paths.views
                + "/collateral/margin_call/main.html",
                active: true
            }]
        };
        $scope.splitPaneProperties = {};
		$scope.setFirstComponent = function (value) {
			$scope.splitPaneProperties.firstComponentSize = value;
		};
		$scope.setLastComponent = function (value) {
			$scope.splitPaneProperties.lastComponentSize = value;
		};
		$scope.$watch("splitPaneProperties.firstComponentSize",function(nv,ov){
		    if(nv==ov){
		        return false;
		    }
		    if($scope.pieChart !==undefined ){
                $(Highcharts.charts,"#marginCall").each(function(i,chart){
                    if(!!chart){
                        var height = chart.renderTo.clientHeight; 
                        var width = chart.renderTo.clientWidth; 
                        chart.setSize(width, height); 		         
                    }
                });
            }
		});
		
		
        $scope.currentMarginCall = {};
        $scope.setCurrentMarginCall = function (MarginCallEntity) {
            $scope.currentMarginCall = MarginCallEntity;
        };
        $scope.viewMarginCall = function (value) {
            var ccp = (value.marginCalls[0].contractType === 'BILATERAL') ? value.contract.counterpartyB.name : value.contract.counterpartyA.name;

            $scope.gridApi.selection.getSelectedRows();
            $scope.setCurrentMarginCall(value);
            $scope.$workspaceTabsMgm
                .addTabByID({
                    head: {
                        icon: 'icon-call-in font-dark font-green-haze',
                        text: 'Margin call ('
                        + ccp
                        + ')',
                    },
                    templateUrl: paths.views
                    + "/collateral/margin_call/margin_call_detail.html",
                    closable: true,
                    autoload: true,
                    parameters: value

                }, 'collateral_management');
        };
        $scope.contractTypeList = [];
        $scope.counterPartyAList = [];
        $scope.counterPartyBList = [];
        $scope.gridMarginCall = {

            paginationPageSizes: [15, 50, 100, 200, 500],
            paginationPageSize: 10,
            enableFiltering: false,
            exporterCsvFilename: 'margin-call-messaging.csv',
            exporterPdfDefaultStyle: {fontSize: 9},
            exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
            exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
            exporterPdfHeader: {text: "Margin Call - messaging", style: 'headerStyle'},
            exporterPdfFooter: function (currentPage, pageCount) {
                return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
            },
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
                docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 450,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),

            data: $scope.gridData,
            columnDefs: [
                {
                    name: 'Principal',
                    field: 'contract.counterpartyA.name',
                    headerCellClass: $scope.highlightFilteredHeader,
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: $scope.counterPartyAList
                    }
                },
                {
                    name: 'Fund/Clearing Broker',
                    field: 'ccpName'

                },
                {
                    name: 'Counter Party',
                    field: "contract.counterpartyB.name",
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: $scope.counterPartyBList
                    }
                },
                {
                    name: 'Contract Type',
                    field: 'contract.contractType'
                    //filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div modal-types></div></div>'

                },
                {
                    name: 'Currency',
                    field: 'contract.baseCurrency',
                    width: 50,
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [{
                            value: 'EUR',
                            label: 'EUR'
                        }, {
                            value: 'USD',
                            label: 'USD'
                        }],
                        condition: function (searchTerm, cellValue) {
                            return cellValue === searchTerm;
                        }
                    }
                },
                {
                    name: 'Status',
                    field: "statusName",
                    cellFilter: 'statusArrayFilter'
                    //filterHeaderTemplate: '<div class="ui-grid-filter-container" ng-repeat="colFilter in col.filters"><div modal-status></div></div>',
                },
                {
                    name: 'VM',
                    field: 'marginCallAmount',
                    width: 120,
                    cellClass:'collateral-money',
                    cellFilter:'number:2'

                },
                { name: 'IM', width: 50, cellClass:'collateral-money' },
                {
                    name: 'Action',
                    cellTemplate: '<div class="text-center"> <button class="btn btn-sm btn-primary uigrid-btn" ng-click="grid.appScope.viewMarginCall(row.entity)" ><i class="fa fa-eye"></i></button> </div>',
                    enableColumnMenu: false,
                    enableSorting: false,
                    enabledFilter: false,
                    width: 65
                }

            ],
            rowHeight: 45,
            enableGridMenu: true,
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.grid.registerRowsProcessor( $scope.statusFilter, 200 );
            }
        };

        $scope.filterMargin = function() {
            $scope.gridApi.grid.refresh();
        };

        $scope.statusFilter = function( renderableRows ){
            var matcher = new RegExp($scope.filterValue);
            if(renderableRows != undefined || renderableRows.length >0 ){
                renderableRows.forEach( function( row ) {
                    var match = false;
                    ['statusName'].forEach(function( field ){
                        //console.log(row.entity[field]);
                        if ( row.entity[field] ){
                            if ( row.entity[field].match(matcher) ){
                                match = true;
                            }
                        }
                    });
                    if ( !match ){
                        row.visible = false;
                    }
                });
            }

            return renderableRows;
        };

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();
        $scope.clear = function () {
            $scope.dt = null;
        };
        $scope.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
        };

        $scope.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
        };

        $scope.toggleMin = function () {

            $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null
                : new Date();
            $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
        };

        $scope.toggleMin();

        $scope.openDatePicker = function () {
            $scope.popup.opened = true;
        };

        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        $scope.formats = [, 'yyyy/MM/dd', 'dd.MM.yyyy',
            'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        $scope.popup = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events = [{
            date: tomorrow,
            status: 'full'
        }, {
            date: afterTomorrow,
            status: 'partially'
        }];

        function disabled(data) {
            var date = data.date, mode = data.mode;
            return mode === 'day'
                && (date.getDay() === 0 || date
                    .getDay() === 6);
        }

        function getDayClass(data) {
            var date = data.date, mode = data.mode;
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,
                    0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date(
                        $scope.events[i].date)
                        .setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }
        }
        ;
        $scope.dateChange = function ($$scope) {
            MarginCallService
                .getByDate(
                    moment($$scope.dt).format(
                        "YYYY-MM-DD")).success(
                function (data) {
                    $scope.onResponse(data);
                });
        }
        $scope.onResponse = function (data) {
            var arr = {};
            arr["contractType"] = {};
            arr["counterpartyB"] = {};
            arr["counterpartyA"] = {};
            let statusArray = [];
            let statusMarginCall = $localStorage.get("MarginCallStatusEnum");

            data.dataResponse.forEach(function (v, k) {
                if (v.contract.hasOwnProperty("clearingMemberLegalEntity")) {// CCPHouseAccount

                    v.contract["counterpartyA"] = {};
                    v.contract["counterpartyA"] = v.contract.clearingMemberLegalEntity;
                    v.contract["counterpartyB"] = {};
                    v.contract["counterpartyB"]["name"] = v.contract.ccpName;
                }
                if (v.contract.hasOwnProperty("client") && v.contract.hasOwnProperty("clearingBroker")) {
                    v.contract["counterpartyA"] = {};
                    v.contract["counterpartyA"] = v.client;
                    v.contract["contractType"] = "CCP Client Clearing";
                    v.contract["ccpName"] = v.contract.ccpName;
                    v.contract["counterpartyB"] = {};
                    v.contract["counterpartyB"]["name"] = v.contract.ccpName;
                }

                if (v.contract["contractType"] !=undefined) {
                    if (v.contract.contractType.toUpperCase() === "BILATERAL") {
                        let
                            bilateralContractType = v.contract.bilateralContractType;
                        v.contract.contractType = v.contract.bilateralContractType;
                    }
                    arr["contractType"][v.marginCalls[0].contractType] = v.marginCalls[0].contractType;

                }
                if (v.contract["counterpartyA"] != undefined) {
                    arr["counterpartyA"][v.contract.counterpartyA.name] = v.contract.counterpartyA;
                }
                if (v.contract["counterpartyB"] != undefined) {
                    arr["counterpartyB"][v.contract.counterpartyB.name] = v.contract.counterpartyB;
                }

                if(v.marginCalls[0].hasOwnProperty("marginCallElementsByLiabilityType")) {
                    statusMarginCall.filter(function (status) {
                        if(status.key == v.marginCalls[0].marginCallElementsByLiabilityType.CSA.status) {
                            statusArray.push(status.name);
                            v.statusName = status.name;
                        }
                    });
                }
            });

            $scope.gridMarginCall.data = data.dataResponse;

            if (Object.keys(arr.contractType).length > 0) {
                Object
                    .keys(arr.contractType)
                    .forEach(
                        function (val, k) {

                            $scope.contractTypeList
                                .push({
                                    value: arr.contractType[val],
                                    label: arr.contractType[val]
                                })
                        });
            }
            if (Object.keys(arr.counterpartyA).length > 0) {
                Object
                    .keys(arr.counterpartyA)
                    .forEach(
                        function (val, k) {
                            $scope.counterPartyAList
                                .push({
                                    value: arr.counterpartyA[val].name,
                                    label: arr.counterpartyA[val].name
                                })
                        });
            }
            if (Object.keys(arr.counterpartyB).length > 0) {
                Object
                    .keys(arr.counterpartyB)
                    .forEach(
                        function (val, k) {
                            $scope.counterPartyBList
                                .push({
                                    value: arr.counterpartyB[val].name,
                                    label: arr.counterpartyB[val].name
                                })
                        });
            }

            $scope.drawPieChart(statusArray);
        };
        MarginCallService.getByDate(moment().format("YYYY-MM-DD"))
            .success(function (data) {
                $scope.onResponse(data);
            });
        
        $scope.refreshStatus = function(){
            $scope.filterValue = "";
            $scope.filterMargin();
        }
        
     
                
        $scope.drawPieChart = function (statusArray) {
            var newStatusArray = ArrayService.ArrayDuplicateCounter(statusArray);

            //console.log(newStatusArray);
            //PieChart Data
            if(newStatusArray.length > 0){
                $scope.pieChart =  new Highcharts.Chart({
                    chart: {
                        renderTo:"gchart_pie_margincall",
                        events: {
                            load: function(event)    {
                                $(Highcharts.charts,"#marginCall").each(function(i,chart){
                                    if(!!chart){
                                        var height = chart.renderTo.clientHeight; 
                                        var width = chart.renderTo.clientWidth; 
                                        chart.setSize(width, height); 		         
                                    }
                                });    
                            }
                        },
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        },
                        plotShadow: true,
                        margin: 0,
                        height: 550,
                        width:800
                    },
                    title: {
                        text: '<span id="titleMargin"> Margin Call Status </span>'
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            depth: 35,
                            showInLegend: true
                        },
                    },
                    legend: {
                        enabled: true,
                        layout: 'horizontal',
                        verticalAlign: 'bottom',
                        y: 15,
                        useHTML: true,
                        labelFormatter: function () {
                            //console.log(this);
                            return '<div style="text-align: left; width:130px;float:left;">' + this.name + '</div><div style="width:40px; float:left;text-align:right;">' + this.y + '</div>';
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: 'Status',
                        data: newStatusArray,
                        point:{
                            events:{
                                click: function (event) {
                                    $scope.filterValue = this.name;
                                    $scope.filterMargin();
                                },
                                load: function (event) {
                                    $scope.adjustGraph(this);
                                }
                            }
                        }
                    }],
                    exporting: { enabled: false }
                },function(){
                  //Callback
                });
            };
            $scope.adjustGraph = function(chart) {
                try {
                    let doAnimation = true;

                    if (typeof (chart === 'undefined' || chart === null) && this instanceof jQuery) { // if no obj chart and the context is set
                        this.find('.chart-container:visible').each(function () { // for only visible charts container in the curent context
                            let $container = $(this); // context container
                            $container.find('div[id^="chart-"]').each(function () { // for only chart
                                let $chart = $(this).highcharts(); // cast from JQuery to highcharts obj
                                $chart.setSize($container.width(), $chart.chartHeight, doAnimation = true); // adjust chart size with animation transition
                            });
                        });
                    } else {
                        chart.setSize($('.chart-container:visible').width(), chart.chartHeight, doAnimation = true); // if chart is set, adjust
                    }
                } catch (err) {
                    // do nothing
                }
            };//adjustGraph fn
        }
    }

]);

MarginCallCtrl
    .controller(
        'modalTypesCtrl',
        [
            '$scope',
            '$compile',
            '$timeout',
            'localStorageService',
            function ($scope, $compile, $timeout, $localStorage) {
                var $elm;
                $scope.listOfTypes = $localStorage
                    .get("BilateralContractType");
                $scope.showModal = function () {
                    $scope.gridOptionsContractType = {
                        data: [],
                        enableColumnMenus: false,
                        onRegisterApi: function (gridApi) {
                            $scope.gridApi = gridApi;
                            if ($scope.colFilter && $scope.colFilter.listTerm) {
                                $timeout(function () {
                                    $scope.colFilter.listTerm.forEach(function (type) {
                                            var entities = $scope.gridOptionsContractType.data.filter(function (row) {
                                                    return row.type === type;
                                                });
                                            if (entities.length > 0) {
                                                $scope.gridApi.selection
                                                    .selectRow(entities[0]);
                                            }
                                        });
                                });
                            }
                        }
                    };
                    $scope.listOfTypes.forEach(function (contractType) {
                        $scope.gridOptionsContractType.data.push({
                            type: contractType.key
                        });
                    });
                    var html = '<div class="modal" ng-style="{display: \'block\'}"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">Filter Contract Type</div><div class="modal-body"><div id="grid1" ui-grid="gridOptionsContractType" ui-grid-selection class="modalGrid"></div></div><div class="modal-footer"><button id="buttonClose" class="btn btn-primary" ng-click="close()">Filter</button></div></div></div></div>';
                    $elm = angular.element(html);
                    angular.element(document.body).prepend($elm);
                    $compile($elm)($scope);
                };
                $scope.close = function () {
                    var contractTypes = $scope.gridApi.selection
                        .getSelectedRows();
                    $scope.colFilter.listTerm = [];

                    contractTypes.forEach(function (val) {
                        $scope.colFilter.listTerm.push(val.type);
                    });

                    $scope.colFilter.term = $scope.colFilter.listTerm
                        .join(', ');
                    $scope.colFilter.condition = new RegExp(
                        $scope.colFilter.listTerm.join('|'));

                    if ($elm) {
                        $elm.remove();
                    }
                };
            }])
    .directive(
        'modalTypes',
        function () {
            return {
                template: '<label></label><button class="btn btn-default" ng-click="showModal()">Filter</button>',
                controller: 'modalTypesCtrl'
            };
        })
    .controller(
        'modalStatusCtrl',
        function ($scope, $compile, $timeout) {
            var $elm;
            $scope.showStatusModal = function () {
                $scope.listOfStatus = ["Awaiting Response",
                    "Awaiting Call", "Completed", "Computed",
                    "Disputed"];
                $scope.gridStatusFilterOptions = {
                    data: [],
                    enableColumnMenus: false,
                    onRegisterApi: function (gridApi) {
                        $scope.gridApi = gridApi;

                        if ($scope.colFilter
                            && $scope.colFilter.listTerm) {
                            $timeout(function () {
                                $scope.colFilter.listTerm
                                    .forEach(function (status) {
                                        var entities = $scope.gridStatusFilterOptions.data
                                            .filter(function (row) {
                                                return row.status === status;
                                            });

                                        if (entities.length > 0) {
                                            $scope.gridApi.selection
                                                .selectRow(entities[0]);
                                        }
                                    });
                            });
                        }

                    }
                };

                $scope.listOfStatus.forEach(function (val) {
                    $scope.gridStatusFilterOptions.data.push({
                        status: val
                    });
                });
                var html = '<div class="modal" ng-style="{display: \'block\'}"><div class="modal-dialog"><div class="modal-content"><div class="modal-header">Filter Status</div><div class="modal-body"><div ng-if="!refresh" id="gridFilter" ui-grid="gridStatusFilterOptions" ui-grid-selection class="modalGrid"></div></div><div class="modal-footer"><button id="buttonClose" class="btn btn-primary" ng-click="close()">Filter</button></div></div></div></div>';
                $elm = angular.element(html);
                angular.element(document.body).prepend($elm);
                $compile($elm)($scope);

            };

            $scope.close = function () {
                var status = $scope.gridApi.selection.getSelectedRows();
                $scope.colFilter.listTerm = [];

                status.forEach(function (val) {
                    $scope.colFilter.listTerm.push(val.status);
                });

                $scope.colFilter.term = $scope.colFilter.listTerm
                    .join(', ');
                $scope.colFilter.condition = new RegExp(
                    $scope.colFilter.listTerm.join('|'));
                if ($elm) {
                    $elm.remove();
                }

            };
        })
    .directive(
        'modalStatus',
        function () {
            return {
                template: '<label>{{colFilter.term}}</label><button class="btn btn-default" ng-click="showStatusModal()">Filter</button>',
                controller: 'modalStatusCtrl'
            };
        });
;
