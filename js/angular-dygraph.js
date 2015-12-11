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

                var graphDiv = e.find('div')[1]; //e.children()[0];

                var legDiv = e.find('div')[2];

                scope.options.strokePattern = [1, 1];

                // Second div holds the legend...
                scope.options.labelsDiv = legDiv;
                //scope.options.axisLabelWidth = [0,60];
                scope.options.axisLineColor = 'white';
                var lWidth = 100;

                if (scope.legWidth !== undefined) {
                    lWidth = scope.legWidth;
                }

                var gWidth = 100 - lWidth;

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
                //var labels = scope.ref.getLabels();

                // Find the elements of interest - the dygraph legend elements will be in
                // a span
                //var found = $('#' + attrs.id).find('.dygraph-legend').children();
                var found = $('#' + attrs.id).find('.cirrus-legend').children();

                // Bind a click event to each one...
                for (var i = 0; i < found.length; i++) {

                    // This is what I WANT to use, but if there are multiple plots, these don't attach properly...
                    var sText = '#' + found[i].innerText.trim().split(' ').join('-') + '-leg';

                    // For whatever reason, we can not just use the element...It causes
                    // the event to fire twice?  This works but requires the names to be 
                    // completely different
                    e.on('click', 'div:contains("' + found[i].innerText + '")', function (el) {
                        var text = el.target.innerText;
                        console.log(text);

                        // So, setting the visibility to false causes the legend to 
                        // disapear...  Maybe use 
                        var index = labels.indexOf(text.trim()) - 1;

                        // Set the visibility of the current plot to not visible...
                        scope.ref.setVisibility(index, !scope.ref.visibility()[index]);

                    });
                }

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

                // With the legend in a separate div, this is causing some kind of cycling 
                // I don't understand...  It's like updating some option forces an update
                // on some other option...
                /* scope.$watch('options', function (newOptions) {
                    
                    console.log(newOptions);
                    scope.ref.updateOptions(newOptions);
                }, true);*/

            };
            /*var temp = '<table><tr><td><div style="width:80%;"></div></td><td valign=top> ' +
                '<div class="cirrus-legend" style="width:20%; font-size:1em; padding-top:5px;"></div>' +
                '</td></tr></table>';*/
            var temp = '<div style="width:100%;margin-top:10px;clear:both"><div class="cirrus-graph" style="width:85%;float:left;background-color:lightgrey;border-radius:5px;margin-right:5px;  "></div> ' +
                '<div class="cirrus-legend" style="width:13%; border-radius:5px; padding:5px;background-color:lightgrey;font-size:1em; padding-top:5px;float:left"></div></div>';

            return {
                restrict: 'E',
                scope: {
                    /* requires Angular > 1.3 */
                    options: '=?',
                    data: '=',
                    legWidth: '=?'
                },
                template: temp, //'<div class="c-dygraphs" style="height:300px;}"></div>',
                link: link
            };
        });
})();