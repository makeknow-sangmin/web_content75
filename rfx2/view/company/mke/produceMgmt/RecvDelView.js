//수주관리 메뉴
Ext.define('Rfx2.view.company.mke.produceMgmt.RecvDelView', {
	extend: 'Rfx2.view.salesDelivery.RecvPoView',
    xtype: 'receved-mgmt-del-view',
    inputBuyer : null,
    initComponent: function(){
//    	this.callOverridden();
//    	this.setDefValue('regist_date', new Date());
    	// 삭제할때 사용할 필드 이름.
//    	this.setDeleteFieldName('unique_uid');
    	
//    	var next7 = gUtil.getNextday(7);
//    	this.setDefValue('delivery_plan', next7);
//    	this.defOnlyCreate = true;
//    	this.setDefComboValue('pm_uid', 'valueField', -1); // Hidden
//																		// Value임.
//    	this.setDefComboValue('pj_type', 'valueField', 'P');
//    	this.setDefComboValue('newmodcont', 'valueField', 'N');
//    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');
//    	this.setDefComboValue('selfdevelopment', 'valueField', 'N');// 세트여부
//    	this.setDefComboValue('previouscont', 'valueField', 'C');// 목형유형
//    	this.setDefComboValue('reserved_varcharc', 'valueField', 'EA');// 목형유형
    	
    	// this.setDefValue('pj_code', 'test');
    	this.callParent([]);
    	// 검색툴바 필드 초기화
    	this.initSearchField();
    	this.addSearchField('item_code');
    	
//		this.addSearchField ({
//			type: 'dateRange',
//			field_id: 'regist_date',
//			text: gm.getMC('CMD_Order_Date', '등록일자'),
//			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
//			edate: new Date()
//		});	
//		
//		this.addSearchField (
//		{
//			type: 'combo'
//			,field_id: 'status'
//			,store: "RecevedStateStore"
//			,displayField: 'codeName'
//			,valueField: 'systemCode'
//			,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
//		});	
//    	
		// 검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		// 명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.RecevedAddIDMgmt', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        gMain.pageSize/* pageSize */
        // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
    	// Orderby list key change
    	// ordery create_date -> p.create로 변경.
        ,{
        	creator: 'project.creator',
        	unique_id: 'project.unique_id'
        }
    	// 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['project']
		);

        // 그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||index==3) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
        this.setRowClass(function(record, index) {
        	
        	// console_logs('record', record);
            var c = record.get('status');
            var is_stop_flag = record.get('reserved20');
            // console_logs('c', c);
            switch(c) {
                case 'CR':
                	return 'yellow-row';
                	break;
                case 'P':
                	return 'orange-row';
                	break;
                case 'DE':
                case 'S':
                	return 'red-row';
                	break;
                case 'BM':
                	break;
                default:
                	if(is_stop_flag=='Y'){
                		return 'red-row';
                	}else{
                		return 'green-row';
                	}
                	
            }

        });
        
        //반려요청
        this.cancleAction = Ext.create('Ext.Action', {
  			 iconCls: 'af-reject',
  			 text: '반려',
  			 tooltip: '반려하기',
  			 disabled: true,
  			 handler: function(widget, event) {
//  	    			gMain.selPanel.pcsOutChange();

  	    		 }
  		});    
        
        
        buttonToolbar.insert(4, this.cancleAction);
        this.createGrid(arr);
        
        
        // 작업지시 Action 생성
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	if(this.crudMode=='EDIT') { // EDIT
	    		//console_logs('preCreateCallback', selections);
	    	} else {// CREATE,COPY
	    		this.copyCallback();

	    	}
        	
//        	gMain.selPanel.vSELECTED_UNIQUE_ID = vCUR_USER_UID*(100);
            if (selections.length) {
            	var rec = selections[0];
            	
                // gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('srcahd_uid');
				// //assymap의 child
            	
            	//console_logs('rec>>>>>>>>>>>>>>>>>>>>>>>',rec);
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_uid'); // assymap의 unique_id
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                gMain.selPanel.vSELECTED_BUYER_UID = rec.get('order_com_unique');
                gMain.selPanel.vSELECTED_ITEM_CODE = rec.get('item_code');
                gMain.selPanel.vSELECTED_STATUS = rec.get('status');
                
                gMain.selPanel.vSELECTED_BM_QUAN = rec.get('bm_quan');
                gMain.selPanel.vSELECTED_PAN_QTY = rec.get('reserved_double3');
                gMain.selPanel.vSELECTED_CHILD = rec.get('srcahd_uid');
                
                var status = rec.get('status');
                
            }
        });
        

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        

        this.callParent(arguments);
        

        // 디폴트 로딩
        gMain.setCenterLoading(false);// 스토아로딩에서는 Loading Message를 끈다.
        
        this.store.load(function(records) {});	
//        this.store.on('load',function (store, records, successful, eOpts ){
//       });
        

    },		
    
});
