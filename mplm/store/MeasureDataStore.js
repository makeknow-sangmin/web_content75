/**
 * Created by deokjin.song on 2018-07-02.
 */
Ext.define('Mplm.store.MeasureDataStore', {
    extend: 'Ext.data.Store',
    fields: [],
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/xdmMeasure.do?method=readMeasureDataDetail'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});