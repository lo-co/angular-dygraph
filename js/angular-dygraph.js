(function () {
    'use strict';
    angular.module('dygraph', [])
        .directive('dyGraph', function ($window, $sce) {

            /* Link function used in the DDO returned below...*/
            var link = function (scope, e, attrs) {

                scope.height = "300px";
                // This is where the content is...
                var mainDiv = e.children()[0];
                var chartDiv = $(mainDiv).children()[0];
                var legendDiv = $(mainDiv).children()[1];
                var parent = e.parent();

                scope.LegendEnabled = true;


                scope.api = {
                    addGraph: function () {

                        var g = {};

                        if (scope.options !== null) {

                            g = new Dygraph( // Add with injected options
                                chartDiv,
                                scope.data,
                                scope.options
                            );

                        } else { // Add with default options

                            g = new Dygraph(
                                chartDiv,
                                scope.data
                            );
                        }
                        return g;
                    }
                };

                scope.ref = scope.api.addGraph();
                resize();
                scope.ref.resetZoom();
                


                /* reference to the graph - initialize the graph
                 * If object equality (last value in the $watch expression)
                 * is not true, the functionwill not work properly...
                 */
                scope.$watch('data', function () {
                    if (scope.data !== 0) {
                        // Only update if there data
                        scope.ref.updateOptions({
                            'file': scope.data
                        });
                    }
                }, true);

                scope.legendSeries = {};

                scope.$watch('legend', function () {
                    var colors = scope.ref.getColors();
                    var labels = scope.ref.getLabels();
                    if (scope.legend !== undefined && scope.legend.series !== undefined) {
                        var cnt = 0;

                        for (var key in scope.legend.series) {
                            scope.legendSeries[key] = {};
                            scope.legendSeries[key].color = colors[cnt];
                            scope.legendSeries[key].label = scope.legend.series[key].label;
                            scope.legendSeries[key].format = scope.legend.series[key].format;
                            scope.legendSeries[key].visible = true;
                            scope.legendSeries[key].column = cnt;

                        }
                    }
                }, true);

                angular.element($window).bind('resize', function () {
                    resize();
                });

                function resize() {
                    /* var maxWidth = 0;

                    var sDiv = e.find('div.series');
                    e.find('div.series').each(function () {
                        var itemWidth = $(this).width();
                        maxWidth = Math.max(maxWidth, itemWidth);

                    });

                    e.find('div.series').each(function () {
                        $(this).width(maxWidth);
                    });

                    var legendHeight = e.find('div.legend').outerHeight(true);
                    scope.ref.resize(parent.width(), parent.height() - legendHeight);
                    console.log("Height: ", parent.height());
                    
*/
                    var chartArea = {};
                    var maxWidth = 0;
                    e.find('div.series').each(function () {
                        var itemWidth = $(this).width();
                        maxWidth = Math.max(maxWidth, itemWidth)
                    });
                    e.find('div.series').each(function () {
                        $(this).width(maxWidth);
                    });

                    var legendHeight = e.find('div.legend').outerHeight(true);
                    console.log("Heights", legendHeight, parent.height(), parent.outerHeight(true),
                        $(mainDiv).outerHeight(), e.height(), $(legendDiv).height(),
                        $(legendDiv).outerHeight(true));
                    scope.ref.resize(parent.width(), parent.height() - legendHeight);
                    console.log(parent);
                    chartArea = $(chartDiv).offset();
                    chartArea.bottom = chartArea.top + parent.height() - legendHeight;
                    chartArea.right = chartArea.left + parent.width();
                    console.log("Position", chartArea);
                }

                scope.seriesStyle = function (series) {
                    if (series.visible) {
                        return series.color;
                    }
                };

                scope.seriesLine = function (series) {
                    return $sce.trustAsHtml('<svg height="14" width="20"><line <x1="0" x2="16" y1="8" y2="8" stroke="' +
                        series.color + '"stroke-width="3"/></svg>');
                };

                scope.selectSeries = function (series) {
                    series.visible = !series.visible;
                    scope.ref.setVisibility(series.column, series.visible);
                };
            };

            return {
                restrict: 'E',
                scope: {
                    /* requires Angular > 1.3 */
                    options: '=?',
                    data: '=',
                    legend: '=?'
                },
                templateUrl: '../html/dygraph-template.html',
                link: link
            };
        });
})();