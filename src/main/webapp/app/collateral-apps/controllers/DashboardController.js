angular.module('CollateralApp').controller('DashboardController', function($rootScope, $scope, $http, $timeout) {

    $scope.$on('$includeContentLoaded', function() {
        App.initAjax();
        $(".go2top").show();
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});