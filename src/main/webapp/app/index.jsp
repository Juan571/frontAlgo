<!DOCTYPE html>
<!--[if IE 8]>
<html lang="es" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]>
<html lang="es" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="es" ng-app="CollateralApp">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <meta charset="utf-8">
    <title translate="GENERAL.APP.TITLE"></title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <!-- BEGIN GLOBAL MANDATORY STYLES -->

    <!-- bower:css -->
    <link rel="stylesheet" href="assets/vendor/jquery-ui/themes/smoothness/theme.css" />
    <link rel="stylesheet" href="assets/vendor/jquery-ui/themes/smoothness/jquery-ui.min.css" />
    <link rel="stylesheet" href="assets/vendor/bootstrap/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="assets/vendor/bootstrap/dist/css/bootstrap-theme.min.css" />
    <link rel="stylesheet" href="assets/vendor/angular-toastr/dist/angular-toastr.css" />
    <link rel="stylesheet" href="assets/vendor/split-pane/split-pane.css" />
    <link rel="stylesheet" href="assets/vendor/world-flags-sprite/stylesheets/flags32.css" />
    <!-- endbower -->

    <!-- BEGIN DYMANICLY LOADED CSS FILES(all plugin and page related styles must be loaded between GLOBAL and THEME css files ) -->
    <link id="ng_load_plugins_before"/>
    <!-- END DYMANICLY LOADED CSS FILES -->

    <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet"
          type="text/css"/>
    <link href="assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
    <link href="assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css"/>
    <!--<link href="assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />-->
    <link href="assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css"/>
    <!-- END GLOBAL MANDATORY STYLES -->
    <!-- BEGIN PAGE LEVEL PLUGINS -->
    <link href="assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.css" rel="stylesheet"
          type="text/css"/>
    <link href="assets/global/plugins/morris/morris.css" rel="stylesheet" type="text/css"/>
    <link href="assets/global/plugins/fullcalendar/fullcalendar.min.css" rel="stylesheet" type="text/css"/>
    <link href="assets/global/plugins/jqvmap/jqvmap/jqvmap.css" rel="stylesheet" type="text/css"/>
    <!-- END PAGE LEVEL PLUGINS -->
    <!-- BEGIN THEME GLOBAL STYLES -->
    <link href="assets/global/css/components-md.min.css" rel="stylesheet" id="style_components" type="text/css"/>
    <link href="assets/global/css/plugins-md.min.css" rel="stylesheet" type="text/css"/>
    <!-- END THEME GLOBAL STYLES -->
    <!-- BEGIN THEME LAYOUT STYLES -->
    <link href="assets/layouts/layout/css/layout.min.css" rel="stylesheet" type="text/css"/>
    <!--<link href="assets/layouts/layout/css/themes/darkblue.min.css" rel="stylesheet" type="text/css" id="style_color" />-->
    <link href="assets/layouts/layout/css/themes/grey.min.css" rel="stylesheet" type="text/css" id="style_color"/>
    <link href="assets/layouts/layout/css/custom.css" rel="stylesheet" type="text/css"/>
    <link href="assets/layouts/layout/css/custom-responsive.css" rel="stylesheet" type="text/css"/>

    <!-- END THEME LAYOUT STYLES -->
    <link rel="shortcut icon" href="favicon.ico"/>
</head>
<!-- END HEAD -->

<body class="page-header-fixed page-sidebar-closed-hide-logo page-content-white page-md page-on-load"
      ng-controller="AppController">
<!-- BEGIN PAGE SPINNER -->
<div id="mainSpinnerBar" collateral-spinner-bar class="page-spinner-bar">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
</div>
<!-- BEGIN HEADER -->

<div class="page-header navbar navbar-fixed-top">
    <!-- BEGIN HEADER INNER -->
    <div class="page-header-inner ">
        <!-- BEGIN LOGO -->
        <div class="page-logo">
            <a href="#">
                <img src="assets/global/img/logo-common.png" alt="logo" class="logo-default"/> </a>
        </div>
        <!-- END LOGO -->
    </div>
    <!-- END HEADER INNER -->
</div>
<!-- END HEADER -->

<!-- body content -->
<div>
    <!-- VIEW PAGE CONTENT -->
    <div ui-view="main-content" class="fade-in-up ui-view-content"></div>
</div>

<!-- END CONTAINER -->
<!-- BEGIN FOOTER -->
<div class="page-footer">
    <div class="page-footer-inner"> 2016 &copy; Common Management Solutions.
    </div>
    <div class="scroll-to-top">
        <i class="icon-arrow-up"></i>
    </div>
</div>
<!-- END FOOTER -->
<!--[if lt IE 9]>
<script src="assets/global/plugins/respond.min.js"></script>
<script src="assets/global/plugins/excanvas.min.js"></script>
<![endif]-->
<!-- BEGIN CORE PLUGINS -->

<!-- bower:js -->
<script src="assets/vendor/jquery/dist/jquery.js"></script>
<script src="assets/vendor/jquery-ui/jquery-ui.min.js"></script>
<script src="assets/vendor/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="assets/vendor/angular/angular.js"></script>
<script src="assets/vendor/angular-ui-router/release/angular-ui-router.js"></script>
<script src="assets/vendor/angular-bootstrap/ui-bootstrap-tpls.js"></script>
<script src="assets/vendor/angular-scroll/angular-scroll.js"></script>
<script src="assets/vendor/angular-animate/angular-animate.js"></script>
<script src="assets/vendor/angular-aria/angular-aria.js"></script>
<script src="assets/vendor/angular-resource/angular-resource.js"></script>
<script src="assets/vendor/angular-cookies/angular-cookies.js"></script>
<script src="assets/vendor/angular-touch/angular-touch.js"></script>
<script src="assets/vendor/angular-sanitize/angular-sanitize.js"></script>
<script src="assets/vendor/angular-local-storage/dist/angular-local-storage.js"></script>
<script src="assets/vendor/oclazyload/dist/ocLazyLoad.js"></script>
<script src="assets/vendor/sifter/sifter.js"></script>
<script src="assets/vendor/microplugin/src/microplugin.js"></script>
<script src="assets/vendor/angular-toastr/dist/angular-toastr.tpls.js"></script>
<script src="assets/vendor/angular-input-masks/angular-input-masks-standalone.js"></script>
<script src="assets/vendor/angular-websocket/dist/angular-websocket.js"></script>
<script src="assets/vendor/split-pane/split-pane.js"></script>
<script src="assets/vendor/angular-split-pane/angular-split-pane.js"></script>
<script src="assets/vendor/angular-md5/angular-md5.js"></script>
<script src="assets/vendor/ng-file-upload/ng-file-upload.js"></script>
<script src="assets/vendor/ng-file-upload-shim/ng-file-upload-shim.js"></script>
<script src="assets/vendor/clipboard/dist/clipboard.js"></script>
<script src="assets/vendor/ngclipboard/dist/ngclipboard.js"></script>
<script src="assets/vendor/angular-translate/angular-translate.min.js"></script>
<script src="assets/vendor/angular-translate-loader-url/angular-translate-loader-url.js"></script>
<!-- endbower -->

<!--
<script src="assets/global/plugins/jquery.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
-->
<script src="assets/global/plugins/js.cookie.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js"
        type="text/javascript"></script>
<script src="assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
<!-- END CORE PLUGINS -->
<!-- BEGIN PAGE LEVEL PLUGINS -->
<script src="assets/global/plugins/moment.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/bootstrap-daterangepicker/daterangepicker.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/morris/morris.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/morris/raphael-min.js" type="text/javascript"></script>
<script src="assets/global/plugins/counterup/jquery.waypoints.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/counterup/jquery.counterup.min.js" type="text/javascript"></script>

<script src="assets/global/plugins/fullcalendar/fullcalendar.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/horizontal-timeline/horozontal-timeline.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/flot/jquery.flot.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/flot/jquery.flot.resize.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/flot/jquery.flot.categories.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery-easypiechart/jquery.easypiechart.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jquery.sparkline.min.js" type="text/javascript"></script>
<script src="assets/global/plugins/jqvmap/jqvmap/jquery.vmap.js" type="text/javascript"></script>
<script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.russia.js" type="text/javascript"></script>
<script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.world.js" type="text/javascript"></script>
<script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.europe.js" type="text/javascript"></script>
<script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.germany.js" type="text/javascript"></script>
<script src="assets/global/plugins/jqvmap/jqvmap/maps/jquery.vmap.usa.js" type="text/javascript"></script>
<script src="assets/global/plugins/jqvmap/jqvmap/data/jquery.vmap.sampledata.js" type="text/javascript"></script>
<!-- BEGIN Angular ui-ace-->
<script src="assets/global/plugins/ace-builds/src-min-noconflict/ace.js"></script>
<script src="assets/global/plugins/angular-ui-ace/ui-ace.min.js"></script>
<!-- END Angular ui-ace-->

<!-- END PAGE LEVEL PLUGINS -->
<!-- BEGIN THEME GLOBAL SCRIPTS -->
<script src="assets/global/scripts/app.min.js" type="text/javascript"></script>
<!-- END THEME GLOBAL SCRIPTS -->

<!-- BEGIN THEME LAYOUT SCRIPTS -->
<script src="assets/layouts/layout/scripts/layout.js" type="text/javascript"></script>
<script src="assets/layouts/layout/scripts/demo.min.js" type="text/javascript"></script>
<script src="assets/layouts/global/scripts/quick-sidebar.js" type="text/javascript"></script>
<!-- END THEME LAYOUT SCRIPTS -->

<!-- CORE SCRIPTS -->
<script src="collateral-apps/main.js" type="text/javascript"></script>
<script src="collateral-apps/services/ConfigUrlService.js" type="text/javascript"></script>
<script src="collateral-apps/directives/collateralSpinnerBar.js" type="text/javascript"></script>

<!-- UI GRID PLUGIN BEGIN -->
<script src="assets/vendor/pdfmake/build/pdfmake.min.js" type="text/javascript"></script>
<script src="assets/vendor/pdfmake/build/vfs_fonts.js" type="text/javascript"></script>
<script src="assets/vendor/angular-ui-grid/ui-grid.min.js" type="text/javascript"></script>
<link href="assets/vendor/angular-ui-grid/ui-grid.min.css" rel="stylesheet" type="text/css"/>
<!-- UI GRID PLUGIN END -->

<!-- HiGHT CHART -->
<script src="assets/global/plugins/highcharts/js/highcharts.js" type="text/javascript"></script>
<script src="assets/global/plugins/highcharts/js/highcharts-3d.js" type="text/javascript"></script>
<script src="assets/global/plugins/highmaps/js/modules/map.js"></script>
<script src="assets/global/plugins/highmaps/js/custom/world.js"></script>
<script src="assets/global/plugins/highcharts/js/modules/exporting.js" type="text/javascript"></script>
<script src="assets/global/plugins/highcharts/js/modules/offline-exporting.js" type="text/javascript"></script>

<!--Angular Web Socket  -->
<script src="assets/vendor/angular-websocket/dist/angular-websocket.min.js" type="text/javascript"></script>

</body>
<script>
    $(document).ready(function () {
        $("#mainSpinnerBar").hide("400");
    })
</script>
</html>