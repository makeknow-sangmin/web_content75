Ext.define('Rfx2.view.company.dabp01kr.purStock.WearingStateView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'wearing-view',
    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField (
				{
						field_id: 'date_type'
						,store: "DatetypeStore"
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
				});	
    	
    	this.addSearchField ({
            type: 'dateRange',
            field_id: 'listpodate',
            labelWidth: 0,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
    	}); 
    	//검색툴바 추가
    	this.addSearchField('pj_code');
		this.addSearchField('seller_name');
//		this.addSearchField('pr_name');
		this.addSearchField('item_name_dabp');
		this.addSearchField('specification_dabp');
		//this.addSearchField('item_code');
		//this.addSearchField('gr_no');
		this.addSearchField('wa_name_dabp');
		this.addSearchField('product_name_dabp');
		
		//Readonly Field 정의
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');
//		this.addReadonlyField('create_date');
//		this.addReadonlyField('creator');
//		this.addReadonlyField('creator_uid');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.WarehousingState', [{
        	property: 'unique_id',
        	direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
        //this.removeAction.setText('입고취소');
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
		arr.push(searchToolbar);
		
		Ext.each(this.columns, function(columnObj, index) {
			var dataIndex = columnObj["dataIndex"];
			console_logs('>dataIndex', dataIndex);
			switch(dataIndex) {
                case 'sales_price':
				columnObj["editor"] = {};
				columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, meta) {
					meta.css = 'custom-column';
					return value;
				};
				break;
				case 'gr_reason':
				columnObj["editor"] = {};
				columnObj["css"] = 'edit-cell';
				columnObj["renderer"] = function(value, meta) {
					meta.css = 'custom-column';
					return value;
				};
				break;
			}
		});
        
        //grid 생성.
        this.createGrid(arr);
		this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        
        this.setAllGoView = Ext.create('Ext.Action', {
          	 xtype : 'button',
   			 text: '전체',
   			 tooltip: '전체목록',
   			 pressed: true,
   			 //ctCls: 'x-toolbar-grey-btn',
   			 toggleGroup: 'poViewType',
   			 handler: function() {
   				gMain.selPanel.poviewType = 'ALL';
   				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
   				gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
   				 gMain.selPanel.store.load(function(){});
   			 }
   		});
           
           this.setSubGoView = Ext.create('Ext.Action', {
          	 xtype : 'button',
   			 text: '부자재',
   			 tooltip: '부자재 입고',
   			 //ctCls: 'x-toolbar-grey-btn',
   			 toggleGroup: 'poViewType',
   			 handler: function() {
   				gMain.selPanel.poviewType = 'SUB';
   				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
   				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K');
   				 gMain.selPanel.store.load(function(){});
   			 }
   		});
           this.setRawGoView = Ext.create('Ext.Action', {
           	 xtype : 'button',
    			 text: '원단',
    			 tooltip: '원단 주문',
    			 //ctCls: 'x-toolbar-grey-btn',
    			 toggleGroup: 'poViewType',
    			 handler: function() {
    				gMain.selPanel.poviewType = 'RAW';
    				gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'O');
    				gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'O');
   				 gMain.selPanel.store.load(function(){});
    			 }
    		});
           
           this.RsetPaperGoView = Ext.create('Ext.Action', {
            	 xtype : 'button',
      			 text: '롤',
      			 tooltip: '롤',
      			 //ctCls: 'x-toolbar-grey-btn',
      			 toggleGroup: 'poViewType',
      			 handler: function() {
      				 gMain.selPanel.poviewType = 'ROLL';
      				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
//      				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
      				gMain.selPanel.store.getProxy().setExtraParam('catalog_id', 'ROLL');
      				 gMain.selPanel.store.load(function(){});
      			 }
      		});
           this.SsetPaperGoView = Ext.create('Ext.Action', {
           	 xtype : 'button',
     			 text: '시트',
     			 tooltip: '시트',
     			 //ctCls: 'x-toolbar-grey-btn',
     			 toggleGroup: 'poViewType',
     			 handler: function() {
     				 gMain.selPanel.poviewType = 'SHEET';
     				 gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
//     				 gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
     				gMain.selPanel.store.getProxy().setExtraParam('catalog_id', 'SHEET');
     				 gMain.selPanel.store.load(function(){});
     			 }
     		});
        
      //버튼 추가.
        buttonToolbar.insert(5, '-');
        buttonToolbar.insert(5, this.setSubGoView);
        buttonToolbar.insert(5, this.setRawGoView);
        buttonToolbar.insert(5, this.SsetPaperGoView);
        buttonToolbar.insert(5, this.RsetPaperGoView);
        buttonToolbar.insert(5, this.setAllGoView);
        buttonToolbar.insert(3, '-');
        
      //입고 취소 Action 생성
        this.removeGoAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: gm.getMC('CMD_Goods_receipt_cancellation', '입고 취소'),
			 tooltip: '입고 취소',
			 disabled: true,
			 handler: function() {
				 gMain.selPanel.treatremoveGo();
			/* switch(gMain.selPanel.poviewType) {
				 case 'ALL':
					 alert("자재를 먼저 선택해 주세요");
					 break;
				 case 'ROLL':
					 gMain.selPanel.treatPaperGoRoll();
					 break;
				 default: 
				 	gMain.selPanel.treatPaperGoSheet();
				 }*/
				 
			 }//handler end...
			 
		});

		//할인금액 Action 생성
        this.discountAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '할인금액',
			 tooltip: '할인금액',
			 disabled: true,
			 handler: function() {
				Ext.MessageBox.show({
    	            title: '할인금액',
    	            msg: '할인금액을 추가 하시겠습니까?',
    	            buttons: Ext.MessageBox.YESNO,
    	            fn: gMain.selPanel.treatdiscountGo,
    	            icon: Ext.MessageBox.QUESTION
    	        });
			 }//handler end...
			 
		});
        
        buttonToolbar.insert(1, '-');
		buttonToolbar.insert(1, this.removeGoAction);
		buttonToolbar.insert(2, this.discountAction);


        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
          	  this.wgrast_uids=[];
          	  this.arrGrqty =[];
         	   for(var i=0; i<selections.length; i++){
					var rec1 = selections[i];
					var uids = rec1.get('id');
					var gr_qty = rec1.get('gr_qty');
					this.arrGrqty.push(gr_qty);
					this.wgrast_uids.push(uids);
         	   }
         		var rec = selections[0];
         		//console_logs('rec', rec);
         		gMain.selPanel.rec = rec;
         		gMain.selPanel.cartmapuid = rec.get('id');
         		
				gMain.selPanel.removeGoAction.enable();
				
				gMain.selPanel.discountAction.enable();
             } else {
            	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
            	// gMain.selPanel.removeGoAction.disable();
            	this.wgrast_uids=[];
            	this.arrGrqty =[];
            	 for(var i=0; i<selections.length; i++){
           		   	var rec1 = selections[i];
				  	var uids = rec1.get('id');
					var gr_qty = rec1.get('gr_qty');
					this.arrGrqty.push(gr_qty);
					this.wgrast_uids.push(uids);
				  }
			   gMain.selPanel.discountAction.disable();
            }
        	
		});
		
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});

    },
    items : [],
    arrGrqty : [],
    wgrast_uids : [],
    poviewType: 'ALL',
    treatremoveGo: function(){
    	Ext.MessageBox.show({
            title:'입고 취소',
            multiline: true,
            msg: '입고 취소 사유',
            buttons: Ext.MessageBox.YESNO,
            fn: gMain.selPanel.deleteConfirm,
            icon: Ext.MessageBox.QUESTION
    	});
	},
	treatdiscountGo:function() {
		var rec = gm.me().grid.getSelectionModel().getSelection()[0];
		console_logs('>>>>>>>rec', rec);
		var pj_code = rec.get('account_code');
		var pj_name = rec.get('account_name');
		var unique_id = rec.get('unique_id_long');

		// 수주의 할인금액 ROW 추가
		Ext.Ajax.request({
			url: CONTEXT_PATH + '/quality/wgrast.do?method=addDiscountGo',
			params:{
				pj_code : pj_code,
				pj_name : pj_name,
				unique_id : unique_id
			},
			success : function(result, request) {   	
				var result = result.responseText;
				gm.me().store.load();

			},// endofsuccess
			failure: extjsUtil.failureMessage
		});// endofajax
	},
    deleteConfirm: function(btn, text){
    	 
    	    if(btn!='yes') {
    	    	return;
    	    }
    	 var unique_ids = gMain.selPanel.wgrast_uids;
    	 var arrGrqty = gMain.selPanel.arrGrqty;
    	 console_logs('uid', unique_ids);
    	 console_logs('arrGrqty', arrGrqty);
    	 console_logs('text', text);
    	
    	 Ext.Ajax.request({
    			url: CONTEXT_PATH + '/quality/wgrast.do?method=destroy',
    			params:{
    				arrGrqty : arrGrqty
    				,cancel_reason : text
    				,unique_ids: unique_ids
    			},
    			success : function(result, request) {
    				gMain.selPanel.store.load(function(){});
    			},
    			failure: extjsUtil.failureMessage
    		});
    }
    
});
