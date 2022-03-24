Ext.define('Rfx2.model.company.bioprotech.PcsTplLevel1', {
    extend: 'Rfx.model.Base',
       proxy: {
               type: 'ajax',
               api: {
                read: CONTEXT_PATH + '/production/pcstpl.do?method=read&pcs_level=1', /*1recoed, search by cond, search */
                   create: CONTEXT_PATH + '/design/bom.do?method=createNew', 
                   update: CONTEXT_PATH + '/design/bom.do?method=createNew',
                   destroy: CONTEXT_PATH + '/design/bom.do?method=destroy'
               },
               reader: {
                   type: 'json',
                   root: 'datas',
                   totalProperty: 'count',
                   successProperty: 'success',
                   excelPath: 'excelPath'
               },
               writer: {
                   type: "json",
                   encode: true,
                   writeAllFields: true,
                   rootProperty: "datas"
               }
           }
   
   });