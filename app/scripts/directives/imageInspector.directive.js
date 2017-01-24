
ImageInspector.$inject = ['$compile', '$templateCache', '$document', '$window'];

function ImageInspector($compile, $templateCache, $document, $window) {

    return {
        restrict: 'AE',
        bindToController: true,
        controller: ImageInspectorController,
        link: linkFn,
    };

    function linkFn(scope, element, attrs) {
        var compiledLink,
            compiledViewer;

        scope.openLinkText = attrs.openLinkText || 'Inspect image';
        scope.zoomImage = attrs.zoomImage || '';
        scope.imageTitle = attrs.imageTitle || '';
        scope.touchEnabled = !!$window.Modernizr.touch;
        scope.open = open;
        scope.close = close;
        appendOpenLink();

        function appendOpenLink() {
            compiledLink = $compile($templateCache.get('imageViewer/activation.html'))(scope);
            element.append(angular.element(compiledLink));
        }

        function open() {
            compiledViewer = angular.element($compile($templateCache.get('imageViewer/imageViewer.html'))(scope));

            compiledViewer.on('click', (e) => {
                e.stopPropagation();
            });
            angular.element($document[0].body).append(compiledViewer);
        }

        function close(e) {
            e.stopPropagation();
            compiledViewer.remove();
        }
    }

    class ImageInspectorController {

    }
}

module.exports = ImageInspector;


