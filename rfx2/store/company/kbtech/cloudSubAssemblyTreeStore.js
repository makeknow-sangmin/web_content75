Ext.define('Rfx2.store.company.kbtech.cloudSubAssemblyTreeStore', {
    extend: 'Ext.data.TreeStore',
    initComponent: function(params) {
        Ext.apply(this, {
            lang: params.lang
        });

    },
    model: 'Rfx2.model.company.kbtech.TreeModel',
    listeners: {
        beforeload: function(sender,node,records){
            var parent=node.node.data.text;
            var id = node.node.data.id;
            var context = node.node.data.context;
            var folder = node.node.data.folder;
            var refer_uid = node.node.data.refer_uid;
            var depth = node.node.data.depth;

//	    	if(parent!='Root'){
            var callType = '';
            console_logs('====node', node);
            this.getProxy().setExtraParam('refer_uid', refer_uid);
            this.getProxy().setExtraParam('depth', depth);
            this.getProxy().setExtraParam('parent_uid', id);
            this.getProxy().setExtraParam('callType', callType);
            if(vCompanyReserved4 == 'KBTC01KR') {
                this.getProxy().setExtraParam('ac_uid_minus_one', 'Y');
            }
            if(vCompanyReserved4 == 'DSMF01KR' && depth>0) {
                this.getProxy().setExtraParam('child', -1);
            }

            folder = Ext.JSON.encode(folder);

            this.getProxy().setExtraParam('parentFolder', folder);
//	    	}
//	    	else{
//	    		var callType = 'TOP';
//		    	this.getProxy().setExtraParam('callType', callType);
//	    	}
        },
        load: function(sender,node,records){
            for(var i=0; i<records.length; i++) {
                var rec = records[i];

                console_logs('rec', rec);

                gm.me().selectTreeRecord(rec);
            }


        }//endofload
    }
});
