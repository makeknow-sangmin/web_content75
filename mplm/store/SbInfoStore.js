/**
 * Created by deokjin.song on 2018-07-19.
 */
Ext.define('Mplm.store.SbInfoStore', {
    extend: 'Ext.data.Store',
    fields: [],
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/examTest.do?method=readSbInfo'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});