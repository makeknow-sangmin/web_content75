Ext.define('Rfx.util.MessageBox', {
    // Support dontHide configuration property for Button
    override: 'Ext.MessageBox',
    onClick: function (button) {
        if (button) {
            var config = button.config.userConfig || {},
            initialConfig = button.getInitialConfig(),
            prompt = this.getPrompt();

            if (typeof config.fn == 'function') {
                this.on({
                    hiddenchange: function () {
                        config.fn.call(
                        config.scope || null,
                        initialConfig.itemId || initialConfig.text,
                        prompt ? prompt.getValue() : null,
                        config
                    );
                    },
                    single: true,
                    scope: this
                });
            }

            if (config.input) {
                config.input.dom.blur();
            }
        }

        if (!initialConfig.dontHide) {
            this.hide();
        }
    }

});