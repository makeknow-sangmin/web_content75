Ext.define('Ext.ux.multiupload.UploadManager', {
    extend: 'Ext.util.MixedCollection',
    singleton: true,
    register: function (item) {
        console_log('register:');
        console_info(item);
        this.add(item);
    },
    unregister: function (item) {
    console_log('unregister:');
    console_info(item);
        this.remove(item);
    },
    getKey: function (o) {
    console_log('getkey:');
    console_log(o);
        return o.instanceId;
    },
    uploadCallback: function (id, data) {
    	console_log('uploadCallback:');
        var item = this.get(id);
       console_log(id);
       console_log(data);
       console_log(item);
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
