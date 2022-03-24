/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.dabp01kr.executiveInfo.BusinessMonthAnal', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'businessMonth-anal-view',
    initComponent: function(){
    	
    	//this.initDefValue();
		
    	//생성시 디폴트 값.
//		this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
//		this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
//		this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
//		this.setDefValue('board_count', 0); //Hidden Value임.

		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		this.addSearchField (
		{
				field_id: 'div_code'
				,store: 'DivisionStore2'
				,displayField: 'division_name'
				,valueField: 'division_code'
				,innerTpl	: '<div data-qtip="{division_name}">[{division_code}] {division_name}</div>'
		});	
		
		this.addSearchField('mng_code');

        this.createStore('Rfx.model.BusinessMonthAnal', [{
            property: 'mng_code',
            direction: 'DESC'
        }],
        gMain.pageSize/* pageSize */
        ,{
        	creator: 'creator',
        	unique_id: 'unique_id'
        }
    	// 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    	, ['mnganl']
		);
        
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        
        (buttonToolbar.items).each(function(item,index,length){
	      	  if(index==1||index==3||index==4||index==5) {
	            	buttonToolbar.items.remove(item);
	      	  }
	        });
        
        this.setRowClass(function(record, index) {
        	
        	console_logs('record', record);
            var c = record.get('pcs_group_name');
            var is_stop_flag = record.get('reserved20');
             console_logs('c', c);
            switch(c) {
                case '합계':
                	return 'green-row';
                	break;
                default:
                	
            }

        });
        
        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            
            tooltip:'경영분석자료 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var div_code = gm.me().vSelected_divCode;
            	var mng_code = gm.me().vSelected_mngCode;
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printMa',
            		params:{
            			quter_flag : 'N',
            			div_code : div_code,
            			mng_code : mng_code,
            			pdfPrint : 'pdfPrint',
            			is_rotate : 'Y'

            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_logs(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	
            	
            }
        });
        
        
        
        buttonToolbar.insert(9, this.printPDFAction);
        
        
        // grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	var mainmenu = Ext.getCmp( 'recvPoview' + '-mainmenu' );
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('rec>>>>>>>>>>>>>>>>>>>>>>>',rec);
                
                var pcs_group_code = rec.get('pcs_group_code');
                gm.me().vSelected_divCode = rec.get('div_code');
                gm.me().vSelected_mngCode = rec.get('mng_code');
    			if(pcs_group_code=='SUM') {
    				gUtil.enable(gMain.selPanel.printPDFAction);
    			} else {
    				gUtil.disable(gMain.selPanel.printPDFAction);
    			}
            }

        });
        
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.storeLoad();
        

    },
});
