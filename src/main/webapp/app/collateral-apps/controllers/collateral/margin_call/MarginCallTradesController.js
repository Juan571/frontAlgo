'use strict';

var DashboardApp = angular.module('DashboardApp');


DashboardApp.controller('MarginCallTradesController', ['$scope', 'uiGridConstants', 'MarginCallService',
    function ($scope, uiGridConstants, MarginCallService) {

        $scope.gridTradesOptions = {
            showGridFooter: true,
            paginationPageSizes: [15, 50, 100, 200, 500],
            paginationPageSize: 5,
            enableColumnResizing: true,
            enableFiltering: true,
            rowHeight: 35, // set height to each row
            enableGridMenu: true,
            exporterCsvFilename: 'margin-call-trades.csv',
            exporterPdfDefaultStyle: {fontSize: 9},
            exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
            exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
            exporterPdfHeader: {text: "Margin Call - Trades", style: 'headerStyle'},
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
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
            }
        };
        $scope.gridTradesOptions.columnDefs = [
            {field: 'trade.internalId', name:'TradeId', width: 90,
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 0
                }
            },
            {field: 'trade.tradeType', name: 'type'},
            {field: 'trade.tradeSubType', name:'subType'},
            {field: 'trade.description', name:'Description' },
            {field: 'trade.notional',  name:'Notional', cellFilter: 'number:0', cellClass:'collateral-money'  },
            {field: 'trade.currency', name:'Currency',
                filter : {
                    type : uiGridConstants.filter.SELECT,
                    selectOptions : [ {
                        value : 'EUR',
                        label : 'EUR'
                    }, {
                        value : 'USD',
                        label : 'USD'
                    } ],
                    condition : function(
                        searchTerm, cellValue) {
                        return cellValue === searchTerm;
                    }
                }
            },
            {field: 'ownPricing.price', name:'Npv (Curr)', cellFilter: 'currency:""', cellClass:'collateral-money' },
            {field: 'ownPricing.priceInBaseCurrency', displayName:'Npv ('+ $scope.currentMarginCall.contract.baseCurrency +')',
                cellFilter: 'currency:""', cellClass:'collateral-money'},
            {field: 'ownPricing.Counterparty', name:'npv (Counterparty)', cellFilter: 'currency:""', cellClass:'collateral-money'},
            {field: 'npvCounterParty', name:'Diff (%Npv)'}

        ];

        $scope.$watchCollection('$parent.Trades', function (newTrades, oldTrades) {
            if (newTrades === oldTrades) {
                return false;
            }
            $scope.gridTradesOptions.data = newTrades;

            $scope.baseCurrency = $scope.MarginCallDetail.contract.baseCurrency
        });

    }]);
