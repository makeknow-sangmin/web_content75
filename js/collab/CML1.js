var grid = null;
var store = null;

function func_replaceall(val,sorc1,sorc2){
	while (1)
	{
		if(val.indexOf(sorc1) != -1)
			val = val.replace(sorc1,sorc2);
		else
			break;
	}
	return val;
}

function createViewForm(mailMsg) {
	//Ext.MessageBox.alert('Find MailMsg', "unique_id : " + mailMsg.get('unique_id'));
	
	var lineGap = 30;
 	var unique_id = mailMsg.get('unique_id');
	var creator = mailMsg.get('creator');
	var mail_to = mailMsg.get('mail_to'  );
	var subject = mailMsg.get('subject' );
	var content = mailMsg.get('content' );
	var htmlFileNames = mailMsg.get('htmlFileNames' );
	var fileQty = mailMsg.get('fileQty' );

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
        items: [{
			fieldLabel: getColName('unique_id'),
			value: unique_id,
			anchor: '-5'  // anchor width by percentage
			},{
			fieldLabel: getColName('creator'),
			value: creator,
			 name: 'user_id',
			anchor: '-5'  // anchor width by percentage
			},{
		    	fieldLabel: getColName('mail_to'),
		    	value: mail_to,
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('subject'),
		    	value: subject,
		    	anchor: '-5'  // anchor width by percentage
		    },{
		    	fieldLabel: getColName('htmlFileNames'),
		    	value: htmlFileNames,
		    	anchor: '-5'  // anchor width by percentage
		    },{
                y: 0 + 5*lineGap,
                value: content,
                //xtype: 'htmleditor',
                fieldStyle: 'height:320; overflow:scroll ;overflow-x:hidden; background-color: #EAEAEA; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                height: 300,
                readOnly: true,
                anchor: '100%'
            }  
		    ]
    }); //endof form
	
	return form;
}

var viewHandler = function() {
	var rec = grid.getSelectionModel().getSelection()[0];
	var unique_id = rec.get('unique_id');
	
	MailMsg.load(unique_id ,{
		 success: function(mailMsg) {

	        var win = Ext.create('ModalWindow', {
	            title: CMD_VIEW  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
	            width: 700,
	            height: 530,
	            minWidth: 250,
	            minHeight: 180,
	            layout: 'absolute',
	            plain:true,
	            items: createViewForm(mailMsg),
	            buttons: [{
	                text: CMD_OK,
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
		 }//endofsuccess
	 });//emdofload
	
};

var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

//Define Detail Action
var detailAction  = Ext.create('Ext.Action', {
	itemId: 'detailButton',
    iconCls: 'application_view_detail',
    text: detail_text,
    disabled: true,
    handler: viewHandler
});
//Context Popup Menu
var contextMenu = Ext.create('Ext.menu.Menu', {
    items: [ detailAction]
});

Ext.onReady(function() {  
	
	Ext.define('MailMsg', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/collab/mail.do?method=read'
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

			store = new Ext.data.Store({  
				pageSize: getPageSize(),
				model: 'MailMsg',
				//remoteSort: true,
				sorters: [{
		            property: 'unique_id',
		            direction: 'DESC'
		        }]
			});
			
		 	store.load(function() {

		 		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: true} );
					grid = Ext.create('Ext.grid.Panel', {
					        store: store,
					        ///COOKIE//stateful: true,
					        collapsible: true,
					        multiSelect: true,
					        selModel: selModel,
					        height: getCenterPanelHeight(), 
					        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll : true,
					        autoHeight: true,
					        //width: '100%',
					        
					        bbar: getPageToolbar(store),
					        
					        dockedItems: [{
					            dock: 'top',
					            xtype: 'toolbar',
					            items: [
					                    searchAction
					                    , '->'
//			      				      ,printExcel
			      				      ,
			      				            {
			      				                iconCls: 'tasks-show-all',
			      				                tooltip: 'All',
			      				                toggleGroup: 'status'
			      				            },
			      				            {
			      				                iconCls: 'tasks-show-active',
			      				                tooltip: 'Current',
			      				                toggleGroup: 'status'
			      				            },
			      				            {
			      				                iconCls: 'tasks-show-complete',
			      				                tooltip: 'Past',
			      				                toggleGroup: 'status'
			      				            }
			      				          
			      				          ]
					        }
					        
					        ],
					        columns: /*(G)*/vCENTER_COLUMNS,
					        viewConfig: {
					            stripeRows: true,
					            enableTextSelection: true,
	     			            getRowClass: function(record) { 
		     			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
	     			            } ,
					            listeners: {
					        		'afterrender' : function(grid) {
										var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
										elments.each(function(el) {
														//el.setStyle("color", 'black');
														//el.setStyle("background", '#ff0000');
														//el.setStyle("font-size", '12px');
														//el.setStyle("font-weight", 'bold');
								
													}, this);
											
										}
					            		,
					                itemcontextmenu: function(view, rec, node, index, e) {
					                    e.stopEvent();
					                    contextMenu.showAt(e.getXY());
					                    return false;
					                },
					                itemdblclick: viewHandler
					            }
					        },
					        title: getMenuTitle()
					        //,renderTo: Ext.getCmp('mainview-content-panel').body  //'MAIN_DIV_TARGET'

					    });
					fLAYOUT_CONTENT(grid);
					
				    grid.getSelectionModel().on({
				        selectionchange: function(sm, selections) {
				        	
				        	if (selections.length) {
								collapseProperty();//uncheck no displayProperty
				        		displayProperty(selections[0]);
				        	}
				        	
				        	detailAction.enable();
				        }

				    });

				    Ext.each(/*(G)*/vSRCH_TOOLTIP, function(config) {
				        Ext.create('Ext.tip.ToolTip', config);
				    });
				    //callback for finishing.
				    cenerFinishCallback();
				
			}); //store load

		 	

});//OnReady
