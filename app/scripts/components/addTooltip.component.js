'use strict';

module.exports = {
    bindings: {
        message: '<',
        success: '<',
        onUpdate: '&',
        clearDuration: '@'

    },
    controller: AddTooltipController,
    templateUrl: ['$attrs', getTemplateUrl]
};

function getTemplateUrl($attrs) {
    return $attrs.template;
}

AddTooltipController.$inject = ['$timeout'];

function AddTooltipController($timeout) {
    this.$onChanges = function (changesObj) {
        if (changesObj.message) {
            $timeout(clearMessage.bind(this), this.clearDuration);
        }
    };

    function clearMessage() {
        this.onUpdate();
    }
}



