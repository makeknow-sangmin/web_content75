Ext.define('Rfx2.model.company.chmr.NstoCkMgmt', {

    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/inventory/prchStock.do?method=getNstoList&standard_flag=R&orderBy=srcahd.item_code' //&not_sp_code_list=KA,KB,KC,KL
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
