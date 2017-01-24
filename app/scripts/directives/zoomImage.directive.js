'use strict';

ZoomImage.$inject = ['$window', '$document', 'zoom'];

function ZoomImage($window, $document, zoom) {

    return {
        restrict: 'AE',
        link: linkFn
    };

    function linkFn(scope, element) {
        let targetImage,
            currentScale,
            currentDeltaX,
            currentDeltaY,
            transitionProperty = zoom.getTransitionProperty(),
            transformProperty = zoom.getTransformProperty(),
            transformOriginProperty = zoom.getTransformOriginProperty(),
            loadingEl = angular.element('<div class="l"><div class="loader__spinner"></div></div>'),
            destroyImageLoadWatch;

        scope.zoomed = false;
        scope.$on('$destroy', destroyHandler);
        scope.toggleTransitions = toggleTransitions;
        scope.toggleImageVisibility = toggleImageVisibility;
        scope.handleImageCompiled = handleImageCompiled;
        scope.getTargetImage = getTargetImage;
        scope.initialiseView = initialiseView;
        scope.bindMouseEvents = bindMouseEvents;
        scope.bindTouchEvents = bindTouchEvents;
        scope.imageLoaded = imageLoaded;
        scope.setImageDimensions = setImageDimensions;
        scope.handleZoomInOut = handleZoomInOut;
        scope.handleMouseDown = handleMouseDown;
        scope.handleMouseUp = handleMouseUp;
        scope.handleMouseOut = handleMouseOut;
        scope.handleMouseMove = handleMouseMove;
        scope.handleTouchStart = handleTouchStart;
        scope.handlePinchAndPan = handlePinchAndPan;

        destroyImageLoadWatch = scope.$watch(getTargetImage, scope.handleImageCompiled);
        $window.addEventListener('orientationchange', scope.initialiseView, false);
        element.append(loadingEl);

        function getTargetImage() {
            return element.find('img');
        }

        function handleImageCompiled(newVal = []) {
            if (!newVal.length) {
                return;
            }
            targetImage = newVal;
            targetImage.on('load', scope.imageLoaded);
            scope.bindMouseEvents(targetImage);
            if ($window.Modernizr.touch) {
                scope.bindTouchEvents(targetImage);
            }
            scope.toggleImageVisibility(false);
            destroyImageLoadWatch();
        }

        function bindMouseEvents(image) {
            image.on('dblclick', scope.handleZoomInOut);
            image.on('mousedown', scope.handleMouseDown);
            image.on('mouseup', scope.handleMouseUp);
            image.on('mouseout', scope.handleMouseOut);
            image.on('mousemove', scope.handleMouseMove);
        }

        function bindTouchEvents(image) {
            let hammertime = new $window.Hammer(image[0]);

            hammertime.get('pan').set({ direction: $window.Hammer.DIRECTION_ALL });
            hammertime.get('pinch').set({ enable: true });
            hammertime.on('pinch panstart panend panmove doubletap', scope.handlePinchAndPan);
            image.on('touchstart', scope.handleTouchStart);
        }

        function handlePinchAndPan(ev) {
            if (ev.additionalEvent === 'pinchin' || ev.additionalEvent === 'pinchout') {
                zoom.zoomImage(targetImage, Math.max(1, Math.min(currentScale*ev.scale, 4)));
                applyTransform(zoom.getCurrentTranslation(), zoom.getCurrentScale());
                if (zoom.getCurrentScale() > 1) {
                    scope.zoomed = true;
                    scope.$apply(scope.zoomed);
                }
            }
            if (ev.type === 'panstart') {
                scope.toggleTransitions(false);
                currentDeltaX = 0;
                currentDeltaY = 0;
            }
            if (ev.type === 'panmove') {
                zoom.panImage({
                    panWidth: ev.deltaX - currentDeltaX,
                    panHeight: ev.deltaY - currentDeltaY
                }, targetImage);
                scope.$apply(applyTransform(zoom.getCurrentTranslation(), zoom.getCurrentScale()));
                currentDeltaX = ev.deltaX;
                currentDeltaY = ev.deltaY;
            }

            if (ev.type === 'doubletap') {
                let eventArgs = {
                    clientX: ev.center.x,
                    clientY: ev.center.y
                };
                scope.handleZoomInOut(eventArgs);
            }
        }

        function toggleImageVisibility(isVisible) {
            targetImage.css('visibility', isVisible ? 'visible' : 'hidden');
        }

        function imageLoaded() {
            loadingEl.remove();
            scope.initialiseView(targetImage);
            scope.toggleImageVisibility(true);
        }

        function toggleTransitions(onOff = false) {
            if ($window.Modernizr.csstransitions) {
                targetImage.css(transitionProperty, `${transformProperty} ${(onOff ? '1' : '0')}'s ease-out`);
            }
        }

        function applyTransform(translation, scale) {
            if ($window.Modernizr.csstransforms3d) {
                targetImage.css(transformOriginProperty,'0 0 0');
                targetImage.css(transformProperty, `translate3d(${translation.x}px, ${translation.y}px, 0) scale3d(${scale}, ${scale}, 1)`);
            } else {
                targetImage.css(transformOriginProperty,'0 0');
                targetImage.css(transformProperty, `translate(${translation.x}px, ${translation.y}px) scale(${scale}, ${scale})`);
            }
        }

        function setImageDimensions() {
            let imageEl = targetImage[0],
                documentEl = $document[0].documentElement;

            if (documentEl.clientHeight < imageEl.height) {
                imageEl.style.height = documentEl.clientHeight + 'px';
                imageEl.style.width = 'auto';
            } else {
                imageEl.style.width = documentEl.clientWidth + 'px';
                imageEl.style.height = 'auto';
            }
        }

        function handleZoomInOut(e) {
            scope.toggleTransitions(true);
            if (zoom.getCurrentScale() === 1) {
                scope.zoomed = true;
                scope.$apply(scope.zoomed);
                zoom.zoomImage(targetImage, 4, {x: e.clientX, y: e.clientY});
                targetImage.addClass('zoomed');
            } else {
                scope.zoomed = false;
                scope.$apply(scope.zoomed);
                zoom.resetValues(targetImage);
                targetImage.removeClass('zoomed');
            }
            applyTransform(zoom.getCurrentTranslation(), zoom.getCurrentScale());
        }

        function handleMouseDown(e) {
            e.preventDefault();
            scope.toggleTransitions(false);
            zoom.setDragPosition({
                lastX: e.clientX,
                lastY: e.clientY
            });
            zoom.setPanningActive(true);
        }

        function handleMouseUp(e) {
            e.preventDefault();
            zoom.setDragPosition({
                lastX: 0,
                lastY: 0
            });
            zoom.setPanningActive(false);
        }

        function handleMouseOut(e) {
            e.preventDefault();
            zoom.setPanningActive(false);
        }

        function handleTouchStart() {
            currentScale = zoom.getCurrentScale();
        }

        function handleMouseMove(e) {
            let clientX = e.clientX,
                clientY = e.clientY,
                mouseDragPos;

            e.preventDefault();
            if (zoom.isPanningActive()) {
                mouseDragPos = zoom.getDragPosition();
                zoom.panImage({
                    panWidth: clientX - mouseDragPos.lastX,
                    panHeight: clientY - mouseDragPos.lastY
                }, targetImage);
                zoom.setDragPosition({
                    lastX: clientX,
                    lastY: clientY
                });
                applyTransform(zoom.getCurrentTranslation(), zoom.getCurrentScale());
            }
        }

        function initialiseView() {
            scope.zoomed = false;
            scope.setImageDimensions();
            zoom.resetValues(targetImage);
            applyTransform(zoom.getCurrentTranslation(), zoom.getCurrentScale());
        }


        function destroyHandler () {
            $window.removeEventListener('orientationchange', scope.initialiseView);
        }
    }
}

module.exports = ZoomImage;