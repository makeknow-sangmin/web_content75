Ext.define('Rfx2.store.company.hanjung.AssyStoreCode', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
            hasNull: params.hasNull,
            item_name: params.item_name,
            cmpName: params.cmpName,
            srchNull: params.srchNull
            // some else customization
        });

    },
    fields : [ {
        name : 'item_name',
        type : "string"
    }
    ],
    hasNull: false,
    srchNull : true,
    sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
    queryMode: 'remote',
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahdCode&standard_flag=A&not_sp_code=PRD',
        reader : {
            type : 'json',
            root : 'datas',
            totalProperty : 'count',
            successProperty : 'success'
        },
        autoLoad : true
    },
    listeners: {
        load: function(store, records, successful,operation, options) {
            if(this.hasNull) {
                var blank ={
                    systemCode: '',
                    codeName: '',
                    codeNameEn: ''
                };
                this.add(blank);
            }

        },
        beforeload: function(){
        	if(this.srchNull){
            	this.getProxy().setExtraParam('item_name', this.cmpName);
    			console_logs('Mplm.store.ProductStore beforeload', this.cmpName);
    			var obj = Ext.getCmp(this.cmpName); 
    			console_logs(obj);
    			if(obj!=null) {
    				var val = obj.getValue();
    				console_logs(val);
    			if(val!=null) {
    				var enValue = Ext.JSON.encode(val);
    				console_logs("queryUtf8:" + enValue);
    				this.getProxy().setExtraParam('item_name', enValue);
    			}//endofelse
    		}	
          }	
        }   
    }
});