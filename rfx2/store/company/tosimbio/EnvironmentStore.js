Ext.define('Rfx2.store.company.tosimbio.EnvironmentStore', {
    extend: 'Ext.data.ArrayStore',
    
    model: Ext.define('B2bLounge.model.Nation', {
        extend: 'Ext.data.Model',

        fields : [ {
            name : 'machine',
            type : "string"
            }
    
        ],
              
    }),
    
    data: [ 
       ['설비1'],
       ['설비2'],
       ['설비3'],
       ['설비4']
    ]
});
