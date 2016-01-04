(function () {
    'use strict';
    /**
     * @ngdoc overview
     * @name dygraph
     * @description
     * Main module for the AngularJS dygraphs wrapper.
     */
    angular.module('dygraph', [])
        .directive('dyGraph', function ($window, $sce) {
            /**
             * @ngdoc directive
             * @name dygraph.directive:dyGraph
             * @scope
             * @restrict E
             * @requires $window
             * @requires $sce
             * @param {object=} options A dygraph options object
             * @param {array} data A 2-D array which follows the format defined on dygraphs.com.
             * The first element in each array is always the x-data for that point and the remaining
             * elements are the y values associated with that x-data point.
             * @param {number=} legWidth The width of the div containing the legend element.  The
             * default is 100 px.
             *
             * @description
             * This is the directive which is used to wrap dygraph elements.  The directive
             * provides a legend in a separate ``div`` than the graph itself.  The legend
             * will be placed to the right of the plot.  The graph itself will scale to
             * fill the whole element.  Individual graphs may be turned off and on by clicking
             * the legend element.
             */

            /* Link function used in the DDO returned below...*/
            var link = function (scope, e, attrs) {

                var graphDiv = e.find('div')[1];

                var legDiv = e.find('div')[2];

                scope.options.strokePattern = [1, 1];

                // Second div holds the legend...
                scope.options.labelsDiv = legDiv;

                scope.options.axisLineColor = 'white';

                scope.api = {
                    addGraph: function () {

                        return new Dygraph( // Add with injected options
                            graphDiv,
                            scope.data,
                            scope.options
                        );
                    }
                };

                scope.ref = scope.api.addGraph();

                // Set the cursor to a pointer over the legend to let the user know they can click on it...
                angular.element('.cirrus-legend').css("cursor", "pointer");

                var labels = scope.ref.getLabels();

                // Provide a unique ID
                if (attrs.id === undefined) {
                    var id = "dygraph_" + Math.floor(Math.random() * 16000);
                    e.attr('id', id);
                    attrs.id = id;
                }

                // Add event handler for clicking on the legend element.
                // TODO: This needs to be based on the id rather than the inner text (need way to separate two)
                $('#' + attrs.id).on('click', '.legend-entry', function () {
                    var index = labels.indexOf($(this).text().trim()) - 1;
                    scope.ref.setVisibility(index, !scope.ref.visibility()[index]);
                });

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


                scope.$watch('options.ylabel', function () {
                    scope.ref.updateOptions(scope.options);
                }, true);

            };
            var temp = ['<div style="width:100%;margin-top:10px;clear:both">',
                '<div class="cirrus-graph" style="width:85%;float:left;background-color:transparent;border-radius:5px;margin-right:5px; "></div> ',
                '<div class="cirrus-legend" style="width:13%; border-radius:5px; background-color:transparent;font-size:1em; padding-top:5px;float:left">',
                '</div></div>'];

            temp.join('');

            return {
                restrict: 'E',
                scope: {
                    /* requires Angular > 1.3 */
                    options: '=?',
                    data: '=',
                    legWidth: '=?',
                    ref: '=?'
                },
                template: temp,
                link: link
            };
        });
})();