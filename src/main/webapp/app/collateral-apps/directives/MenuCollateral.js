//Build Menu
'use strict';

DashboardApp.directive('menuCollateral', ['$rootScope', function ($rootScope) {
    return {
        restrict: "AE",
        templateUrl: "collateral-apps/tpl/MenuCollateral.html",
        link: function (scope, iElem, iAttrs) {

        }
    }
}]);

DashboardApp.service('MenuService', function () {
    this.MenuTree = {
        active: 1,
        tabList: [
            {
                head: {
                    icon: 'icon-home',
                    text: 'Collateral Management'
                },
                childWorkspace: {
                    active: 1,
                    tabList: [
                        {
                            head: {
                                icon: 'icon-home',
                                text: 'Agreements'
                            },
                            templateUrl: paths.views + '/collateral/agreements/index.html',
                            autoload: true
                        },
                        {
                            head: {
                                icon: 'fa fa-phone',
                                text: 'Margin Call'
                            },
                            childWorkspace : {
                            	tabList:[
                            	         {
                                             head: {
                                                 icon: 'fa fa-home',
                                                 text: 'Main'
                                             },
                                             templateUrl: paths.views + '/collateral/margin_call/main.html',
                                             autoload:true
                                         },
                            	]
                            },
                            autoload:true
                        },
                        {
                            head: {
                                icon: 'fa fa-calculator',
                                text: 'Interest'
                            },
                            childWorkspace : {
                            	tabList:[
                            	         {
                                             head: {
                                                 icon: 'fa fa-home',
                                                 text: 'Main'
                                             },
                                             templateUrl: paths.views + '/collateral/interest/main.html',
                                             autoload : true 
                                         },
                            	]
                            },
                            
                        }
                    ]
                }
            },
            {
                head: {
                    icon: 'fa fa-envelope-o',
                    text: 'User Messages'
                },
                templateUrl: paths.views + '/user_message/messages.html',
                autoload: true
            },
            {
                head: {
                    icon: 'fa fa-cogs',
                    text: 'Configuration'
                },
                childWorkspace: {
                    tabList: [
                        {
                            head: {
                                icon: 'fa fa-bank',
                                text: 'Legal Entity'
                            },
                            childWorkspace: {
                                tabList:[
                                    {
                                        head: {
                                            icon: 'fa fa-search',
                                            text: 'Search Legal Entity'
                                        },
                                        templateUrl: paths.views + '/configuration/LegalEntity/legal_entity.html',
                                        autoload: true
                                    }]
                            }
                        },
                        {
                            head: {
                                icon: 'fa fa-briefcase',
                                text: 'Bilateral Contract'
                            },
                            childWorkspace: {
                                tabList: [
                                    {
                                        head: {
                                            icon: 'fa fa-thumbs-o-up',
                                            text: 'Search Bilateral Agreements'
                                        },
                                        templateUrl: paths.views + '/configuration/BilateralAgreements/bilateral_a_add_search.html',
                                        autoload: true
                                    }
                                ]
                            }
                        },
                        {
                            head: {
                                icon: 'fa fa-lock',
                                text: 'Security'
                            },
                            childWorkspace: {
                                tabList: [
                                    {
                                        head: {
                                            icon: 'fa fa-home',
                                            text: 'Main'
                                        },
                                        templateUrl: paths.views + '/configuration/Security/main.html',
                                        autoload: true
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                head: {
                    icon: 'fa fa-warning',
                    text: 'Risk'
                },
                childWorkspace : {
                    tabList:[
                        {
                            head: {
                                icon: '',
                                text: 'Issuer Risk'
                            },
                            templateUrl: paths.views + '/risk/issuer_risk.html',
                            autoload : true
                        },
                        {
                            head: {
                                icon: '',
                                text: 'Country Risk'
                            },
                            templateUrl: paths.views + '/risk/country_risk.html',
                            autoload : true
                        },
                        {
                            head: {
                                icon: '',
                                text: 'CounterParty Risk'
                            },
                            templateUrl: paths.views + '/risk/counterparty_risk.html',
                            autoload : true
                        },
                        {
                            head: {
                                icon: '',
                                text: 'FX Risk'
                            },
                            templateUrl: paths.views + '/risk/fx_risk.html',
                            autoload : true
                        }
                    ]
                },

            }
        ]
    }
});