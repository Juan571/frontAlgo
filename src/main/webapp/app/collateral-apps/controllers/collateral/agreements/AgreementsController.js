'use strict'
DashboardApp.controller('AgreementsController',
    ['$scope', '$request', '$interval','uiGridConstants', function ($scope, $request, $interval,uiGridConstants) {
    
    	$scope.$on('$includeContentLoaded', function () {
    		 	
         });
    	$scope.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
            if( col.filters[0].term ){
                return 'header-filtered';
            } else {
                return '';
            }
        };
        $scope.contractTypeList =[];
        $scope.counterPartyAList =[];
        $scope.counterPartyBList =[];
        
        $scope.gridOptions = {

            enableFiltering: true,
            onRegisterApi: function(gridApi){
                $scope.gridApi = gridApi;
            },
            columnDefs: [
                {
                    name : 'Principal',
                    field: 'counterpartyA.name',
                    headerCellClass: $scope.highlightFilteredHeader,
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: $scope.counterPartyAList
                       
                    },
                },
                {
                    name : 'Counter Party',
                    field: 'counterpartyB.name',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: $scope.counterPartyBList
                      
                    },
                },

                {

                    name : 'Contract Type',
                    field: 'contractType',
                    filter: {
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: $scope.contractTypeList,
                        condition: function(searchTerm, cellValue) {
                            return cellValue === searchTerm;
                        }
                    }
                },
                {
                    name : 'Rating',
                    field: 'counterpartyB.riskProfile.SPRating',
                    enableFiltering: false
                },
//                {
//
//                    name : 'Margin Call Frequency',
//                    field: 'marginFrequency',
//                    enableFiltering:false
//
//                },
//                {
//                    field : "exposure",
//                    name: 'Exposure (EUR)',
//                    headerCellClass: $scope.highlightFilteredHeader,
//                    filter: {
//                        term: '1',	
//                        type: uiGridConstants.filter.SELECT,
//                        selectOptions: [
//                            { value: '1', label: 'EUR' },
//                            { value: '2', label: 'USD' }
//
//                        ]
//                    }
//                },

                {
                	 name: 'Actions',
                     cellTemplate: paths.views + '/collateral/agreements/agr_action_buttons.html',
                     enableColumnMenu: false,
                     width: 160,
                     enableFiltering:false,
                     enableSorting  : false
                },
                {
                   name : 'Exposure / Collateral',
                    enableFiltering: false,
                }  ,
                
            ],
            rowHeight: 45, 
            enableGridMenu: true,
            exporterCsvFilename: 'Collateral_contract_agreemens.csv',
            exporterPdfDefaultStyle: {fontSize: 9},
            exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
            exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
            exporterPdfHeader: {text: "Collateral Agreements", style: 'headerStyle'},
            exporterPdfFooter: function (currentPage, pageCount) {
            	return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
            },
            exporterPdfCustomFormatter: function (docDefinition) {
            	docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
            	docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
            	return docDefinition;
            },
            exporterPdfOrientation: 'landscape',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            onRegisterApi: function (gridApi) {
            	$scope.gridApi = gridApi;
            	// call resize every 500 ms for 5 s after modal finishes opening
            	$interval( function() {
            		$scope.gridApi.core.handleWindowResize();
            	}, 1000, 10);
            }
        };
        $request.get('/servlet/CollateralContractServ/SelectAll')
            .success(function(data) {
            	console.log(data.dataResponse)
                $scope.gridOptions.data = data.dataResponse;
                var arr = {}; 
                arr["contractType"] = {}; 
                arr["counterpartyB"] = {};
                arr["counterpartyA"] = {};
                data.dataResponse.forEach(function(v,k){
                	if(v.hasOwnProperty("contractType")){
                			arr["contractType"][v.contractType] = v.contractType;
                	}
                	if(v.hasOwnProperty("counterpartyA")){
                		arr["counterpartyA"][v.counterpartyA.otherName]= v.counterpartyA; 
                	}
                	if(v.hasOwnProperty("counterpartyB")){
                		arr["counterpartyB"][v.counterpartyB.otherName] = v.counterpartyB; 
                	}
                	
                });
                if(Object.keys(arr.contractType).length>0){
                	Object.keys(arr.contractType).forEach(function(val,k){
                		
                		$scope.contractTypeList.push({value:arr.contractType[val] , label: arr.contractType[val] })
                	});
            	}
                if(Object.keys(arr.counterpartyA).length>0){
                	Object.keys(arr.counterpartyA).forEach(function(val,k){
                		console.log(k);
                		$scope.counterPartyAList.push({value:arr.counterpartyA[val].name , label : arr.counterpartyA[val].name })
                	});
            	}
                if(Object.keys(arr.counterpartyB).length>0){
                	Object.keys(arr.counterpartyB).forEach(function(val,k){
                		$scope.counterPartyBList.push({value:arr.counterpartyB[val].name , label : arr.counterpartyB[val].name })
                	});
            	}
            });
        $scope.toggleFiltering = function(){
            $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
            $scope.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
        };




    }]);


