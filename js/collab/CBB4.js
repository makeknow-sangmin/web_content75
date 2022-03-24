//global var.
var makahdStore = null;
var srccstStore = null;

var class_code = ''; 

var claAstTreeStore = Ext.create('Mplm.store.ClaAstTreeStore', {});

var addAction = Ext.create('Ext.Action', {
	iconCls:'add',
    text: 'Maker추가',
    disabled: true ,
	handler : function(widget, event) {
		var inputItem= [];
		
		inputItem.push(new Ext.form.Hidden({
			            id: 'indust_code',
			           name: 'indust_code',
			           value: class_code
			        }));
		inputItem.push(new Ext.form.Hidden({
			            id: 'file_itemcode',
			           name: 'file_itemcode',
			           value: vFILE_ITEM_CODE
			        }));
		inputItem.push(
    	{
    		 emptyText: '업체명',
    		 id:'maker_name',
             name: 'maker_name',
             anchor: '100%'  // anchor width by percentage
        });
		inputItem.push(
    	{
    		 emptyText: '주소',
    		 id: 'homepage_url',
             name: 'homepage_url',
             anchor: '100%'  // anchor width by percentage
        });
    	 
    	inputItem.push(
        {
            xtype: 'filefield',
            emptyText: panelSRO1149,
            buttonText: 'upload',
            allowBlank: true,
            buttonConfig: {
                iconCls: 'upload-icon'
            },
            anchor: '100%'
        });
        
       
		var form = Ext.create('Ext.form.Panel', {
    		id: 'formPanel',
            defaultType: 'textfield',
            border: false,
            bodyPadding: 15,
            region: 'center',
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 100
            },
             items: inputItem
        });
        
        var win = Ext.create('ModalWindow', {
            title: CMD_ADD  + ' :: ' + /*(G)*/vCUR_MENU_NAME,
            width: 500,
            height: 50,
            minWidth: 250,
            minHeight: 180,
            items: form,
            buttons: [{
                text: CMD_OK,
            	handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    if(form.isValid())
                    {
	///********************파일첨부시 추가(Only for FileAttachment)**************
	                	//alert('add Handler:' + /*(G)*/vFILE_ITEM_CODE);
	                	/*(G)*/vFILE_ITEM_CODE = RandomString(10);
	                	var val = form.getValues(false);
	                    var makahd = Ext.ModelManager.create(val, 'MakAhd');
	                    console_log(makahd);
	                   	form.submit({
	                        url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
	                        waitMsg: 'Uploading Files...',
	                        success: function(fp, o) {
	                        	console_log('success');
	                          	 //console_log(o.result.datas[0].first + ':' + o.result.datas[0].second);
		                       	makahd.save({
		                       		success: function() {
		                               	if(win) 
		                               	{
		                               		win.close();
		                               		makahdStore.load(function() { });
		                               	} 
		                    		},
	                                failure: function (rec, op)  {
	                               	 console_log(rec);
	                               	 console_log(op);
	                               	 msg('Fail', rec);
	                                }
		                    	 });
	                        },
	                    	failure : function(){
	                    		console_log('failure');
	                    		Ext.MessageBox.alert(error_msg_prompt,'Failed');
	                    	}
	                 	});
                    } else {
                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                    }
                  }
            },{
                text: CMD_CANCEL,
            	handler: function(){
            		if(win) {
            			win.close();
            		}
            	}
            }]
        });
        win.show();
     }
});

var makahdfields = [{name: 'unique_id_long', type: 'string'},
					{name: 'indust_code', type: 'string'},
    				{name: 'maker_name', type: 'string'},
    				{name: 'homepage_url', type: 'string'},
    				{name: 'major_item', type: 'string'},
    				{name: 'file_itemcode', type: 'string'}
    				]
    				
var srccstFields =['id', 'object_name', 'file_size', 'status', 
					'progress', 'fileobject_uid', 'file_ext', 
					'item_code', 'group_code'];


var searchAction = Ext.create('Ext.Action', {
	itemId: 'searchButton',
    iconCls: 'search',
    text: CMD_SEARCH,
    disabled: false ,
    handler: searchHandler
});

Ext.define('SrcCst', {
  	 extend: 'Ext.data.Model',
  	 fields: srccstFields,
  	    proxy: {
				type: 'ajax',
		        api: {
		        	read: CONTEXT_PATH + '/fileObject.do?method=readFileList',
		            create: CONTEXT_PATH + '/fileObject.do?method=create',
		            update: CONTEXT_PATH + '/fileObject.do?method=create',
		            destroy: CONTEXT_PATH + '/fileObject.do?method=destroy'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success'
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: true,
		            root: 'datas'
		        } ,
	            listeners: {
	                exception: function(proxy, response, operation){
	                	console_log('fileUpload SrcCst Model listen..');
	                    Ext.MessageBox.show({
	                        title: 'REMOTE EXCEPTION',
	                        msg: operation.getError(),
	                        icon: Ext.MessageBox.ERROR,
	                        buttons: Ext.Msg.OK
	                    });
	                }
	            }
			}
});
	
Ext.onReady(function() {  
	
	Ext.define('MakAhd', {
    extend: 'Ext.data.Model',
    fields: makahdfields,
    proxy:{
        type:'ajax',
        api:{
            read: CONTEXT_PATH + '/b2b/lounge.do?method=readMakahd',
            create: CONTEXT_PATH + '/b2b/lounge.do?method=createMakahd'
        },
        reader:{
            type:'json',
            root:'datas',
			totalProperty: 'count',
			successProperty: 'success'
        },
        writer:{
           type: 'singlepost',
            writeAllFields:false,
//            encode:false,
            root:'datas'
        }
    }
	});
	
    makahdStore = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'MakAhd',
		sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
        }]
	});
	
	srccstStore = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'SrcCst',
		sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
        }]
	});

	makahdStore.load(function() {
		var dataview = Ext.create('Ext.view.View', {
			region: 'east',
			width:'80%',
	        deferInitialRefresh: false,
	        store: makahdStore,
	        tpl  : Ext.create('Ext.XTemplate',
	            	'<tpl for=".">',
	                '<div class="phone">',
	                    (!Ext.isIE6? '<img width="80" height="64" src="'+ '/media/b2b/{[values.major_item.replace(/ /g, "-")]}" />' :
	                     '<div style="width:74px;height:74px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + '/home/teamcuberfx/b2b_image/{[values.major_item.replace(/ /g, "-")]}\',sizingMethod=\'scale\')"></div>'),
	                    '<strong>{maker_name}</strong>',
	                '</div>',
	            '</tpl>'
	        ),
	        plugins : [
	            Ext.create('Ext.ux.DataView.Animated', {
	                duration  : 550,
	                idProperty: 'unique_id'
	            })
	        ],
	        id: 'phones',
	        itemSelector: 'div.phone',
	        overItemCls : 'phone-hover',
	        multiSelect : true,
	        autoScroll  : true,
	        listeners: {
	            'selectionchange': function(selModel, selection, eOpts) {
			        var node = selection[0];
			        console_log(node);
			        if(node != undefined){
				        var link_url = node.data.homepage_url;
				        goToLink(link_url)
			        }
			    }
	        }
	    });
	    
	    function goToLink(link_url) {
			var url = "http://"+link_url;  
			var winName = "CadnPartB2B";
			var width = 1360;
			var height = 760;
			
			var style = "scrollbars, titlebar, location,  status, menubar, toolbar, fullscreen, resizable";
			console_log(url);
			popupInfoWnd(url,winName,style);
//			window.open(url,winName,style);
		}
		
		var treepanel = Ext.create('Ext.tree.Panel', {
		 	region: 'center',
		    viewConfig: {
		    	listeners: {
				    itemclick: function(view, record, item, index, e, eOpts) {
				    	addAction.enable();
				    	class_name = record.data.text;
					   	class_code = record.data.context;
					   	console_log(class_name);
					   	console_log(class_code);
					    makahdStore.getProxy().setExtraParam('indust_code', class_code);
					    makahdStore.load(function() {});
				    }//end itemclick
		    	}//end listeners
			},
		 	rootVisible: false,
		 	lines: true,
		 	border: false,
		 	useArrows: true,
		 	store: claAstTreeStore
		} );
		
	    var main = Ext.create('Ext.panel.Panel',{
		        	autoScroll: true,
		          	layout:'border',
		      	 	title: CMD_MODIFY  + ' :: ' + /* (G) */vCUR_MENU_NAME  + ' :: ' +/*(G)*/vCUR_MENU_CODE,
		      	 	border: false,
				    layoutConfig: {columns: 2, rows:1},
				    defaults: {
				        collapsible: true,
				        split: true,
				        cmargins: '5 0 0 0',
				        margins: '0 0 0 0'
				    },
		          	items : [dataview, treepanel],
			        dockedItems: [{
			        	dock: 'top',
				 		xtype: 'toolbar',
					    items: [searchAction,{
						    width: 148,
							xtype: 'textfield',
							emptyText:  '입력',
							labelSeparator: '',
							readOnly: false
					    },addAction]
				 	}]
        });
		fLAYOUT_CONTENT(main);
		cenerFinishCallback();
	});
});