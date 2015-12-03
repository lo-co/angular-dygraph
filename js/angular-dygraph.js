(function () {
    'use strict';
    angular.module('dygraph', [])
        .directive('dyGraph', function ($window, $sce) {

            /* Link function used in the DDO returned below...*/
            var link = function (scope, e, attrs) {
                
                var graphDiv = e.children()[0];


                scope.options.strokePattern = [1, 1];
                scope.api = {
                    addGraph: function () {

                        var g = {};

                        if (scope.options !== null) {

                            g = new Dygraph( // Add with injected options
                                graphDiv,
                                scope.data,
                                scope.options
                            );

                        } else { // Add with default options

                            g = new Dygraph(
                                graphDiv,
                                scope.data
                            );
                        }
                        return g;
                    }
                };

                scope.ref = scope.api.addGraph();

                scope.ref.resetZoom();

                // Set the cursor to a pointer over the legend to let the user know they can click on it...
                angular.element('.dygraph-legend').css("cursor", "pointer");
                angular.element('.dygraph-legend').css("width", "80%");

                var labels = scope.ref.getLabels();

                // Provide a unique ID
                if (attrs.id === undefined) {
                    var id = "dygraph_" + Math.floor(Math.random() * 16000);
                    e.attr('id', id);
                    attrs.id = id;

                }
                var labels = scope.ref.getLabels();

                // Find the elements of interest - the dygraph legend elements will be in
                // a span
                var found = $('#' + attrs.id).find('.dygraph-legend').children();

                // Bind a click event to each one...
                for (var i = 0; i < found.length; i++) {

                    // This is what I WANT to use, but if there are multiple plots, these don't attach properly...
                    var sText = '#' + found[i].innerText.trim().split(' ').join('-') + '-leg';

                    // For whatever reason, we can not just use the element...It causes
                    // the event to fire twice?  This works but requires the names to be 
                    // completely different
                    e.on('click', 'span:contains("' + found[i].innerText + '")' /*sText*/ , function (el) {
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
                
                scope.$watch('options', function(newOptions){
                    scope.ref.updateOptions(newOptions);
                }, true);

            };

            return {
                restrict: 'E',
                scope: {
                    /* requires Angular > 1.3 */
                    options: '=?',
                    data: '=',
                    legend: '=?'
                },
                template: '<div class="c-dygraphs" style="height:300px;}"></div>',
                link: link
            };
        });
})();