/**
 * Created by deokjin.song on 2018-07-19.
 */
Ext.define('Mplm.store.ApproveHistoryStore', {
    extend: 'Ext.data.Store',
    fields: [],
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/schdule.do?method=readApproveHistory'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});