import templateComponent from 'app/components/template.component';

'use strict';

describe('templateComponent:', () => {

    let element,
        scope,
        controller,
        $compile,
        compileComponent,
        mockedTemplatePath = 'some-path/to/template.html';

        beforeEach(() => {

        angular.mock.module('app');
        angular.module('app', []).component('templateComponent', templateComponent);

        inject(($injector) => {
            let $templateCache = $injector.get('$templateCache'),
                mockedTemplateModel = {
                    someKey: 'someValue',
                };

            $compile = $injector.get('$compile')
            scope = $injector.get('$rootScope').$new();
            scope.mockedTemplateModel = mockedTemplateModel;
            $templateCache.put(mockedTemplatePath, '<div>Template text</div>');

            compileComponent = function() {
                element = $compile(element)(scope);
                angular.element(document.body).append(element);
                scope.$digest();
                controller = element.controller('templateComponent');
            }
        });
    });


    it('should render the component using the template provided', () => {
        element = `<template-component template-model="mockedTemplateModel" template="${mockedTemplatePath}" ></template-component>`;
        compileComponent(scope, element, controller);
        expect(element.html()).to.contain('Template text');
    });

    it('should add the passed template model onto the component controller', () => {
        element = `<template-component template-model="mockedTemplateModel" template="${mockedTemplatePath}" ></template-component>`;
        compileComponent(scope, element, controller);
        expect(controller.templateModel).to.equal(scope.mockedTemplateModel);
    });

});
