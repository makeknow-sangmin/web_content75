Ext.define('Ext.ux.multiupload.UploadManager', {
    extend: 'Ext.util.MixedCollection',
    singleton: true,
    register: function (item) {
    console_log('register:' + item);
        this.add(item);
    },
    unregister: function (item) {
    console_log('unregister:' + item);
    console_info(item);
        this.remove(item);
    },
    getKey: function (o) {
    console_log('getkey:');
        return o.instanceId;
    },
    uploadCallback: function (id, data) {
        var item = this.get(id);
       console_log('uploadCallback:' + item);
        if (item) {
            switch (data.event) {
                case 'fileAdded': item.fireEvent('fileadded', item, data); break;
                case 'fileOpen': item.fireEvent('uploadstart', item, data); break;
                case 'uploadProgress': item.fireEvent('uploadprogress', item, data); break;
                case 'uploadComplete': item.fireEvent('uploadcomplete', item, data); break;
                case 'uploadCompleteData': item.fireEvent('uploaddatacomplete', item, data); break;
                case 'queueUploadComplete': item.fireEvent('queuecomplete', item, data); break;
                case 'queueUploadDataComplete': item.fireEvent('queuedatacomplete', item, data); break;
                case 'uploadError': item.fireEvent('uploaderror', item, data); break;
            }
        }
    }
});
