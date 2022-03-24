/**
 * User Store
 */
Ext.define('Mplm.store.TestManStore', {
    extend: 'Ext.data.Store',
    fields: [     
             { name: 'unique_id', type: "string" },
     		{ name: 'test_man', type: "string" }
     	  	  ],
 	sorters: [{
         property: 'unique_id',
         direction: 'ASC'
     }],
     cmpName: 'test_man',
         hasNull: false,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=readAssyMapTestCrit',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     },
		listeners: {
			
			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					
					var blank ={
							unique_id: '',
							test_man: ''
						};
						
						this.add(blank);
				}//endofif

			},//endofload
			beforeload: function(){
//				console_log('this:');
//				console_log(this.cmpName);
				var obj = Ext.getCmp(this.cmpName); 
				if(obj!=null) {
					var val = obj.getValue();
					console_log(val);
					if(val!=null) {
						var enValue = Ext.JSON.encode(val);
						console_log(enValue);
						this.getProxy().setExtraParam('queryUtf8', enValue);
					}else {
						this.getProxy().setExtraParam('queryUtf8', '');
					}
				}
			}
		}//endoflistner
});