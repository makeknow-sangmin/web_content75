Ext.define('ModalWindow', {
	 extend: 'Ext.window.Window',
	 title: /*GLOBAL*/vCUR_MENU_NAME,
     layout: {
         type: 'border',
         padding: 0
     },
     modal:true,
     plain:true
});
function createViewForm(board) {
	//Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
	
	var lineGap = 30;
 	var unique_id = board.get('unique_id');
	var user_id = board.get('user_id');
	var board_email = board.get('board_email'  );
	var board_title = board.get('board_title' );
	var board_content = board.get('board_content' );
	var htmlFileNames = board.get('htmlFileNames' );
	var fileQty = board.get('fileQty' );
	//alert(fileQty);
	//alert(htmlFileNames);
	var form = Ext.create('Ext.form.Panel', {
		id: 'formPanelCbb1',
        //layout: 'absolute',
        defaultType: 'displayfield',
        border: false,
        bodyPadding: 15,
        height: 650,
        defaults: {
            anchor: '100%',
            allowBlank: false,
            msgTarget: 'side',
            labelWidth: 100
        },
        items: [/*{
				fieldLabel: 'unique_id',
				value: unique_id,
				name: 'unique_id',
				anchor: '-5'  // anchor width by percentage
			},*/{
				fieldLabel: '등록자',
				value: user_id + ', ' + board_email,
				anchor: '-5'  // anchor width by percentage
			},{
		    	fieldLabel: '제목',
		    	value: board_title,
		    	anchor: '-5'  // anchor width by percentage
		    },{
                y: 0 + 5*lineGap,
                value: board_content,
                fieldStyle: 'height:320; overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                height: 300,
                readOnly: true,
                anchor: '100%'
            },{
		    	fieldLabel: '첨부파일',
		    	value: htmlFileNames,
		    	name: 'htmlFileNames',
		    	anchor: '-5'  // anchor width by percentage
		    }  
		    ]
    }); //endof form
	
	return form;
}
function viewBoard(unique_id) {
			
			Board.load(unique_id ,{
				 success: function(board) {

				        var win = Ext.create('ModalWindow', {
				            title: '내용보기',
				            width: 700,
				            height: 500,
				            minWidth: 250,
				            minHeight: 180,
				            layout: 'absolute',
				            plain:true,
				            items: createViewForm(board),
				            buttons: [{
				                text: '확인',
				            	handler: function(){
				                       	if(win) 
				                       	{
				                       		win.close();
				                       	} 
				                  }
				            }]
				        });
				        //store.load(function() {});
						win.show();
						//endofwin
						
//					});
	

				 }//endofsuccess
			 });//emdofload
	
};


Ext.define('Board', {
	extend: 'Ext.data.Model',
	fields: [
               {name: 'user_id', type: 'string'},
               {name: 'unique_id', type: 'string'},
               {name: 'board_email', type: 'string'},
               {name: 'board_title', type: 'string'},
               {name: 'board_content', type: 'string'},
               {name: 'htmlFileNames', type: 'string'},
               {name: 'creator',     type: 'string'},
               {name: 'create_date',  type: 'string'}
            ],
    proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/admin/board.do?method=read'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success',
				excelPath: 'excelPath'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        }
		}
});

		
Ext.define('Ext.app.GridPortlet', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridportlet',
    uses: [
        'Ext.data.ArrayStore'
    ],
    height: 300,
	border: false,
	viewConfig:{
	    markDirty:false
	},
    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    change: function(val) {
        if (val > 0) {
            return '<span style="color:green;">' + val + '</span>';
        } else if (val < 0) {
            return '<span style="color:red;">' + val + '</span>';
        }
        return val;
    },

    /**
     * Custom function used for column renderer
     * @param {Object} val
     */
    board_title: function(val) {
        if (val > 0) {
            return '<span style="color:green;">' + val + '%</span>';
        } else if (val < 0) {
            return '<span style="color:red;">' + val + '%</span>';
        }
        return val;
    },

    
    initComponent: function(params){
    	//console_log('params', params);
    	
    	var gubun = 'I';
    	if(vCUR_USER_UID!=null && vCUR_USER_UID!='') {
    		gubun = '0';
    	}
    	
    	if(params != undefined) {
    		gubun = params.gubun;
    	}
    	
        var store = new Ext.data.Store({  
			pageSize: 50,
			model: 'Board',
			sorters: [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }]
		});
		
        Ext.apply(this, {
            //height: 300,
            height: this.height,
            store: store,
            stripeRows: true,
            columnLines: true,
            columns: [{
                id       :'id',
                text   : 'id',
                sortable : true,
                width:1,
                dataIndex: 'id'
            },{
                id       :'board_title',
                text   : '제목',
                flex: 1,
                sortable : true,
                dataIndex: 'board_title'
            },{
            	id: 'create_date',
                text   : '등록일자',
                width    : 100,
                sortable : true,
                dataIndex: 'create_date'
            }]
        });
        //store.getProxy().setExtraParam('gubun', gubun);
		store.load(function(records){
			//console_logs('GridPortlet.load>>>>>>>>>>>>>>>', records);
			for(var i=0; i<records.length; i++) {
				//console_logs('record', records[i]);
				
				var o = records[i];
				var title = o.get('board_title');
				var unique_id = o.get('id') ;
				title = '<a href="#" onClick="javascript:viewBoard(' + unique_id + ');" >' + title + '</a>'; 
				//console_logs('['+i+']', title);
				o.set('board_title', title);
				
			}
			//console_log(records.length);
			//console_log('GridPortlet.load<<<<<<<<<<<<<<<');
		});
        
        this.callParent(arguments);
    }
});
