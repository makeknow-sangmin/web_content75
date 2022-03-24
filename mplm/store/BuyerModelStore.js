/**
 * BuyerModelStrore Store
 */
Ext.define('Mplm.store.BuyerModelStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('BuyerModelStrore');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
        });

    },
    extraParams : {
    	class_name: '',
    	combst_uid: '-1'
    },
    boardType: '',
	fields:[     
	 	     { name: 'model_name', type: "string"  },
	 	    { name: 'unique_id_long', type: "int"  }
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'model_name',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/buyerModel.do?method=read',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			select: function (combo, record) {	
			//console_log('Mplm.store.BuyerStore select');
			var selected = this.getValue();
           	//console_log('selected: ' + selected);
			//console_log('vCUR_MENU_CODE: ' + vCUR_MENU_CODE);
			//console_log('buyerStore selected : ' + record[0].get('wa_code'));
			switch(vCUR_MENU_CODE) {
			case 'SRO1' :
				{
					var oDescription = getSearchObject('description');
					console_log(oDescription);
					oDescription.clearValue();
					oDescription.store.removeAll();
				}
				break;
			
			}
		}//endofselect
		,
			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
							combst_uid: '-1',
							class_name: '',
							model_name: ''
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(){

				var srchIdBuyer = getSearchField('order_com_unique');
				var srchIdPjType = getSearchField('pj_type');
				var oBuyer = Ext.getCmp(srchIdBuyer); 
				var oClassName = Ext.getCmp(srchIdPjType); 
				console_log(oBuyer);
				console_log(oClassName);
				
				if(oBuyer!=null) {
					console_log(oBuyer.getValue());
					this.getProxy().setExtraParam('combst_uid', oBuyer.getValue());
				}
			
				if(oClassName!=null) {
					this.getProxy().setExtraParam('class_name', oClassName.getValue());
				}

			}
		}
});