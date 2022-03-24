
Ext.onReady(function () {

	console_info('store ok in /.../multiupload/app.js');
    var upload = Ext.create('Ext.ux.multiupload.Panel', {
        //title: 'File Attachement',
        width: '100%',
        height: 140,
        frame: true,
        store: fileStore,
        uploadConfig: {
            uploadUrl: CONTEXT_PATH + '/uploader.do?method=upload',
            maxFileSize: 4000 * 1024 * 1024,
            maxQueueLength: 100
        },
        renderTo: 'filediv'
    });
    console_info('upload ok in /.../multiupload/app.js');
    upload.on('fileuploadcomplete', function (id) {
    	//images.store.add({  id: id   });
    });
});
