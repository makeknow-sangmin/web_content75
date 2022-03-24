var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
    clicksToEdit: 1
});
var grid = null;
var store = null;
var selectedAssyUid = '';
var selectedMoldUid = '';

//버튼 생성, 리스너 등록
var addAction = Ext.create('Ext.Action', {		//속성
	itemId: 'sendButton',						//button id
	iconCls:'EPMPerformSignoffTask',			//icon image
	text: crt3_ok,								//button name
    disabled: true,								//비활성화
    handler: function(widget, event) {			//OnClickEvent
    	Ext.MessageBox.show({
            title:'Do you it approval?',
            msg: 'Do you it approval. <br />Are you sure?',
            buttons: Ext.MessageBox.YESNO,
            fn: sendConfirm,					//ActionListener 연결
            icon: Ext.MessageBox.QUESTION
        });
    }
});//승인 버튼

var recallAction = Ext.create('Ext.Action', {
	itemId: 'recallAction',	
	iconCls:'EPMPerformSignoffTask',
	text: "取消",
    disabled: true,
    handler: function(widget, event) {
    	Ext.MessageBox.show({
            title:'Do you it disapproval?',
            msg: 'Do you it disapproval. <br />Are you sure?',
            buttons: Ext.MessageBox.YESNO,
            fn: recallConfirm,
            icon: Ext.MessageBox.QUESTION
        });
    }
});	//반려버튼

//승인 액션리스너 내용
function sendConfirm(btn) {
	var selections = grid.getSelectionModel().getSelection();	//선택된 grid 모델을 배열로 반환
	
    if (selections) {
        var result = MessageBox.msg('{0}', btn);				//버튼 초기화인듯?
        if(result=='yes') {										//Yes를 눌렀을경우
        	//속성값 넣을 준비
        	var unique_ids = [];
        	var assy_uids = [];
        	var srcahd_uids = [];
        	var arr_stock_qty_alloc = [];
        	var arr_stock_qty_po = [];
        	
        	//선택된 버튼만큼
        	for(var i=0; i< selections.length; i++) {
        		
        		var rec = selections[i];	//rec 에 선택된 grid 내용을 복사
        		console_log(rec);			//로그출력
        		
        		//값 지정
        		var unique_uid = rec.get('unique_uid');
        		var srcahd_uid = rec.get('unique_id');
        		var coord_key3 = rec.get('coord_key3');
        		var stock_qty_alloc = rec.get('stock_qty_alloc');
        		var stock_qty_po = rec.get('stock_qty_po');
        		
        		//값들 하나씩 배열에 저장(순서대로)
        		assy_uids.push(coord_key3);
        		unique_ids.push(unique_uid);
        		srcahd_uids.push(srcahd_uid);
        		arr_stock_qty_alloc.push(stock_qty_alloc);
        		arr_stock_qty_po.push(stock_qty_po);
        	}
        	
        	//동적으로 서버에 요청(controller)
			Ext.Ajax.request({
				url: CONTEXT_PATH +'/production/pcsrequest.do?method=Approve',	
				params:{
					//위에서 값들을 저장한 배열들을 넘겨준다
					assy_uid: assy_uids,
					pj_uid: selectedMoldUid,
					unique_uid: unique_ids,
					srcahd_uids: srcahd_uids,
					arr_stock_qty_alloc: arr_stock_qty_alloc,
					arr_stock_qty_po: arr_stock_qty_po
				},
				
				success : function(result, request) {
					var resultText = result.responseText;
					console_log('result:' + resultText);
	
					if(resultText=="FAIL") {
						alert("FAIL");
					} else {
						store.load(function() {});						
					}					
				},
				failure: extjsUtil.failureMessage
			});
        }//if result
    }//if selection
}

//반려
function recallConfirm(btn){
	var selections = grid.getSelectionModel().getSelection();	//선택된 grid 모델을 배열로 반환
	
    if (selections) {
        var result = MessageBox.msg('{0}', btn);				//버튼 초기화인듯?
        
        if(result=='yes') {										//Yes를 눌렀을경우
        	//속성값 넣을 준비
        	var assy_uids = [];
        	var unique_ids = [];
        	
        	//선택된 버튼만큼
        	for(var i=0; i< selections.length; i++) {
        		
        		var rec = selections[i];	//rec 에 선택된 grid 내용을 복사
        		console_log(rec);			//로그출력
        		
        		//값 지정
        		var unique_uid = rec.get('unique_uid'); //cart
        		//coord_key3 이 assy_uids
        		var assy_uid = rec.get('coord_key3');
        		
        		//값들 하나씩 배열에 저장(순서대로)
        		unique_ids.push(unique_uid);	//cart
        		assy_uids.push(assy_uid);        		
        	}
        	
        	Ext.Ajax.request({
				url: CONTEXT_PATH +'/production/pcsrequest.do?method=recall',	
				params:{
					//위에서 값들을 저장한 배열들을 넘겨준다
					unique_uid: unique_ids,	//cart
					assy_uid: assy_uids	//assy				
				},
				
				success : function(result, request) {
					var resultText = result.responseText;
					console_log('result:' + resultText);
	
					if(resultText=="FAIL") {
						alert("FAIL");
					} else {
						store.load(function() {});						
					}					
				},
				failure: extjsUtil.failureMessage
				}
			);
        }
        };//반려
    }


Ext.onReady(function() { 
	console_log('now starting...');
	LoadJs('/js/util/comboboxtree.js');
	Ext.define('CartLine', {
		 extend: 'Ext.data.Model',
		 fields: /*(G)*/vCENTER_FIELDS,
		    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/purchase/material.do?method=readPR'
//		            create: CONTEXT_PATH +'/production/pcsrequest.do?method=Approve'
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success'
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
		model: 'CartLine',
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
	
	store.getProxy().setExtraParam('status', 'PR');
	store.load(function() {
		var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );
 		Ext.each(/*(G)*/vCENTER_COLUMNS, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			if(dataIndex!='no') {
				if('stock_qty_alloc' == dataIndex
						|| 'stock_qty_po' == dataIndex ) {
					columnObj["editor"] = {
	                };	
			        columnObj["renderer"] = function(value, p, record, rowIndex, colIndex, store) {
			        	p.tdAttr = 'style="background-color: #FFE4E4;"';
						return value;
		        	};
				}

			}
		});
 		
		grid = Ext.create('Ext.grid.Panel', {
	        store: store,
	        collapsible: true,
	        multiSelect: true,
	        stateId: 'stateGrid',
	        selModel: selModel,
	        autoScroll : true,
	        autoHeight: true,
	        height: getCenterPanelHeight(),
	        
	        bbar: getPageToolbar(store),
	        
	        dockedItems: [{
	        	xtype: 'toolbar',
	        	items: [addAction,'-',recallAction]	        	
	        },{
	        	xtype: 'toolbar',
	        	items:getProjectTreeToolbar()
	        }],
	        columns: /*(G)*/vCENTER_COLUMNS,
	        plugins: [cellEditing],//필드 에디트
	        viewConfig: {
	            stripeRows: true,
	            enableTextSelection: true,
	            getRowClass: function(record) { 
	              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
	            } ,
	            listeners: {
	            	'afterrender' : function(grid) {
						var elments = Ext.select(".x-column-header",true);
						elments.each(function(el) {
									}, this);
						},
	                itemcontextmenu: function(view, rec, node, index, e) {
	                    e.stopEvent();
	                    return false;
	                }
	            }
	        },
	        title: getMenuTitle()
	    });
		fLAYOUT_CONTENT(grid);
		
		grid.getSelectionModel().on({
	    	selectionchange: function(sm, selections) {
	            if (selections.length) {
					displayProperty(selections[0]);
					if(fPERM_DISABLING()==true) {
						addAction.disable();
						recallAction.disable();
					}else{
						addAction.enable();
						recallAction.enable();
					}
	            } else {
	            	if(fPERM_DISABLING()==true) {
		            	collapseProperty();//uncheck no displayProperty
		            	addAction.disable();
		            	recallAction.disable();
	            	}else{
	            		collapseProperty();//uncheck no displayProperty
	            		addAction.disable();
	            		recallAction.disable();
	            	}
	            }
	        }
	    });
		cenerFinishCallback();
	});
	console_log('End...');
});
