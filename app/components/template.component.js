
'use strict';

module.exports = {
    bindings: {
        templateModel: '='
    },
    controller: TemplateController,
    templateUrl: ['$attrs', getTemplateUrl]
};

function getTemplateUrl($attrs) {
    return $attrs.template;
}

function TemplateController() {
    this.templateModel = this.templateModel || {};
    return this;
}


