Ext.define('Rfx2.model.company.hanjung.DeliveryPending', {
 extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/schdule.do?method=readAssyTopWithStock&not_restart=Y&pl_no=---&not_pj_type=R&sum_wthdraw_flag=Y&detail_flag=Y',
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