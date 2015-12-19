# Angular-Dygraph

This repository contains an implementation of a directive that wraps up the canvas javascript charting library [dygraphs](http://www.dygraphs.com).  

This implementation uses a [customized dygraphs js](https://github.com/lo-co/angular-dygraph/blob/master/js/cirrus-dygraphs-dev.js) file that keeps the ``span`` elements on the canvas visible so that we can access them for click events.  This implementation is available in js.  

## Map Forward

* I would like to utilize the plugin system with the original dygraphs implementation, but until I have some direction, I will keep the custom implementation.
* Figure out how to maintain the series properties as accessible even when the series is not visible.
* Add an autoscale feature that can be turned on or off or adjusts bounds 1x.
* Look at pushing the legend to edge of the graph.

## Other Implementations

* [angular-dygraphs by cdjackson](https://github.com/cdjackson/angular-dygraphs) - excellent implementation of an Angular directive wrapping dygraphs that adds functionality including an interactive legend.
* [angular-dygrapghs by robtonic](https://github.com/robotnic/angular-dygraphs)
