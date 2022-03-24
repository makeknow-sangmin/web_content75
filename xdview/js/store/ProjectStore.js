/**
 * CMM_CODE Store
 */
Ext.define('Xdview.store.ProjectStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
//        Ext.apply(this, {
//        	parentCode: params.parentCode
//        });

    },
	fields : [ 
	    {
			name : 'CODE',
			type : "string"
		}, {
			name : 'CODE_NAME',
			type : "string"
		}, {
			name : 'SORT_SEQUENCE',
			type : "int"
		}

	],
//	parentCode: '',
	hasNull: true,
	sorters: [{
        property: 'codeOrder',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/xdview/chart.do?method=getProject',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
			
//			console_logs('records', records);
			
			if(this.hasNull) {
				
				var blank ={
					systemCode: '------',
					codeName: '전체',
					codeOrder: -1
				};
				this.add(blank);
			}

		},
		beforeload: function(){
		 	var projectType = Ext.getCmp('projectHistory-projectType').getValue();
		 	var oem = Ext.getCmp('projectHistory-SearchOem').getValue();
		 	var modelname = Ext.getCmp('projectHistory-SearchCarmodel').getValue();
		 
			this.proxy.setExtraParam('oem', oem);
			this.proxy.setExtraParam('modelname', modelname);
			this.proxy.setExtraParam('projectType', projectType);
		}
}
});
