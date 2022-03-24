/**
 * PjMemberStore Store
 */
Ext.define('Rfx.store.PcsStdStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
        });
    },
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'seller_uid', type: "string" }
     		,{ name: 'machine_uid', type: "string"  }

     	  	  ],
 	sorters: [{
         property: 'unique_id',
         direction: 'ASC'
     }],
         hasNull: false,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/pcsstd.do?method=read',
//	         url: CONTEXT_PATH + '/purchase/request.do?method=getPodetail',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			
			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					
					var blank ={
							systemCode: '',
							codeName: '[]',
							codeNameEn: ''
						};
						
						this.add(blank);
				}//endofif

			},//endofload
			beforeload: function(){
			}
		}//endoflistner
});