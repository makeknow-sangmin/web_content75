Ext.define('Rfx2.model.company.tosimbio.Bomdtl', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/design/bom.do?method=getBomdtlList',
            // create: CONTEXT_PATH + '/design/bom.do?method=setBatchBomdtlListCreate',
            // update: CONTEXT_PATH + '/design/bom.do?method=setBatchBomdtlListUpdate',
	        // destroy: CONTEXT_PATH + '/design/bom.do?method=setBatchBomdtlListDestroy'
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