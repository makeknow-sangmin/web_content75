/**
 * PjtTskDuePlaneStore Store
 */

Ext.define('Mplm.store.PjtTskDuePlaneStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
	fields : [
	     { name: 'task_title_x', type: "string"  }
//	     ,{ name: 'description', type: "string"  }
	     ,{ name: 'reminder', type: "string"  }
	],
	hasNull: false,
	sorters: [{
        property: 'reminder',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/statistics/task.do?method=readPlanChartCombo',
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
			if(this.hasNull) {
				var blank ={
						unique_id: '',
						pj_code: ' ',
						pj_name: ''
				};
				
				this.add(blank);
			
			}

		},
		beforeload: function(){
		}
	}
});