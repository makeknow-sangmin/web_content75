/**
 * Process Name Store
 */
Ext.define('Rfx.store.FtpFileStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        });

    },
	fields : [ {
		name : 'date',  //자재코드(번호)   srcahd
		type : "string"
		}, {
			name : 'folder',   //설계자재번호 srcahd
			type : "string"
		}, {
			name : 'gid',    //도장외부스펙1 pjdetail
			type : "string"
		},  {
			name : 'id',    //납품기준일 project
			type : "string"
		},  {
			name : 'item_code',    //납품기준일 project
			type : "string"
		},  {
			name : 'link',    //납품기준일 project
			type : "string"
		},  {
			name : 'name',    //납품기준일 project
			type : "string"
		},  {
			name : 'permission',    //납품기준일 project
			type : "string"
		},  {
			name : 'size',    //납품기준일 project
			type : "string"
		},  {
			name : 'uid',    //납품기준일 project
			type : "string"
		}

	],
	hasNull: false,
	sorters: [{
        property: 'uid',
        direction: 'DESC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/supercom.do?method=projectRepo&repo_type=project',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		writer: {
	           type: 'singlepost',
	           writeAllFields: false,
	           root: 'datas'
	       }, 
		autoLoad : false
	},
	listeners: {
		metachange: function (store, meta, eOpts) {
         	//console_log('###################################');
            //console_log(
            //		"logonDir: " + meta.logonDir
           // 		+ ", pjUid: " + meta.pjUid
           // 		+ ", path: " + meta.path
           // );   
			console_logs('meta', meta);
		store.getProxy().setExtraParam('newFolder', null);
		store.getProxy().setExtraParam('fileName', null);
		
			gMain.selPanel.gPath = meta.path;
            console_logs('FtpFileStore', gMain.selPanel.gPath);
//			var linkStr =getMenuPath(gPath);
//			var callPath = Ext.getCmp('callPath');
//			callPath.update(linkStr);
     }
	}  
});