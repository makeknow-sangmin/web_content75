/**
 * Created by deokjin.song on 2018-07-19.
 */
Ext.define('Mplm.store.RecevedAddIDStore', {
    extend: 'Ext.data.Store',
    fields: [],
    pageSize:100,
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/schdule.do?method=readAssymapItemDetail'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});