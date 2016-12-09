'use strict';

var angular = require('angular'),
    app = angular.module('titbits', []);

app.component('templateComponent', require('./components/template.component'))
   .service('zoom', require('./services/zoom.service'))
   .directive('zoomImage', require('./directives/zoomImage.directive'));