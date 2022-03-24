Ext.define('Rfx2.model.company.bioprotech.DeliveryPendingDo', {
 extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/schdule.do?method=readRtgAstDo&not_restart=Y&pl_no=---&not_pj_type=R&not_rtgast_type=DC&orderBy=rtgast.recv_date ASC',
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