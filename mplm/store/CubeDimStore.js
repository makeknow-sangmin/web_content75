/**
 * Created by deokjin.song on 2018-06-11.
 */
Ext.define('Mplm.store.CubeDimStore', {
    extend: 'Ext.data.Store',
    fields: [],
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/xdmInspect.do?method=readCubeDimComp'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});