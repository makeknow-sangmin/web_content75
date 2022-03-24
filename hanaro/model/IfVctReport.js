Ext.define('Hanaro.model.IfVctReport', {
    extend: 'Hanaro.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/interface/interface.do?method=readIFVctReport'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success',
            excelPath: 'excelPath'
        },
        writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
    }
});