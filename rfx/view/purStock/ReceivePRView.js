Ext.define('Rfx.view.purStock.ReceivePRView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'receive-pr-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	//검색툴바 추가
		this.addSearchField({
			field_id:		'state',
            displayField:   'codeName',
            valueField:     'systemCode',
            store: 			'PrchStateStore',
            innerTpl: 		'<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'	
	
});

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
		  
        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.ReceivePR', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );

    var dateToolbar = Ext.create('Ext.toolbar.Toolbar', {
		cls: 'my-x-toolbar-default1',
    	items: [
        	        //searchAction, '-',
				 '-','-',{
	      					
      					    xtype:'label',
							width:88,
      					    text: "요청기간 :",
      					    style: 'color:white;'
	      					 
				        },
      					{ 
      		                name: 's_date',
      		                id:'s_date2',
      		                format: 'Y-m-d',
      		                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    allowBlank: true,
      					    xtype: 'datefield',
      					    value: new Date(),
      					    width: 100,
      						handler: function(){
      						}
      					},
      					{
      					    xtype:'label',
      					    text: " ~ ",
      					    style: 'color:white;'
      					    
      					 },
      					{ 
      		                name: 'e_date',
      		                id:'e_date2',
      		                format: 'Y-m-d',
      		                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      				    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
      				    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
      					    allowBlank: true,
      					    xtype: 'datefield',
      					    value: new Date(),
      					    width: 99,
      						handler: function(){
      						}
      					},
    	        ]
    });       
    
    var arr=[];
    arr.push(buttonToolbar);
    arr.push(dateToolbar);
    arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.removeAction.setText('반려');
        this.editAction.setText('구매요청');
        
//        //PDF 파일 출력기능
//        this.printPDFAction = Ext.create('Ext.Action',{
//            iconCls: 'af-pdf',
//            text: 'PDF',
//            tooltip:'구매요청서 출력',
//            disabled: true,
//            
//            handler: function(selections) {
//
//            	var rec = selections[0];
//             	//gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id');//rtgast_uid
//            	//var rec = grid.getSelectionModel().getSelection()[0];
//             	//var rtgast_uid = rec.get('id');//rtgast_uid
//            	//var po_no = rec.get('po_no');//po_no
//            	console_logs('rec',rec);
//            	
//            	Ext.Ajax.request({
//            		url: CONTEXT_PATH + '/pdf.do?method=printPr',
//            		params:{
//            			rtgast_uid : gMain.selPanel.vSELECTED_UNIQUE_ID,
//            			//po_no : po_no,
//            			pdfPrint : 'pdfPrint'
//            		},
//            		reader: {
//            			pdfPath: 'pdfPath'
//            		},
//            		success : function(result, request) {
//                	        var jsonData = Ext.JSON.decode(result.responseText);
//                	        var pdfPath = jsonData.pdfPath;
//                	        console_log(pdfPath);      	        
//                	    	if(pdfPath.length > 0) {
//                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
//                	    		top.location.href=url;	
//                	    	}
//            		},
//            		failure: extjsUtil.failureMessage
//            	});
//            	
//            	
//            }
//        });
        
//        //grid를 선택했을 때 Callback
//        this.setGridOnCallback(function(selections) {
//        	
//        	//var processGrid = Ext.getCmp('prchReqGrid');
//            if (selections.length) {
//            	var rec = selections[0];
//            	rtgast_uid = rec.get('id'); //rtgast의 unique_id          
//    			var state = rec.get('state');
//    			if(state=='A') {
//    				gMain.selPanel.removeAction.enable();
//    				gMain.selPanel.editAction.enable();    
//                    gMain.selPanel.printPDFAction.enable();
//    			} else {
//    				gMain.selPanel.collapseProperty();//uncheck no displayProperty
//    				gMain.selPanel.removeAction.disable();
//    				gMain.selPanel.editAction.disable();   
//        			gMain.selPanel.printPDFAction.disable();
//    			}
//                
//                
//                
//            } else {
//                gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(-100);
//            	gMain.selPanel.printPDFAction.disable();
//            }
//        	//processGrid.getStore().getProxy().setExtraParam('rtgast_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
//        	//processGrid.getStore().load();
//        });
//        
//        //버튼 추가.
//        buttonToolbar.insert(4, this.printPDFAction);
//        buttonToolbar.insert(4, '-');
//        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==3) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});
    },
    items : []
});
