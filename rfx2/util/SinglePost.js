//writer define
Ext.define('Rfx2.util.SinglePost', {
    extend: 'Ext.data.writer.Writer',
    alternateClassName: 'Ext.data.SinglePostWriter',
    alias: 'writer.singlepost',

    writeRecords: function(request, data) {
    	console_logs('request', request);
    	console_logs('data', data);
    	//data[0].cmdType = 'update';
        //request.params = data[0];
        return request;
    }
});