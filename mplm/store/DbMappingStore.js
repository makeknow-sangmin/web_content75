/**
 * Created by deokjin.song on 2018-07-19.
 */
Ext.define('Mplm.store.DbMappingStore', {
    extend: 'Ext.data.Store',
    fields: [],
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/examTest.do?method=readMappingColumn'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});