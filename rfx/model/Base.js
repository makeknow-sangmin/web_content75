Ext.define('Rfx.model.Base', {
    extend: 'Ext.data.Model',
    requires: [
	     	   'Rfx.util.SinglePost'
	     	],
    schema: {
        namespace: 'Rfx.model'
    },
    
    getApi: function() {
    	var proxy = this.proxy;
    	if(proxy==null) {
    		return null;
    	} else {
    		return proxy['api'];
    	}
    },
    
    getSaveUrl: function() {
		var api = this.getApi();
		if(api==null) {
			return null;
		} else {
			return api['create'];
		}

    },

    getUpdateUrl: function() {
		var api = this.getApi();
		if(api==null) {
			return null;
		} else {
			return api['update'];
		}
    },
    
    getRemoveUrl: function() {
		var api = this.getApi();
		if(api==null) {
			return null;
		} else {
			return api['destroy'];
		}
    }

});