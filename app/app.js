'use strict';

var angular = require('angular'),
    app = angular.module('titbits', []);

app.component('templateComponent', require('./scripts/components/template.component'))
   .service('zoom', require('./scripts/services/zoom.service'))
   .directive('zoomImage', require('./scripts/directives/zoomImage.directive'));