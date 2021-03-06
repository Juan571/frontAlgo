'use strict';

var DashboardApp = angular.module('DashboardApp');

DashboardApp.controller('MarginCallDetailController', ['$scope','localStorageService', 'uiGridConstants', 
        'MarginCallService','$timeout', 'toastr','CollateralAllocationService',
    function ($scope, localStorage,uiGridConstants, MarginCallService, $timeout,$toastr,CollateralAllocationService) {

        $scope.sendFlag = false;
        $scope.collateralLiabilityType = "CSA";
        $scope.currentMarginCall = $scope.parameters;
        $scope.tab2Active = 2;
        $scope.post = [];
        $scope.receive = [];
        $scope.tabClicked   =function(tab){
        	$scope.loadData();
        	if(tab.id=="mc-csa-allocations"){
        		  $scope.tabs2[0].disabled = true;
        	}
        	else{
        		  $scope.tabs2[0].disabled = false;
        	}
        };
        $scope.Trades = [];
        $scope.pool = [];
        $scope.Inventory = [];
        $scope.threshold = 0;
        $scope.minimumTransferAmount = 0;
        $scope.marginCallType  = "";
        $scope.callAmount      = "" ;
        $scope.reCallAmount    =  "";
        $scope.tolerancePercentage = 0 ; // input manually
        $scope.tolerance =  0; 
        $scope.totalAmountAllocated =  0 ; 
        
        
        $scope.changeTolerance = function(tolerancePercentage){ //calculated
        	tolerancePercentage = tolerancePercentage.replace(/%/,'');
        	tolerancePercentage = parseFloat(tolerancePercentage.replace(/,/,''));
        	$scope.tolerance = tolerancePercentage/100; 	 
        	
        };
//      Dispute data Structure
        $scope.disputeEdit = false ;
        $scope.dispute = {
        		disputeCalculations  : {
        			counterpartyValue : 0,
        			difference 		: 0 ,
        			differencePercentage 		: 0 ,
        			disputeComments : "",
        			agreedMargin : 0,
        			myValue :  0 
        		}
        		
        		
        }; 
        
        $scope.setMarginCallType = function(marginCallType){
        	let marginTypeList = {}; 
        	$scope.marginCallType = localStorage.get("MarginCallType");
        	$scope.marginCallType.forEach(function(v,k){
        		marginTypeList[v.key] =  v.name; 
        	});
        	$scope.marginCallType =  marginTypeList[marginCallType];
        };
        $scope.setCallAmount = function(marginCallType,Amount){
        	if(marginCallType.toUpperCase().indexOf("RECALL")!=-1){
        		 $scope.reCallAmount = Amount;
        	}else{
        		 $scope.callAmount  = Amount;
        	}
        };
        $scope.loadData = function(){
	        MarginCallService.getDetail($scope.currentMarginCall.marginCalls[0].id).then(function (result) {
	            //$scope.marginCallTrade = result.data.dataResponse.marginCall;
	            $scope.Trades = result.data.dataResponse.trades;
	            $scope.ownPricing  = result.data.dataResponse.marginCall.ownPricing;
	            $scope.counterPartyPricing  = result.data.dataResponse.marginCall.counterpartyPricing;
	            
	            $scope.posted 	= result.data.dataResponse.postedCollateral;
	            $scope.received = result.data.dataResponse.receivedCollateral;
	            $scope.Messages = result.data.dataResponse.marginCall.messages;
	            $scope.MarginCallDetail = result.data.dataResponse;
	            $scope.Inventory  =  $scope.posted.concat($scope.received);
	            $scope.pool  =  result.data.dataResponse.poolDisplays;
	            //Collateral Liability 
	            let collateralLiabType = Object.keys($scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType);
	            $scope.collateralLiabilityType = collateralLiabType[0];  
	            
	            
				$scope.setMarginCallType($scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType[ $scope.collateralLiabilityType].marginCallCalculations.marginCallType);
				
				$scope.setCallAmount($scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType[ $scope.collateralLiabilityType].marginCallCalculations.marginCallType,$scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType[ $scope.collateralLiabilityType].marginCallCalculations.marginCallAmount);
	
				$scope.setMarginCallType($scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType[ $scope.collateralLiabilityType].marginCallCalculations.marginCallType);
	            if($scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType[ $scope.collateralLiabilityType].marginCallCalculations.exposurePlusNettedIa > 0 ){
	            	$scope.threshold  = $scope.MarginCallDetail.contract.partyBThreshold;
	            	$scope.minimumTransferAmount = $scope.MarginCallDetail.contract.minimumTransferAmountPartyB; 
	            	
	            }else{
	            	$scope.threshold  = $scope.MarginCallDetail.contract.partyAThreshold;
	            	$scope.minimumTransferAmount = $scope.MarginCallDetail.contract.minimumTransferAmountPartyA; 
	            }
	            
//	        	Disppute Data
	            $scope.tolerance = $scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType[ $scope.collateralLiabilityType].marginCallCalculations.csaDisputesCalculations.tolerance;
	            $scope.myValue = $scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType[ $scope.collateralLiabilityType].marginCallCalculations.csaDisputesCalculations.myValue;
	            $scope.disputeStatus = $scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType[ $scope.collateralLiabilityType].marginCallCalculations.csaDisputesCalculations.disputeStatusEnum;
	            
	            $scope.dispute["contractId"]  = $scope.MarginCallDetail.contract.internalId;
	        	$scope.dispute["marginCallId"]  = $scope.currentMarginCall.marginCalls[0].id;
	        	$scope.dispute["status"]  = $scope.disputeStatus;
	        	$scope.dispute["tolerance"]  = $scope.tolerance ;
	        	
//	        	
	        	
	        	
	            if($scope.MarginCallDetail.marginCall["disputeCalculationsCall"] != undefined && $scope.MarginCallDetail.marginCall["disputeCalculations"].hasOwnProperty("disputeCalculationDetail")){
	            	$scope.disputeDetailResult = $scope.MarginCallDetail.marginCall.disputeCalculations.disputeCalculationDetail;
	        		$scope.Trades.forEach(function(vTrade, kTrade){
	        			Object.keys($scope.disputeDetailResult).forEach(function(v,k){
	        				if(parseInt(v)==vTrade.trade.internalId){
	        					vTrade.npvCounterParty_diff	  = $scope.disputeDetailResult[v].difference;
	        					 vTrade.differencePercent   	=Number(($scope.disputeDetailResult[v].differencePercentage*100).toString().match(/^\d+(?:\.\d{0,2})?/)) ;
	        				}
	        			});
	        		});
	            	
	            }
	            if(Object.keys($scope.ownPricing.tradesPricingsByTradeId).length>0) {
            		$scope.Trades.forEach(function(vTrade, kTrade){
            			vTrade.priceInBaseCurrency 	=   $scope.ownPricing.tradesPricingsByTradeId[vTrade.trade.internalId].priceInBaseCurrency;
            			vTrade.priceInTradeCurrency =   $scope.ownPricing.tradesPricingsByTradeId[vTrade.trade.internalId].priceInTradeCurrency;
            		});
            		
            	}
	            if(Object.keys($scope.counterPartyPricing.tradesPricingsByTradeId).length>0) {
	            	if($scope.MarginCallDetail.marginCall["disputeCalculations"].hasOwnProperty("disputeCalculationDetail")){
		            	$scope.disputeDetailResult = $scope.MarginCallDetail.marginCall.disputeCalculations.disputeCalculationDetail;
//		            	vTrade.npvCounterParty	 = $scope.disputesDetail[v.trade.internalId].counterparty;
		            	$scope.Trades.forEach(function(vTrade, kTrade){
		        			Object.keys($scope.disputeDetailResult).forEach(function(v,k){
		        				if(parseInt(v)==vTrade.trade.internalId){
		        					vTrade.npvCounterParty_diff	  = $scope.disputeDetailResult[v].difference;
		        					 vTrade.differencePercent   	=Number(($scope.disputeDetailResult[v].differencePercentage*100).toString().match(/^\d+(?:\.\d{0,2})?/)) ;
		        				}
		        			});
		        			vTrade.npvCounterParty  = $scope.counterPartyPricing.tradesPricingsByTradeId[vTrade.trade.internalId].priceInBaseCurrency;
		        		});
	            	}
	            }
	            $scope.$watchCollection("dispute.disputeCalculations",function(n,o){
	            	if(_.isEqual(n,o)){
	            		return false; 
	            	}
	            	$scope.disputeEdit = true ;
	            });
	
	        });
        };

        $scope.tabs1 = [
                        {
                            id: 'mc-csa-margin',
                            title: 'CSA Margins',
                            templateUrl: 'collateral-apps/views/collateral/margin_call/mc_csa_margin.html',
                            icon: 'icon-call-in'
                        },
                        {
                            id: 'mc-csa-allocations',
                            title: 'CSA Allocations',
                            templateUrl: 'collateral-apps/views/collateral/margin_call/mc_csa_allocations.html',
                            icon: ''	
                        },
                        {
                            id: 'mc-im-collateral-allocations',
                            title: 'IM Collateral Allocations',
                            templateUrl: 'collateral-apps/views/collateral/margin_call/mc_im_collateral_allocations.html',
                            icon: ''
                        },
                        {
                            id: 'mc-vm-collateral-allocations',
                            title: 'VM Collateral Allocations',
                            templateUrl: 'collateral-apps/views/collateral/margin_call/mc_vm_collateral_allocations.html',
                            icon: ''
                        },
                        {
                            id: 'mc-collateral-substitution',
                            title: 'Collateral Substitution',
                            templateUrl: 'collateral-apps/views/collateral/margin_call/mc_collateral_substitution.html',
                            icon: ''
                        },
                        {
                            id: 'messaging-repository',
                            title: 'Messaging Repository',
                            templateUrl: 'collateral-apps/views/collateral/margin_call/mc_messaging_repository.html',
                            icon: ''
                        }
                    ];
             
        $scope.tabs2 = [
                        {
                            id: 'mc-trades',
                            title: 'Trades (underlyings)',
                            templateUrl: 'collateral-apps/views/collateral/margin_call/mc_trades.html',
                            icon: '',
                            disabled : false
                        },
                        {
                            id: 'mc-collateral-inventory',
                            title: 'Position',
                            templateUrl: 'collateral-apps/views/collateral/margin_call/mc_collateral_inventory.html',
                            icon: ''
                        },
                        {
                            id: 'mc-collateral-pool',
                            title: 'Pool',
                            templateUrl: 'collateral-apps/views/collateral/margin_call/mc_collateral_pool.html',
                            icon: ''
                        }

                    ];
        
        $scope.updateDispute    = function(dispute){
        	dispute.disputeCalculations.tolerance = $scope.tolerance;
        	dispute.disputeCalculations.myValue = $scope.callAmount; 
        	MarginCallService.updateDispute(dispute).success(function(resp){
        		$scope.dispute.disputeCalculations.disputeStatus   = resp.dataResponse.disputeCalculations.disputeStatusEnum;
        		$scope.dispute.disputeCalculations.difference   = resp.dataResponse.disputeCalculations.difference;
        		$scope.dispute.disputeCalculations.tolerance= resp.dataResponse.disputeCalculations.tolerance;
        						$scope.tolerancePercentage =  resp.dataResponse.disputeCalculations.tolerance;
        		$scope.dispute.disputeCalculations.differencePercentage   =  resp.dataResponse.disputeCalculations.differencePercentage;
        		
        		$scope.differencePercentage_text     =   (resp.dataResponse.disputeCalculations.differencePercentage* 100 ).toString().match(/^\d+(?:\.\d{0,2})?/) + " %";
        		$toastr.success("Dispute updated successfully","Update dispute data",{closeButton: true});
        	});
        };
        $scope.keyPressDispute  = function(event,dispute){
            if(event.which==13 && !!!window.event.shiftKey){
        		 $scope.updateDispute(dispute);
            }  
        };
        
        this.sendMargin = function (action) {
            $scope.sendFlag = true;

			MarginCallService.sendIssueMarginCall($scope.MarginCallDetail.marginCall.id, "CSA", action).then(
			    function (result) {
    				if(result != ''){
    					$scope.sendFlag = false;
    
    					$scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType.CSA.status = result.data.dataResponse.marginCallElementsByLiabilityType.status;
    
    					$scope.loadData();
    				}
    				else{
    					console.log("Error. Debe especificarse la acción a ejecutar");
    				}
	    		},
	    	    function (error) {
	    	    	console.error(error);
	    	    	$scope.sendFlag = false;
	    	    });
	    	  if(action==="SendAllocationProposal"){
	    	       $scope.sendAllocationProposal(false)
	    	  }
        };
        
        $scope.saveAllocationProposal  = function(isPartialAllocation){
            $scope.allocations  = $scope.post.concat($scope.receive);
            if($scope.allocations.length==0){
                $toastr.error("There is no collateral posted or received","Allocation data",{closeButton: true});
                return false; 
            }
             //TODO revisar payerParty
            $scope.allocations.forEach(function(v,k){
                v["payerParty"] = "PARTY_A";
            });
             $scope.allocationData = {
                collateralLiabilityType :  $scope.collateralLiabilityType,
                marginCallId : $scope.MarginCallDetail.marginCall.id,
                isPartialAllocation : isPartialAllocation,
                allocations : $scope.allocations
             };
            CollateralAllocationService.saveAllocation($scope.allocationData).success(function(resp){
              $toastr.success("Allocation saved Successfully","Allocation data",{closeButton: true});    
            });
            
        }
        $scope.sendAllocationProposal  = function(sendMessage){
            
            $scope.allocations  = $scope.post.concat($scope.receive);
            if($scope.allocations.length==0){
                $toastr.error("There is no collateral posted or received","Allocation data",{closeButton: true});
                return false; 
            }
            
            //TODO revisar payerParty
            $scope.allocations.forEach(function(v,k){
                v["payerParty"] = "PARTY_A";
            });
             $scope.allocationData = {
              collateralLiabilityType :  $scope.collateralLiabilityType,
              marginCallId : $scope.MarginCallDetail.marginCall.id,
              sendMessage : sendMessage,
              allocations : $scope.allocations
             };
            CollateralAllocationService.sendAllocationProposal($scope.allocationData).success(function(resp){
              $toastr.success("Allocation sent Successfully","Allocation data",{closeButton: true});    
              $scope.MarginCallDetail.marginCall.marginCallElementsByLiabilityType.CSA.status = "Allocation Sent";
            });
            
        }
    }]);


DashboardApp.factory('DataMCDetail', function(){
    var data =
        {
            totalAmountAllocated: 0
        };
    
    return {
        getTotalAA: function () {
            return data.totalAmountAllocated;
        },
        setTotalAA: function (totalAmountAllocated) {
            data.totalAmountAllocated= totalAmountAllocated;
        }
    };
});