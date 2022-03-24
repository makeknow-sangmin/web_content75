//디자인 파일
Ext.define('Rfx.view.designPlan.DocuFileView_CHNG', {
    extend: 'Rfx.base.BaseView',
    xtype: 'docu-file-view',
    
    //File첨부 폼
    attachform: null,
    vFILE_ITEM_CODE: null,
    
    initComponent: function(){
    	//order by 에서 자동 테이블명 붙이기 끄기. 
    	this.orderbyAutoTable = false;
    	
    	this.setDefValue('regist_date', new Date());

    	//삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('delivery_plan', next7);
    	
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	var useMultitoolbar = true;
		this.addSearchField ({
			type: 'dateRange',
			field_id: 'regist_date',
			text: gm.getMC('CMD_Order_Date', '등록일자'),
			sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
			edate: new Date()
		});	
		
		this.addSearchField ({
			type: 'combo',
			field_id: 'status'
			,store: "RecevedStateStore"
			,displayField: 'codeName'
			,valueField: 'systemCode'
			,emptyText: '진행상태'
			,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
		});	
		
		this.addSearchField (
		{
			type: 'combo'
			,field_id: 'wa_name'
			,store: "BuyerStore"
			,displayField: 'wa_name'
			,valueField: 'wa_name'
			,emptyText: '고객사'
			,innerTpl	: '<div data-qtip="{wa_name}">{wa_name}</div>'
		});
		
		this.addSearchField (
		{
			type: 'area'
			,field_id: 'tag_no'
			,emptyText: 'TAG NO'
		});
		this.addSearchField (
				{
					type: 'area'
					,field_id: 'pj_code'
					,emptyText: 'SPOOL NO'
				});


		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : [
        	       'REGIST', 'COPY', 'REMOVE'
        	],
        	RENAME_BUTTONS : [
        	        { key: 'EDIT', text: '파일첨부'}
        	]
        });
        
        
        //모델 정의
        this.createStore('Rfx.model.HEAVY4RecvPoViewModelChng', [{
	            property: 'pj_code',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'a.creator',
	        	unique_id: 'a.unique_id'
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['assymap']
	        );
        
        //상태가 BM이 아닐 것.
        
        //파일이 첨부되었다면, row 색깔을 다르게 준다.
        this.setRowClass(function(record, index) {
        	
            var c = record.get('file_ext');
            // console_logs('c', c);
            switch(c) {
                case 'jpg':
                	return 'yellow-row';
                	break;
                default:
                	break;;
            }

        });
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        //검색툴바 생성
    	if(	useMultitoolbar == true ) {
    		var multiToolbar =  this.createMultiSearchToolbar({first:7, length:8});
    		console_logs('multiToolbar', multiToolbar);
            for(var i=0; i<multiToolbar.length; i++) {
        		arr.push(multiToolbar[i]);
            }
    	} else {
    		var searchToolbar =  this.createSearchToolbar();
    		arr.push(searchToolbar);
    	}

        console_logs('arr', arr);
//        this.setRowClass(function(record, index) {
//        	
//    		var r = record.get('fields');
//    		var rowid = record.get('assymap_uid');
//    		var color = record.get(r);
//    		//console_logs('r', r);
//    		//console_logs('color', color);
//    		
//    		/*if(color == ''){
//    			return 'orange-row';
//    		}*/
//    		
//    		if(r!=''){
//    			return 'yellow-row';
//    		}
//        });	
    	this.tab_info = []; 
    	this.tab_info.push({
       		code: 'CHNS',
       		name: '삼성',
       		title: '삼성',
       	});
    	
    	this.tab_info.push({
       		code: 'CHNG',
       		name: '기타',
       		title: '기타',
       	});
    	var ti = this.tab_info;
        for(var i=0; i<ti.length; i++) {
        	console_logs('vCompanyReserved4>>>>>>>>>>>>>>>>>>>>>>>', vCompanyReserved4);
        	switch(vCompanyReserved4){
        		default:
        			var tab = ti[i];
        			console_logs('this.tab',tab);
        			console_logs('this.columns_map',this.columns_map);
        	
        			var tab_code = tab['code'];
        			var myColumn = this.columns_map[tab_code];
        			var myField =  this.fields_map[tab_code];
        			var pos = tab_code=='STL'? 6:5;
//        			this.addExtraColumnBypcscode(myColumn, myField, tab_code, 'end_date', true, pos);        		
 
        	}
        }

        //grid 생성.
        this.createGrid(arr);
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	this.fileNolink = 'false';
        	console_logs('selections', selections);
        	console_logs('gm.me().selected_tab', gm.me().selected_tab);
        	console_logs('info...	', gm.me().tab_info);
        	console_logs('setGridOnCallback selections', selections);
        	var rec = selections[0];
        	gMain.selPanel.vSELECTED_RECORD = rec;
        	console_logs('gMain.selPanel.vSELECTED_RECORD >>>>>>>>>>>>>>>>',gMain.selPanel.vSELECTED_RECORD);
        	if(rec!=undefined && rec!=null) {
//            	gMain.loadFileAttach(rec.get('ac_uid'), gMain.selectedMenuId + 'designFileAttach');
        		gMain.loadFileAttach(rec.get('unique_id'), gMain.selectedMenuId + 'designFileAttach');
        	}

        	var code = gm.me().selected_tab;
        	console_logs('code++++++++++++++++', code);
//        	if(code!=undefined) {
//            	gm.me().tab_selections[code] = selections;
//        	}
        	
        	
        	var toolbar = null;
        	var items = null;
        	if(code!=undefined) {
        		var infos = gm.me().tab_info;
        		console_logs('infos', infos);
        		if(infos!=null) {
        			for(var i=0; i<infos.length; i++) {
        				var o = infos[i];
        				if(o['code'] == code) {
        					var toolbars = o['toolbars'];
//        					toolbar = toolbars[0];
//        					items = toolbar.items.items;
        				}
            			
        			}
        		}
        		
        	}
        	
        	console_logs('toolbar', toolbar);
        	console_logs('toolbar items', items);
        	
//            if (selections.length) {
//            	
//            	var rec = selections[0];
//
//            }

        });
        
        
        //입력/상세 창 생성.
        this.createCrudTab();
        console_logs('tab_info', this.tab_info);
        //Tab을 만들지 않는 경우.
	    if(this.tab_info.length==0/* || vCompanyReserved4=='SHNH01KR' || vCompanyReserved4=='DDNG01KR'*/) {
            
	    	Ext.apply(this, {
                layout: 'border',
                items: [this.grid,  this.crudTab]
            });
	    	
	
	    } else {
	      
	    	var items = [];
	    	var tab = this.createTabGrid('Rfx.model.HEAVY4RecvPoViewModelChng', items, 'FLAG', arr, function(curTab, prevtab) {
	        	var multi_grid_id = curTab.multi_grid_id;
	    		gm.me().multi_grid_id = multi_grid_id;
	    		
//	        	console_logs('multi_grid_id: ',  multi_grid_id);
	        	
	        	if(multi_grid_id == undefined) { //Main grid
	        	
	        	} else {//추가 탭그리드
	        		var store = gm.me().store_map[multi_grid_id];
	        		switch(multi_grid_id) {
	        		case 'CHNG':
	        			gm.me().store.getProxy().setExtraParam('FLAG', 'G');
	        			gm.me().store.getProxy().setExtraParam('req_flag', 'G');
	        			break;
	        		case 'CHNS':
	        			gm.me().store.getProxy().setExtraParam('FLAG', 'S');
	        			gm.me().store.getProxy().setExtraParam('req_flag', 'S');
	        			break;
	        		}
		        		store.load(function(records) {
		        		});
	        	}
	        	
	        });
	    }
	    	//모든 스토어에 디폴트 조건
	        Ext.apply(this, {
	            layout: 'border',
	            items: [tab,  this.crudTab]
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

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.storeLoad();
	    },
	   
	    
//        this.storeLoad(function(records){
//        	console_logs('디폴트 데이터',  main);
//     	   for(var i=0; i < records.length; i++){
//     		   var specunit = records[i].get('specification');
//     		   gm.me().spec.push(specunit);
//     		 
//     	   }
//        });
//         
//  
//    	
//        this.callParent(arguments);
//        //디폴트 로드
//        gMain.setCenterLoading(false);
//    }
//    }
});
