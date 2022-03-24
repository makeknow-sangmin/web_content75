/**
 * DocuMap Store
 */
Ext.define('Mplm.store.DocuStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
			hasNull: params.hasNull,
			target_uid: params.target_uid,
			menu_code : params.menu_code
        });

    },
    fields: [     
			 { name: 'unique_id', type: "string" },
			 { name: 'v000', type : 'string'},
			 { name: 'v001', type : 'string'},
			 { name: 'v002', type : 'string'},
			  { name: 'v003', type : 'string'},
				{ name: 'v004', type : 'string'},
				{ name: 'v005', type : 'string'},
				{ name: 'v006', type : 'string'},
				{ name: 'v007', type : 'string'},
				{ name: 'v008', type : 'string'},
				{ name: 'v009', type : 'string'},
				{ name: 'v010', type : 'string'},
				{ name: 'v011', type : 'string'},
				{ name: 'v012', type : 'string'},
				{ name: 'v013', type : 'string'},
				{ name: 'v014', type : 'string'},
				{ name: 'v015', type : 'string'},
				{ name: 'v016', type : 'string'},
				{ name: 'v017', type : 'string'},
				{ name: 'v018', type : 'string'},
				{ name: 'v019', type : 'string'},
				{ name: 'v020', type : 'string'},
				{ name: 'v021', type : 'string'},
				{ name: 'v022', type : 'string'},
				{ name: 'v023', type : 'string'},
				{ name: 'v024', type : 'string'},
				{ name: 'v025', type : 'string'},
				{ name: 'v026', type : 'string'},
				{ name: 'v027', type : 'string'},
				{ name: 'v028', type : 'string'},
				{ name: 'v029', type : 'string'},
				{ name: 'v030', type : 'string'},
				{ name: 'v031', type : 'string'},
				{ name: 'v032', type : 'string'},
				{ name: 'v033', type : 'string'},
				{ name: 'v034', type : 'string'},
				{ name: 'v035', type : 'string'},
				{ name: 'v036', type : 'string'},
				{ name: 'v037', type : 'string'},
				{ name: 'v038', type : 'string'},
				{ name: 'v039', type : 'string'},
				{ name: 'v040', type : 'string'},
				{ name: 'v041', type : 'string'},
				{ name: 'v042', type : 'string'},
				{ name: 'v043', type : 'string'},
				{ name: 'v044', type : 'string'},
				{ name: 'v045', type : 'string'},
				{ name: 'v046', type : 'string'},
				{ name: 'v047', type : 'string'},
				{ name: 'v048', type : 'string'},
				{ name: 'v049', type : 'string'},
				{ name: 'v050', type : 'string'},
				{ name: 'create_date', type : 'string'},		 
				{ name: 'change_date', type : 'string'},
				{ name: 'creator', type : 'string'},
				{ name: 'changer', type : 'string'},
				{ name: 'target_uid', type : 'string'},
				{ name: 'menu_code', type : 'string'},
     	  	  ],
 	sorters: [{
         property: 'unique_id',
         direction: 'ASC'
     }],
     queryMode: 'remote',
     pageSize: 500,
     hasNull: false,
     hasOwn: false,
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/admin/board.do?method=readDocuMap',
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
	
						};
						
						this.add(blank);
				}

			},//endofload
			beforeload: function(){

			}
		}//endoflistner
});