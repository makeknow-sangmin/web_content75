Ext.define('Mplm.store.Event', {
	extend : 'Ext.data.Store',
//    requires: [
//               'Ext.data.proxy.Memory',
//               'Ext.data.reader.Json',
//               'Ext.data.writer.Json',
//               'Ext.calendar.data.EventModel',
//               'Ext.calendar.data.EventMappings'
//           ],
           
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
    
    // private - override to make sure that any records added in-memory
    // still get a unique PK assigned at the data level
    interceptCreateRecords: function(records, operation, success) {
    	//console_log('interceptCreateRecords');
    	//console_log(records);
    	//console_log(operation);
    	//console_log(success);
        if (success) {
            var i = 0,
                rec,
                len = records.length;
            
            for (; i < len; i++) {
                records[i].data[Ext.calendar.data.EventMappings.EventId.name] = records[i].id;
            }
        }
    },
    
    // If the store started with preloaded inline data, we have to make sure the records are set up
    // properly as valid "saved" records otherwise they may get "added" on initial edit.
    initRecs: function(){
    	//console_log('initRecs');
        this.each(function(rec){
            rec.store = this;
            rec.phantom = false;
        }, this);
    },
    
    // private - override the default logic for memory storage
    onProxyLoad: function(operation) {
    	//console_log('onProxyLoad');
        var me = this,
            records;
        
        if (me.data && me.data.length > 0) {
            // this store has already been initially loaded, so do not reload
            // and lose updates to the store, just use store's latest data
            me.totalCount = me.data.length;
            records = me.data.items;
        }
        else {
            // this is the initial load, so defer to the proxy's result
            var resultSet = operation.getResultSet(),
                successful = operation.wasSuccessful();

            records = operation.getRecords();
//console_log( records);
//console_log(resultSet);
//console_log('successful:' + successful);
            if (resultSet) {
                me.totalCount = resultSet.total;
            }
            if (successful) {
                me.loadRecords(records, operation);
            }
        }

        me.loading = false;
        me.fireEvent('load', me, records, successful);
    },
    
    
	fields : [ {
		name : 'user_id',
		type : "string"
		}
	],
	hasNull: false,
	sorters: [{
        property: 'user_id',
        direction: 'ASC'
    }],
	proxy : {
		type : 'ajax',
		url: CONTEXT_PATH +'/eventMgmt/event.do?method=read',
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
			
			console_log(records);
			
			if(this.hasNull) {
				
				var blank ={
		
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
		}
}
});