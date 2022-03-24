/**
 * ProjectStore Store
 */
Ext.define('Mplm.store.RecvPoSubStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[     
	        { name: 'id', type: "int" },
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'h_reserved43', type: "string"  }

	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'pj_name',
	        direction: 'ASC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=readAssyEditMap', /*1recoed, search by cond, search */
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
				this.add({
					label: '<button style="width:100%">필드값 없음</button>',
					value: '-',
					order: -3
				});
				this.add({
					label: '<button style="width:100%">모두 지우기</button>',
					value: null,
					order: -2
				});
				this.add({
					label: '<button style="width:100%">모두 선택</button>',
					value: '*',
					order: -1
				});
				this.add({
					label: '',
					value: '<NULL>',
					order: -4
				});
				
		},
		beforeload: function(){
			
		}
           }
});