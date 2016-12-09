'use strict';

Zoom.$inject = ['$window', '$document'];

function Zoom($window, $document) {
    var currentScale = 1,
        currentTranslation = {
            x: 0,
            y: 0
        },
        dragging = {
            lastX: 0,
            lastY: 0
        },
        panningActive = false,
        transitionProperties = ['transition', 'webkitTransition', 'mozTransition', 'msTransition'],
        transformProperties = ['transform', 'webkitTransform', 'msTransform', 'mozTransform'],
        transformOriginProperties = ['transformOrigin', 'webkitTransformOrigin', 'msTransformOrigin', 'moztransformOrigin'];

    return {
        zoomImage: zoomImage,
        panImage: panImage,
        resetValues: resetValues,
        getCurrentTranslation: getCurrentTranslation,
        getCurrentScale: getCurrentScale,
        isPanningActive: isPanningActive,
        setPanningActive: setPanningActive,
        setDragPosition: setDragPosition,
        getDragPosition: getDragPosition,
        getTransitionProperty: getTransitionProperty,
        getTransformProperty: getTransformProperty,
        getTransformOriginProperty: getTransformOriginProperty
    };

    function resetValues(imageEl) {
        var documentEl = $document[0].documentElement,
            imageComputedStyles = $window.getComputedStyle(imageEl[0]),
            leftPos = 0,
            topPos = 0,
            imageWidth = imageComputedStyles.getPropertyValue('width').replace('px', ''),
            imageHeight = imageComputedStyles.getPropertyValue('height').replace('px', '');

        if (documentEl.clientWidth > imageWidth) {
            leftPos = (documentEl.clientWidth - imageWidth)/2;
        }

        if (documentEl.clientHeight > imageHeight) {
            topPos = (documentEl.clientHeight - imageHeight)/2;
        }

        currentScale = 1;
        currentTranslation = {
            x: leftPos,
            y: topPos
        };
    }

    function zoomImage(imageEl, newScale, zoomPos) {
        var imageRec = imageEl[0].getBoundingClientRect(),
            currentWidth = imageRec.width,
            currentHeight = imageRec.height,
            previousScale = angular.copy(currentScale),
            newWidth,
            newHeight,
            sizeRatio,
            canvasWidth = $document[0].documentElement.clientWidth,
            canvasHeight = $document[0].documentElement.clientHeight,
            minPosX,
            minPosY;

        zoomPos = zoomPos || {
                x: canvasWidth/2,
                y: canvasHeight/2
            };
        currentScale = newScale > 1.1 ? newScale : 1;
        sizeRatio = currentScale/previousScale;
        newWidth = currentWidth*sizeRatio;
        newHeight = currentHeight*sizeRatio;
        minPosX = Math.ceil(canvasWidth - newWidth);
        minPosY = Math.ceil(canvasHeight - newHeight);

        if (newWidth > canvasWidth) {
            currentTranslation.x = -((zoomPos.x - currentTranslation.x) * sizeRatio) + zoomPos.x;
            if(currentTranslation.x < minPosX) {
                currentTranslation.x = minPosX;
            }
            currentTranslation.x = currentTranslation.x > 0 ? 0 : currentTranslation.x;
        } else {
            currentTranslation.x = (canvasWidth - newWidth)*0.5;
        }
        if (newHeight > canvasHeight) {
            currentTranslation.y = -((zoomPos.y - currentTranslation.y) * sizeRatio) + zoomPos.y;
            if(currentTranslation.y < minPosY) {
                currentTranslation.y = minPosY;
            }
            currentTranslation.y = currentTranslation.y > 0 ? 0 : currentTranslation.y;
        } else {
            currentTranslation.y = (canvasHeight - newHeight)*0.5;
        }
    }

    function panImage(panDetails, imageEl) {
        var imageRec = imageEl[0].getBoundingClientRect(),
            documentEl = $document[0].documentElement,
            panWidth = panDetails.panWidth,
            panHeight = panDetails.panHeight;

        if (currentScale === 1) {
            return;
        }

        if (imageRec.left + panWidth < 0 && (documentEl.clientWidth - imageRec.left - panWidth) <= imageRec.width) {
            currentTranslation.x += panWidth;
        }

        if (imageRec.top + panHeight < 0 && (documentEl.clientHeight - imageRec.top - panHeight) <= imageRec.height) {
            currentTranslation.y += panHeight;
        }
    }

    function getTransitionProperty() {
        return getSupportedPropertyName(transitionProperties);
    }

    function getTransformProperty() {
        return getSupportedPropertyName(transformProperties);
    }

    function getTransformOriginProperty() {
        return getSupportedPropertyName(transformOriginProperties);
    }

    function getCurrentTranslation() {
        return currentTranslation;
    }

    function getCurrentScale() {
        return currentScale;
    }

    function isPanningActive() {
        return panningActive;
    }

    function setPanningActive(active) {
        panningActive = !!active;
    }

    function setDragPosition(dragObj) {
        dragging = dragObj;
    }

    function getDragPosition() {
        return dragging;
    }

    function getSupportedPropertyName(properties) {
        for (var i = 0; i < properties.length; i++) {
            if (typeof $document[0].body.style[properties[i]] !== 'undefined') {
                return properties[i];
            }
        }
        return null;
    }
}

module.exports = Zoom;
