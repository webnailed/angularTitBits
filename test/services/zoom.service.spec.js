let zoomService = require('app/scripts/services/zoom.service');

'use strict';

describe('zoom & pan service:', () => {

    let mockedZoomService = null;

    testSetup();

    it('should define a function for zooming a given image', function () {
        expect(typeof mockedZoomService.zoomImage).to.equal('function');
    });

    it('should define a function for panning a given image', function () {
        expect(typeof mockedZoomService.panImage).to.equal('function');
    });

    it('should define a function for resetting zooming/panning details for a given image', function () {
        expect(typeof mockedZoomService.resetValues).to.equal('function');
    });

    it('defines a function for getting a given images current translation properties', function () {
        expect(typeof mockedZoomService.getCurrentTranslation).to.equal('function');
    });

    it('should define a function for getting a given images current scale property', function () {
        expect(typeof mockedZoomService.getCurrentScale).to.equal('function');
    });

    it('should define a function for indicating whether a given image currently panning', function () {
        expect(typeof mockedZoomService.isPanningActive).to.equal('function');
    });

    it('should define a function for setting whether a given image is currently panning or not', function () {
        expect(typeof mockedZoomService.setPanningActive).to.equal('function');
    });

    it('should define a function for setting the current drag position of a given image', function () {
        expect(typeof mockedZoomService.setDragPosition).to.equal('function');
    });

    it('should define a function for getting the current drag position of a given image', function () {
        expect(typeof mockedZoomService.getDragPosition).to.equal('function');
    });

    it('should define a function for getting the correctly prefixed css transition property for a given image', function () {
        expect(typeof mockedZoomService.getTransitionProperty).to.equal('function');
    });

    it('should define a function for getting the correctly prefixed css transition property for a given image', function () {
        expect(typeof mockedZoomService.getTransitionProperty).to.equal('function');
    });

    it('should define a function for getting the correctly prefixed css transform property for a given image', function () {
        expect(typeof mockedZoomService.getTransformProperty).to.equal('function');
    });

    it('shopuld define a function for getting the correctly prefixed css transform origin property for a given image', function () {
        expect(typeof mockedZoomService.getTransformOriginProperty).to.equal('function');
    });


    function testSetup() {
        beforeEach(() => {

            angular.mock.module('app');
            angular.module('app', []).service('zoom', zoomService);

            inject(($injector) => {
                mockedZoomService = $injector.get('zoom');
            });
        });
    }

});
