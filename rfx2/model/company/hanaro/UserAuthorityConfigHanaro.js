Ext.define('Rfx2.model.company.hanaro.UserAuthorityConfigHanaro', {
    extend: 'Rfx.model.Base',
      proxy: {
           type: 'ajax',
          api: {
              read: CONTEXT_PATH + '/admnMgmt/auth.do?method=read&module_key=HANARO',
              create: CONTEXT_PATH + '/admnMgmt/auth.do?method=create',
              update: CONTEXT_PATH + '/admnMgmt/auth.do?method=create',
              destroy: CONTEXT_PATH + '/production/mcfix.do?method=destroy'
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
   