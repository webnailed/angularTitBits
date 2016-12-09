import zoomService from 'app/services/zoom.service'
import zoomImageDirective from 'app/directives/zoomImage.directive';

'use strict';

describe('zoom image directive:', () => {

    let compileDirective,
        scope,
        element,
        mockedModernizr,
        mockedWindow,
        mockedZoom;

    testSetup();

    it('should define a function on the scope for toggling transitions', () => {
        compileDirective();
        expect(typeof scope.toggleTransitions).to.equal('function');
    });

    it('should define a function on the scope for toggling image visibility', () => {
        compileDirective();
        expect(typeof scope.toggleImageVisibility).to.equal('function');
    });

    it('should define a function on the scope for handling image image compiled', () => {
        compileDirective();
        expect(typeof scope.handleImageCompiled).to.equal('function');
    });

    it('does NOT make a call to add touch event bindings when image has compiled AND device does NOT support touch events', () => {
        let mockImage = angular.element('<img src=\'blah\'>');

        compileDirective();
        scope.bindTouchEvents = sinon.spy();
        scope.handleImageCompiled(mockImage);
        expect(scope.bindTouchEvents).not.to.have.been.called;
    });

    it('makes a call to add mouse event bindings when image has compiled', () => {
        let mockImage = angular.element('<img src=\'blah\'>');

        compileDirective();
        scope.bindMouseEvents = sinon.spy();
        scope.handleImageCompiled(mockImage);
        expect(scope.bindMouseEvents).to.have.been.calledWith(mockImage);
    });

    it('correctly binds the mouse events to the correct scope function handlers', () => {
        let mockImage,
            onSpy = sinon.spy();

        compileDirective();
        mockImage = angular.element('<img src="blah">');
        mockImage.on = onSpy;
        scope.bindMouseEvents(mockImage);
        expect(onSpy).to.have.been.calledWith('dblclick', scope.handleZoomInOut);
        expect(onSpy).to.have.been.calledWith('mousedown', scope.handleMouseDown);
        expect(onSpy).to.have.been.calledWith('mouseup', scope.handleMouseUp);
        expect(onSpy).to.have.been.calledWith('mouseout', scope.handleMouseOut);
        expect(onSpy).to.have.been.calledWith('mousemove', scope.handleMouseMove);
    });

    it('binds the image elements load event the image loaded scope function', () => {
        let mockImage = angular.element('<img src=\'blah\'>');

        compileDirective();
        mockImage.on = sinon.spy();
        scope.handleImageCompiled(mockImage);
        expect(mockImage.on).to.have.been.calledWith('load', scope.imageLoaded);
    });

    it('binds the image elements load event the image loaded scope function when image has compiled', () => {
        let mockImage = angular.element('<img src=\'blah\'>');

        compileDirective();
        mockImage.on = sinon.spy();
        scope.handleImageCompiled(mockImage);
        expect(mockImage.on).to.have.been.calledWith('load', scope.imageLoaded);
    });

    it('sets the image to non visible while the image is loading after the image has compiled', () => {
        let mockImage = angular.element('<img src=\'blah\'>');

        compileDirective();
        scope.toggleImageVisibility = sinon.spy();
        scope.handleImageCompiled(mockImage);
        expect(scope.toggleImageVisibility).to.have.been.calledWith(false);
    });

    it('should define a function on the scope for handling when the image has finished loading in the DOM', () => {
        compileDirective();
        expect(typeof scope.imageLoaded).to.equal('function');
    });

    it('initialise the image view once the image has loaded', () => {
        compileDirective();
        scope.initialiseView = sinon.spy();
        scope.imageLoaded();
        expect(scope.initialiseView).to.have.been.called;
    });

    it('sets the image visibility to visible once the image has loaded', () => {
        compileDirective();
        scope.toggleImageVisibility = sinon.spy();
        scope.setImageDimensions = sinon.spy();
        scope.imageLoaded();
        expect(scope.toggleImageVisibility).to.have.been.calledWith(true);
    });

    it('should define a function on the scope for binding mouse events', () => {
        compileDirective();
        expect(typeof scope.bindMouseEvents).to.equal('function');
    });

    it('should define a function on the scope for binding touch events', () => {
        compileDirective();
        expect(typeof scope.bindMouseEvents).to.equal('function');
    });

    it('should define a function on the scope for setting the initial image dimensions', () => {
        compileDirective();
        expect(typeof scope.setImageDimensions).to.equal('function');
    });

    it('should define a function on the scope for recalculating the image view after orientation update', () => {
        compileDirective();
        expect(typeof scope.initialiseView).to.equal('function');
    });

    it('should define a function on the scope for finding the target image', () => {
        compileDirective();
        expect(typeof scope.getTargetImage).to.equal('function');
    });

    it('should define a function on the scope for recalculating the image view after orientation update', () => {
        compileDirective();
        expect(typeof scope.initialiseView).to.equal('function');
    });

    it('binds the window orientation change event to the recalculate view scope function', () => {
        compileDirective();
        expect(mockedWindow.addEventListener).to.have.been.calledWith('orientationchange', scope.initialiseView, false);
    });

    it('removes the window orientation change event bindind when scope is destroyed', () => {
        compileDirective();
        scope.$destroy();
        expect(mockedWindow.removeEventListener).to.have.been.calledWith('orientationchange', scope.initialiseView);
    });

    it('defines a function on the scope for zooming in/out from either double click or double tap', () => {
        compileDirective();
        expect(typeof scope.handleZoomInOut).to.equal('function');
    });

    describe('mouse events', () => {
        it('should define a function on the scope for handling mouse down event', () => {
            compileDirective();
            expect(typeof scope.handleMouseDown).to.equal('function');
        });

        it('should define a function on the scope for handling mouse up event', () => {
            compileDirective();
            expect(typeof scope.handleMouseUp).to.equal('function');
        });

        it('should define a function on the scope for handling mouse move event', () => {
            compileDirective();
            expect(typeof scope.handleMouseMove).to.equal('function');
        });
    });

    describe('touch events', () => {
        it('should define a function on the scope for handling touch start event', () => {
            compileDirective();
            expect(typeof scope.handleTouchStart).to.equal('function');
        });

        it('should define a function on the scope for handling pinch pan events', () => {
            compileDirective();
            expect(typeof scope.handlePinchAndPan).to.equal('function');
        });
    });

    function testSetup() {
        mockedModernizr = {
            touch: false,
            csstransitions: true,
            csstransforms3d: true
        };
        mockedWindow = {
            Modernizr: mockedModernizr,
            addEventListener: sinon.spy(),
            removeEventListener: sinon.spy(),
            Hammer: MockedHammer
        };
        mockedZoom = {
            getTransitionProperty: sinon.stub().returns('transition'),
            getTransformProperty: sinon.stub().returns('transform'),
            getTransformOriginProperty: sinon.stub().returns('transform-origin'),
            resetValues: sinon.spy(),
            getCurrentTranslation: sinon.stub().returns({x: 0, y: 0}),
            getCurrentScale: sinon.spy()
        };
        beforeEach(() => {
            angular.mock.module('app');
            angular.mock.module(($provide) => {
                $provide.value('$window', mockedWindow);
                $provide.value('zoom', mockedZoom);
            });
            angular.module('app', []).service('zoom', zoomService)
                                     .directive('zoomImage', zoomImageDirective);

            inject(($injector) => {
                let $compile = $injector.get('$compile');

                scope = $injector.get('$rootScope').$new();
                compileDirective = function(withTouchEvents) {
                    mockedModernizr.touch = !!withTouchEvents;
                    element = `<zoom-image>
                                <img src="some/source.png">
                               </zoom-image>`;
                    element = angular.element($compile(element)(scope));
                    angular.element(document.body).append(element);
                    scope.$digest();
                };
            });
        });
    }

    function MockedHammer() {
        this.get = sinon.stub().returns({set: sinon.spy()});
        this.on = sinon.spy();
        return this;
    }
});
