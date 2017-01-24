let tooltipComponent =  require('app/scripts/components/addTooltip.component');

'use strict';

describe('add tooltip component:', () => {

    let element,
        scope,
        message,
        isSuccess = true,
        controller,
        $compile,
        compileComponent,
        mockedTemplatePath = 'some-path/to/template.html';

    beforeEach(() => {

        angular.mock.module('app');
        angular.module('app', []).component('tooltipComponent', tooltipComponent);

        inject(($injector) => {
            let $templateCache = $injector.get('$templateCache'),
                mockedTemplateModel = {
                    someKey: 'someValue',
                };

            $compile = $injector.get('$compile')
            scope = $injector.get('$rootScope').$new();
            scope.mockedTemplateModel = mockedTemplateModel;
            scope.message = message;
            scope.isSuccess = isSuccess;
            scope.messageUpdated = sinon.spy();
            $templateCache.put(mockedTemplatePath, '<div>Template text</div>');
            element = `<tooltip-component template=${mockedTemplatePath} message="message" success="isSuccess" on-update="messageUpdated()"></tooltip-component>`;
            compileComponent = function() {
                element = $compile(element)(scope);
                angular.element(document.body).append(element);
                scope.$digest();
                controller = element.controller('tooltipComponent');
            }
        });
    });

    afterEach(() => {
        angular.element(document.body).empty();
    });

    it('renders the content of the passed template', () => {
        compileComponent();
        expect(element.html()).to.contain('Template text');
    });

    it('sets the passed message onto the directive controller', () => {
        compileComponent();
        expect(controller.message).to.equal(message);
    });

    it('sets the passed is successful flag onto the directive controller', () => {
        compileComponent();
        expect(controller.success).to.equal(isSuccess);
    });

    it('sets the passed on update function onto the directive controller', () => {
        compileComponent();
        expect(typeof controller.onUpdate).to.equal('function');
    });

    it('calls the passed scope on update function after a timeout period when a message is displayed', inject(($timeout) => {
        message = '';
        element = `<tooltip-component template=${mockedTemplatePath} message="message" success="isSuccess" on-update="messageUpdated()"></tooltip-component>`;
        compileComponent();
        message = 'blah';
        $timeout.flush();
        scope.$digest();
        expect(scope.messageUpdated).to.have.been.called;
    }));

});
