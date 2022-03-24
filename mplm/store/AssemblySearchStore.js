/**
 * AssemblySearchStore Store
 */

Ext.define('Mplm.store.AssemblySearchStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		console_logs('myLink in store++++++++++>>>>>>>>>>>', myLink);
        Ext.apply(this, {
        	myLink: params.myLink,
        	item_types: params.item_types
        });
    },
	fields:[  
		{
		    name: 'myLink',
		    type: "string"
		},
		{
            name: 'unique_id',
            type: "string"
        }, {
            name: 'item_code',
            type: "string"
        }, {
            name: 'item_name',
            type: "string"
        }, {
            name: 'specification',
            type: "string"
        }, {
            name: 'maker_name',
            type: "string"
        }, {
            name: 'description',
            type: "string"
        }, {
            name: 'specification_query',
            type: "string"
        }
	 	  ],
	 	 myLink:'',
	 	extraParams : {
	 		myLink: ''
        },
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=searchAssy',
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
				console_logs('load records', records);

			},
			beforeload: function(){

				this.getProxy().setExtraParam('myLink', this.myLink);
                this.getProxy().setExtraParam('item_types', this.item_types);
				console_logs('myLink in store>>>>>>>>>>>', this.myLink);
		}
		}
});