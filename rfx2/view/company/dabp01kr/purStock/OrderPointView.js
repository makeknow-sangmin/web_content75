/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.dabp01kr.purStock.OrderPointView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'order-point-view',
    initComponent: function(){
    	
    	//this.initDefValue();
		
    	//생성시 디폴트 값.
		/*this.setDefValue('board_email', GLOBALvCUR_EMAIL);
		this.setDefValue('user_id', GLOBALvCUR_USER_ID);
		this.setDefValue('board_name', GLOBALvCUR_USER_NAME);
		this.setDefValue('board_count', 0); //Hidden Value임.
		switch(vSYSTEM_TYPE) {
		case 'MES':
			this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.
			break;
		case 'PLACE':
			this.setDefComboValue('gubun', 'valueField', 'notice');//ComboBOX의 ValueField 기준으로 디폴트 설정.
		}
*/

		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가

		this.addSearchField('납품일');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx.model.OrderPointTable', [{
	            property: 'id',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{}
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['board']
	        );

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        this.doSample();
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){});

    },
    items : [],
    doSample: function() {
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 1,
    		'creator' : '박평식',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 2,
    		'creator' : '박평식',
            'item_code' : 'AISI318',
            'item_name' : 'V.R.C',
            'specification' : '550X1000X130',
            'quan' : '300',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '1500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 3,
    		'creator' : '김준성',
    		'item_code' : 'AISI318',
            'item_name' : 'V.R.C',
            'specification' : '550X1000X130',
            'quan' : '300',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '1500',
            'start_date' : '<div style="background-color: #ff8492">D+1</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 4,
    		'creator' : '박평식',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 5,
    		'creator' : '김준성',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.24',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-7</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.11',
            'ord_handling_time' : '16.11.09',
            'pur_lead_time' : '16.11.08'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 6,
    		'creator' : '김준성',
    		'item_code' : 'AISI318',
            'item_name' : 'V.R.C',
            'specification' : '550X1000X130',
            'quan' : '300',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '1500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 7,
    		'creator' : '김준성',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 8,
    		'creator' : '박평식',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 9,
    		'creator' : '김준성',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 10,
    		'creator' : '안호영',
    		'item_code' : 'AISI318',
            'item_name' : 'V.R.C',
            'specification' : '550X1000X130',
            'quan' : '300',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.15',
            'static_sales_price' : '1500',
            'start_date' : '<div style="background-color: #ff8492">D+2</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 11,
    		'creator' : '박평식',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 12,
    		'creator' : '김준성',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 13,
    		'creator' : '안호영',
    		'item_code' : 'AISI318',
            'item_name' : 'V.R.C',
            'specification' : '550X1000X130',
            'quan' : '300',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '1500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 14,
    		'creator' : '박평식',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'id' : 15,
    		'creator' : '김준성',
            'item_code' : 'AISI316',
            'item_name' : 'ACTUATOR',
            'specification' : '500X300X50',
            'quan' : '500',
            'unit_code' : 'box',
            'supplier_name' : 'Scana Korea',
            'req_date' : '16.11.23',
            'static_sales_price' : '500',
            'start_date' : '<div style="background-color: #9cff72">D-6</div>',
            'assy_final_date' : '16.11.13',
            'man_lead_time' : '16.11.10',
            'ord_handling_time' : '16.11.08',
            'pur_lead_time' : '16.11.07'
    	}));
    }
    
});
