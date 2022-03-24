console_log('loading moldStore....');
var moldStore = new Ext.create('Ext.data.Store', {
 	fields:[     
  	       { name: 'unique_id', type: "string" }
  	      ,{ name: 'pj_code', type: "string"  } 	     
 	  ],
 	 cmpName: 'pjUid',
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/sales/buyer.do?method=query',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     },
	listeners: {
		beforeload: function(){
			var obj = Ext.getCmp(this.cmpName); 
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

 });