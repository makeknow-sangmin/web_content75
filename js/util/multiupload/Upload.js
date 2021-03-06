Ext.define('Ext.ux.multiupload.Upload', {
    extend: 'Ext.flash.Component',
    requires: [
        'Ext.ux.multiupload.UploadManager'
    ],
    alias: 'widget.uploader',
    width: 101,
    height: 22,
    wmode: 'transparent',
    url: CONTEXT_PATH + '/js/util/multiupload/Upload.swf',
    statics: {
        instanceId: 0
    },
    constructor: function (config) {
        config = config || {};
        config.instanceId = Ext.String.format('upload-{0}', ++Ext.ux.multiupload.Upload.instanceId);
        config.flashVars = config.flashVars || {};
        config.flashVars = Ext.apply({
            instanceId: config.instanceId,
            buttonImagePath: CONTEXT_PATH + '/js/util/multiupload/button.png',
            buttonImageHoverPath: CONTEXT_PATH + '/js/util/multiupload/button_hover.png',
            fileFilters: '*|*', //'Images (*.jpg)|*.jpg',
            uploadUrl: '/upload/url',
            maxFileSize: 0,
            maxQueueLength: 100,
            maxQueueSize: 0,
            callback: 'Ext.ux.multiupload.UploadManager.uploadCallback'
        }, config.uploadConfig);

        this.addEvents(
            'fileadded',
            'uploadstart',
            'uploadprogress',
            'uploadcomplete',
            'uploaddatacomplete',
            'queuecomplete',
            'queuedatacomplete',
            'uploaderror'
        );

        this.callParent([config]);
    },
    initComponent: function () {
    console_log('Upload:initComponent');
        Ext.ux.multiupload.UploadManager.register(this);
        this.callParent(arguments);
    },
    onDestroy: function () {
    console_log('Upload:onDestroy');
        Ext.ux.multiupload.UploadManager.unregister(this);
        this.callParent(arguments);
    }
});
