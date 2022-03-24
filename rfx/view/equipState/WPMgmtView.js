//디자인 파일
Ext.define('Rfx.view.equipState.WPMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'wpmgmt-view',
    
    //File첨부 폼
    attachform: null,
    vFILE_ITEM_CODE: null,
    
    initComponent: function(){

		var location;
    	 
    	//수정할때 사용할 필드 이름.
//    	this.setUpdateFieldName('ac_uid');
    	
    	this.vFILE_ITEM_CODE = gUtil.RandomString(10);
    	this.initDefValue();
//    	var next7 = gUtil.getNextday(7);
//    	this.setDefValue('reserved_timestamp7', next7);
//    	this.setDefComboValue('pl_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.

		//검색툴바 필드 초기화
    	this.initSearchField();
    	
//    	var from_date = gUtil.getNextday(-7);
//    	var to_date = new Date();
//    	var registCont = gUtil.yyyymmdd(from_date) + ':' + gUtil.yyyymmdd(to_date);

    	this.addSearchField('item_name');
    	this.addSearchField('specification');
    	this.addSearchField('description');
    	//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
//        	REMOVE_BUTTONS : [
//        	       
//        	]
//        	,RENAME_BUTTONS : [
//        	        { key: 'EDIT', text: '목형관리'},
//        	        { key: 'REMOVE', text: '폐기'}
//        	]
        });
        
		// 수주번호 자동생성
		this.addCallback('AUTO_ITEMCODE', function(o){
				// 마지막 자재번호 가져오기
			   var target2 = gMain.selPanel.getInputTarget('item_code');
			   
			   var item_first ='M-';
			   
			   Ext.Ajax.request({
					url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
					params:{
						item_first: item_first,
						codeLength: 5,
						sp_code:'M'
					},
					success : function(result, request) {   	
						var result = result.responseText;
						
						
//						console_logs('result 2', result);
						
						target2.setValue(result);
						
					},// endofsuccess
					failure: extjsUtil.failureMessage
				});// endofajax
	    		
		});
        
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
        arr.push(searchToolbar);
        
		var current_win;
		var option = {
        		listeners : {
        			itemdblclick: function(dataview, record, item, index, e) {
        				if(current_win != undefined) {
        					current_win.hide();
        				}
						var rec = record;
						gMain.selPanel.vSELECTED_RECORD = rec;

        	        	if(rec!=undefined && rec!=null) {
        	        		gMain.returnPath(rec.get('unique_id'), gMain.selectedMenuId + 'designFileAttach',
        	        		function(r) {
        	        			location = r;
								var port_no = 0;
        	        			switch(window.location.hostname) {
        	        			case '192.168.1.203':
        	        			case 'localhost':
        	        			case '123.142.42.244':
        	        				port_no = 7080;
        	        				break;
        	        			default:
        	        				port_no = 7080;
        	        				break;
        	        			}
        	        			
        	        			var win = Ext.create('Ext.window.Window',{
                			        width : 640,
                			        height : 480,
                			        title : '목형 이미지 보기',
                			        html : ['<p style="text-align: center">',
                			        	'<img src="http://' + window.location.hostname + ':' + port_no + '/html/' + location +'" style="max-width: 640px; max-height: 480px;"/>',
                			        	'</p>']
								});
								console_logs('==>zcsda', win);
                				current_win = win;
                				current_win.show();
        	        		});
        	        	}
        	    	}
        		}
        };

        //grid 생성.
        this.createGridCore(arr, option);
        
        //입력/상세 창 생성.
        this.createCrudTab();
        
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	console_logs('setGridOnCallback selections', selections);
			var rec = selections[0];
        	gMain.selPanel.vSELECTED_RECORD = rec;
        	console_logs('gMain.selPanel.vSELECTED_RECORD >>>>>>>>>>>>>>>>',gMain.selPanel.vSELECTED_RECORD);
        	if(rec!=undefined && rec!=null) {
				console_logs('===>unique_id', rec.get('unique_id'));
				gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id');
            	gMain.loadFileAttach(rec.get('unique_id'), gMain.selectedMenuId + 'designFileAttach');        		
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
//        this.storeLoad = function() {
            this.store.load(function(records) {});
//        };
//        this.storeLoad();
    },
    items : [],
    fileNolink : false,
});
