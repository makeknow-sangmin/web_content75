Ext.define('Rfx2.model.company.bioprotech.DeliveryPending', {
 extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            //read: CONTEXT_PATH + '/production/schdule.do?method=readAssyTopWithStock&not_restart=Y&pl_no=---&not_pj_type=R',
            read: CONTEXT_PATH + '/sales/buyer.do?method=read&not_mine=TOP&not_pr_active_flag=N&pr_active_flag=Y&orderBy=wa_name',
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