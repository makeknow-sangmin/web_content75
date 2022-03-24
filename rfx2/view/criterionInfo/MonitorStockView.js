/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.criterionInfo.MonitorStockView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'stock-view',
    initComponent: function(){
    	
    	//this.initDefValue();
		//검색툴바 필드 초기화
    	this.orderbyAutoTable = true;
    	this.initSearchField();
    	//검색툴바 추가
		//this.addSearchField('unique_id');
		this.addSearchField('area_name');
		this.addSearchField('area_code');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx.model.MonitorStock', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	//ordery create_date -> p.create로 변경.
	        ,{
	        	unique_id: 'rfarea.unique_id',
	        	startPtX: 'rfarea.startPtX',
	        	startPtY: 'rfarea.startPtY',
	        	background: 'rfarea.background',
	        	area_code: 'rfarea.area_code',
	        	area_name: 'rfarea.area_name'
	        	
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['area']
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        //입력/상세 창 생성.
        this.createCrudTab();
        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        this.storeLoad();
        this.callParent(arguments); 
        //디폴트 로드
        gMain.setCenterLoading(false);
		//this.store.load(function(records){});
		this.loadStoreAlways = true;

    }
    /*items : [],
    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    	//console_logs('boardview itemdblclick record', record);  	
    	Rfx.model.MonitorStock.load(record.get('unique_id'), {
    	    success: function(area) {
            	console_logs('area', area);
    	    	var form = gm.me().createViewForm(area);
    	    	var win = Ext.create('ModalWindow', {
    	            title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
    	            width: 700,
    	            height: 530,
    	            minWidth: 250,
    	            minHeight: 180,
    	            layout: 'absolute',
    	            plain:true,
    	            items: form,
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
    	    	win.show();
    	    }
    	});
    	
    	
    },
    createViewForm: function (area) {
    	//Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
    	console_logs('area', area);
//    	var lineGap = 30;
     	var unique_id = area.get('unique_id');
    	var startPtX = area.get('startPtX');
    	var startPtY = area.get('startPtY');
    	var area_code = area.get('area_code');
    	var area_name = area.get('area_name');
    	var form = Ext.create('Ext.form.Panel', {
            defaultType: 'displayfield',
            bodyPadding: 3,
            height: 650,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 60
            },
            items: [{
	    			fieldLabel: 'UID',
	    			value: unique_id
    		    },{
    		    	fieldLabel: startPtX,
    		    	value: startPtX,
    		    },{
    		    	fieldLabel: 'startPtY',
    		    	value: startPtY
    		    },{
    		    	fieldLabel: '위치이름(코드)',
    		    	value: area_name+'('+area_code+')'
    		    }    
    		    ]
        }); //endof form
    	
    	return form;
    }*/
});
