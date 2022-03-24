Ext.define('Rfx2.model.company.hanjung.Heavy4_MaterialMgmt', {

    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahd&not_sp_code_list=PRD,ASSY&orderBy=item_code', /*1recoed, search by cond, search */
            create: CONTEXT_PATH + '/purchase/material.do?method=create'+ '&vCUR_MENU_CODE=' + vCUR_MENU_CODE, /*create record, update*/
            update: CONTEXT_PATH + '/purchase/material.do?method=update',
            destroy: CONTEXT_PATH + '/purchase/material.do?method=destroy' /*delete*/
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
