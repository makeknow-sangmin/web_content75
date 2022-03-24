Ext.define('Rfx2.model.DeliveryDl', {
 extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            //read: CONTEXT_PATH + '/production/schdule.do?method=readAssyTopWithStock&not_restart=Y&pl_no=---&not_pj_type=R',
            read: CONTEXT_PATH + '/production/schdule.do?method=readRtgAstDl&orderBy=rtgast.reserved_timestamp1 desc',
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