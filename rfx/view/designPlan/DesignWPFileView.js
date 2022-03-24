//디자인 파일
Ext.define('Rfx.view.designPlan.DesignWPFileView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'design-wp-file-view',
    
    //File첨부 폼
    attachform: null,
    vFILE_ITEM_CODE: null,
    
    initComponent: function(){
    	 
    	//수정할때 사용할 필드 이름.
    	this.setUpdateFieldName('ac_uid');
    	
    	this.vFILE_ITEM_CODE = gUtil.RandomString(10);
    	this.initDefValue();
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('reserved_timestamp7', next7);
    	this.setDefComboValue('pl_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.

		//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	var from_date = gUtil.getNextday(-7);
    	var to_date = new Date();
    	var registCont = gUtil.yyyymmdd(from_date) + ':' + gUtil.yyyymmdd(to_date);
//		this.addSearchField ({
//			type: 'dateRange',
//			field_id: 'regist_date',
//			text: gm.getMC('CMD_Order_Date', '등록일자'),
//			sdate: from_date,
//			edate: to_date
//		});	
		
//		this.addSearchField (
//		{
//			type: 'combo'
//			,field_id: 'status'
//			,store: "RecevedStateStore"
//			,displayField: 'codeName'
//			,valueField: 'systemCode'
//			,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
//		});	
    	
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		
		/*
		 	{key: 'SEARCH', text: CMD_SEARCH/*'검색'*/},
	        {key: 'REGIST', text: '신규등록'},
	       	{key: 'EDIT', 	text: gm.getMC('CMD_MODIFY', '수정')},
	       	{key: 'COPY', 	text: '복사등록'},
	       	{key: 'REMOVE', text: gm.getMC('CMD_DELETE', '삭제')},
	       	{key: 'VIEW', 	text: '보기'}
		 */
		
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : [
        	       
        	]
        	,RENAME_BUTTONS : [
        	        { key: 'EDIT', text: '목형관리'},
        	        { key: 'REMOVE', text: '폐기'}
        	]
        });
        
        
//        buttonToolbar.insert(2, {
//        	iconCls: 'af-plus-circle',
//            xtype : 'button',
//            text : '등록',
//            toggleGroup: 'toolbarcmd',
//   			 handler: function() {
//   				 gMain.selPanel.setActiveCrudPanel('CREATE');
//   			 }
//        });
//        buttonToolbar.insert(3, {
//        	iconCls: 'af-edit',
//            xtype : 'button',
//            text : '수정'
//        });
//        buttonToolbar.insert(4, {
//        	iconCls: 'af-remove',
//            xtype : 'button',
//            text : 'Folder 삭제'
//        });
//        // remove the items
//        (buttonToolbar.items).each(function(item,index,length){
//        	if(index==1) {
//            	buttonToolbar.items.remove(item);        		
//        	}
//
//        	if(index==4) {
//            	buttonToolbar.items.remove(item);        		
//        	}
//        	if(index==5) {
//            	buttonToolbar.items.remove(item);        		
//        	}
//
//        });
        
        //모델 정의
        this.createStore('Rfx.model.WoodenPatternMgmt', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['srcahd']
	        );
        
        //상태가 BM이 아닐 것.
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
//        arr.push(dateToolbar);
        arr.push(searchToolbar);
        
        this.setRowClass(function(record, index) {
        	
//        	 console_logs('record', record);
            var c = record.get('srccst_cnt');
            // console_logs('c', c);
            if(c==0){
            	
            }else{
            	return 'green-row';
            }
        });
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();
        
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	console_logs('setGridOnCallback selections', selections);
        	var rec = selections[0];
        	gMain.selPanel.vSELECTED_RECORD = rec;
        	console_logs('gMain.selPanel.vSELECTED_RECORD >>>>>>>>>>>>>>>>',gMain.selPanel.vSELECTED_RECORD);
        	if(rec!=undefined && rec!=null) {
            	gMain.loadFileAttach(rec.get('srcahd_uid'), gMain.selectedMenuId + 'designFileAttach');        		
        	}

        });
        

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        //파일첨부 그리드탭 추가
		gMain.addTabFileAttachGridPanel('파일', 'FILE_ATTACH', {NO_INPUT: null}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	//console_logs(rec);
	            } else {
	            	
	            }
	        },
	        gMain.selectedMenuId + 'designFileAttach',
	        {
	        	selectionchange: function(sm, selections) {        		
	        		var fileRecord = (selections!=null && selections.length>0) ? selections[0] : null;
	        		console_logs(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
	        		
	        		var delButton = Ext.getCmp(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
	        		if(fileRecord==null) {
	        			gUtil.disable(delButton);
	        		} else {
	        			gUtil.enable(delButton);
	        		}
	        		
	        	}
	        }
		);

        this.callParent(arguments);

        
//        this.store.on('load',function (store, records, successful, eOpts ){
//        	gMain.selPanel.StoreLoadRecordSet(records);
//       });
        //디폴트 로드
        gMain.setCenterLoading(false);
//        this.store.getProxy().setExtraParam('regist_date',  registCont);
        this.storeLoad = function() {
            this.store.load(function(records) {
//
//            	for(var i=0; i<records.length; i++) {
//            		var rec = records[i];
//            		
//            		var item_name_r1 = rec.get('item_name_r1'); 
//            		var item_name_r2 = rec.get('item_name_r2');
//            		var item_name_u = rec.get('item_name_u');
//
//            		var specification_r1 = rec.get('specification_r1');
//            		var specification_r2 = rec.get('specification_r2');
//            		var specification_u = rec.get('specification_u');
//            		
//            		var description_r1 = rec.get('description_r1');
//            		var description_r2 = rec.get('description_r2');
//            		var description_u = rec.get('description_u');
//            		
//            		var comment_r1 = rec.get('comment_r1');
//            		var comment_r2 = rec.get('comment_r2');
//            		var comment_u = rec.get('comment_u');
//
//            		var remark_r1 = rec.get('remark_r1');
//            		var remark_r2 = rec.get('remark_r2');
//            		var remark_u = rec.get('remark_u');
//            		rec.set('item_name|1', item_name_r1);
//            		rec.set('item_name|2', item_name_r2);
//            		rec.set('item_name|3', item_name_u);
//            		
//            		rec.set('specification|1', specification_r1);
//            		rec.set('specification|2', specification_r2);
//            		rec.set('specification|3', specification_u);
//            		
//            		rec.set('description|1', description_r1);
//            		rec.set('description|2', description_r2);
//            		rec.set('description|3', description_u);
//            		
//            		rec.set('comment|1', comment_r1);
//            		rec.set('comment|2', comment_r2);
//            		rec.set('comment|3', comment_u);
//            		
//            		rec.set('remark|1', remark_r1);
//            		rec.set('remark|2', remark_r2);
//            		rec.set('remark|3', remark_u);
//            		
            		//console_logs('rec', rec);
//            	}
            	

              });
        };
        this.storeLoad();
    },
    items : [],
    fileNolink : false,
//    StoreLoadRecordSet: function(records){
//       	for(var i=0; records!=null && i<records.length; i++) {
//    		var rec = records[i];
//    		var class_code = rec.get("class_code");
//    		
//    		var item_name_r1 = rec.get('item_name_r1'); 
//    		var item_name_r2 = rec.get('item_name_r2');
//    		var item_name_u = rec.get('item_name_u');
//
//    		var specification_r1 = rec.get('specification_r1');
//    		var specification_r2 = rec.get('specification_r2');
//    		var specification_u = rec.get('specification_u');
//    		
//    		var description_r1 = rec.get('description_r1');
//    		var description_r2 = rec.get('description_r2');
//    		var description_u = rec.get('description_u');
//    		
//    		var comment_r1 = rec.get('comment_r1');
//    		var comment_r2 = rec.get('comment_r2');
//    		var comment_u = rec.get('comment_u');
//
//    		var remark_r1 = rec.get('remark_r1');
//    		var remark_r2 = rec.get('remark_r2');
//    		var remark_u = rec.get('remark_u');
//    		
//    		var bm_quan_r1 = rec.get('bm_quan_r1');
//    		var bm_quan_r2 = rec.get('bm_quan_r2');
//    		var bm_quan_u = rec.get('bm_quan_u');
//
//    		var request_comment1 = rec.get('request_comment1');
//    		var request_comment2 = rec.get('request_comment2');
//    		var delivery_info = rec.get('delivery_info');
//    		var reserved_varchare = rec.get('reserved_varchare');
//    		var order_com_unique = rec.get('order_com_unique');
//    		
//    		var pm_uid=rec.get('pm_uid');
//    		var req_info1=rec.get('req_info1');
//    		var req_info2=rec.get('req_info2');
//    		
//    		rec.set('item_name|1', item_name_r1);
//    		rec.set('item_name|2', item_name_r2);
//    		rec.set('item_name|3', item_name_u);
//    		
//    		rec.set('specification|1', specification_r1);
//    		rec.set('specification|2', specification_r2);
//    		rec.set('specification|3', specification_u);
//    		
//    		rec.set('description|1', description_r1.replace(/,/gi,""));
//    		rec.set('description|2', description_r2);
//    		rec.set('description|3', description_u);
//    		
//    		rec.set('comment|1', comment_r1.replace(/,/gi,""));
//    		rec.set('comment|2', comment_r2.replace(/,/gi,""));
//    		rec.set('comment|3', comment_u);
//    		
//    		rec.set('remark|1', remark_r1.replace(/,/gi,""));
//    		rec.set('remark|2', remark_r2.replace(/,/gi,""));
//    		rec.set('remark|3', remark_u);
//    		
//    		rec.set('bm_quan|1', bm_quan_r1);
//    		rec.set('bm_quan|2', bm_quan_r2);
//    		rec.set('bm_quan|3', bm_quan_u);
//    		
//    		rec.set('req_info|1', req_info1);
//    		rec.set('req_info|2', req_info2);
//    		
//    		rec.set('request_comment|1', request_comment1);
//    		rec.set('request_comment|2', request_comment2);
//    		
//    		rec.set('delivery_info', delivery_info);
//    		rec.set('reserved_varchare', reserved_varchare);
//    		rec.set('pm_uid', pm_uid);
//    		rec.set('order_com_unique', order_com_unique);
//    		
//    		rec.set('class_code', class_code);
////    		 console_logs('rec', rec);
////    		 console_logs('records', records);
//    	}
//    },
});
