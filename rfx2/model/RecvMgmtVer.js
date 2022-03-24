Ext.define('Rfx2.model.RecvMgmtVer', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            //read: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread&menu_code=EPJ2', /*1recoed, search by cond, search */
            read: CONTEXT_PATH + '/production/schdule.do?method=readAssyTopVer&not_restart=Y&sortCond=p.pj_code DESC',
            //			create: CONTEXT_PATH + '/sales/poreceipt.do?method=create', /*create record, update*/
            /*   create: CONTEXT_PATH + '/production/schdule.do?method=create',
             update: CONTEXT_PATH + '/purchase/material.do?method=edit',
             destroy: CONTEXT_PATH + '/purchase/material.do?method=destroy' delete*/
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