Ext.define('Rfx2.model.company.bioprotech.FinalInspection', {
    extend: 'Rfx.model.Base',
    // fields: [
    //     {name: 'concat_uid_inspectionNo', calculate: function(datas){return datas.unique_id_long+'-'+datas.v027;}}
    // ],
    idProperty: 'custom_uid',
    // requires: ['Ext.data.identifier.Sequential'],
    
    // ,
    // identifier: function(datas){return datas.unique_id_long+'-'+datas.v027;},
    proxy: {
        type: 'ajax',
        api: {
            read : CONTEXT_PATH + '/xdview/spcMgmt.do?method=readMabufferForFinalInspection',
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
        },
    },
    
});