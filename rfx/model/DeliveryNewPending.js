Ext.define('Rfx.model.DeliveryNewPending', {
 extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            // read: CONTEXT_PATH + '/production/schdule.do?method=readAssyTopWithStockVer&not_restart=Y&pl_no=---&not_pj_type=R',
            read: CONTEXT_PATH + '/production/schdule.do?method=readSloastForDeliveryHeavy&not_restart=Y&pl_no=---&not_pj_type=R',
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