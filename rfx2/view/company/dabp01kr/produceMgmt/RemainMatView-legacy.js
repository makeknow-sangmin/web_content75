/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.RemainMatView-legacy', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'remain-mat-view-legacy',
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
			
		this.addSearchField('pj_code');
		this.addSearchField('vestige_num');
		this.addSearchField('spar_num');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        this.createStore('Rfx.model.RemainMatTable', [{
	            property: 'create_date',
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
        this.doSample();
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
        this.store.load(function(records){});

    },
    items : [],
    doSample: function() {
    	/*this.store.insert(0,new Ext.data.Record({
      		'id': 1,
            'pj_code' : 'SN2126VD1P910AT07',
            'vestige_num' : 'C2126P910AHB200C01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '200X200X8X12X1300',
            'bm_quan' : '1',
            'mass' : '64.9', 
            'spar_num' : '2126HB200CJ81150SN',
            //'storage_place' : '청룡산업㈜', 
            'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1252'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 2,
            'pj_code' : 'SN2126VD1P910AT07',
            'vestige_num' : 'C2126P910AHB200C01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '200X200X8X12X1300',
            'bm_quan' : '1',
            'mass' : '64.9', 
            'spar_num' : '2126HB200CJ81150SN',
            //'storage_place' : '청룡산업㈜', 
            'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1252'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 3,
            'pj_code' : 'SN2126VD1P910AT11',
            'vestige_num' : 'A2126P910AHB200A01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '200X100X5.5X8X13500',
            'bm_quan' : '1',
            'mass' : '288', 
            'spar_num' : '2126HB200AJ81160SN',
            //'storage_place' : '청룡산업㈜', 
            'request_comment' : '재사용후 신규잔재발생', 
            'pj_code2' : 'COV-1252'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 4,
            'pj_code' : 'SN2126VD1S310AT03',
            'vestige_num' : 'A2126S310AHB200A01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '200X100X5.5X8X11900',
            'bm_quan' : '1',
            'mass' : '253', 
            'spar_num' : 'A2126P910AHB200A01',
            //'storage_place' : '청룡산업㈜', 
            //'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1252'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 5,
            'pj_code' : 'SN2126VD1S310AT05',
            'vestige_num' : 'A2126S310AHB300A02',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '300X150X6.5X9X5600',
            'bm_quan' : '1',
            'mass' : '206', 
            'spar_num' : '2126HB300AJ81090SN',
            //'storage_place' : '청룡산업㈜', 
            //'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1252'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 6,
            'pj_code' : 'SN2126VD1P910AT07',
            'vestige_num' : 'C2126P910AHB200C01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '200X200X8X12X1300',
            'bm_quan' : '1',
            'mass' : '64.9', 
            'spar_num' : '2126HB200CJ81150SN',
            //'storage_place' : '청룡산업㈜', 
          //  'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1312'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 7,
            'pj_code' : 'SN2126VD1S310AT07',
            'vestige_num' : 'C2126S310AHB150C01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '150X150X7X10X1800',
            'bm_quan' : '1',
            'mass' : '56.7', 
            'spar_num' : '2126HB150CJ81100SN',
            //'storage_place' : '청룡산업㈜', 
            //'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1312'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 8,
            'pj_code' : 'SN2126VD1S310AT10',
            'vestige_num' : 'A2126S310API114L01',
            'serial' : 1,
            'hard_class' : 'PI',
            'material_name' : 'API5L-X52-PSL2',
            'specification' : '114.3X6.4X11000',
            'bm_quan' : '1',
            'mass' : '186', 
            'spar_num' : '2126PI114LPB3125SA',
            //'storage_place' : '청룡산업㈜', 
          //  'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1312'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 9,
            'pj_code' : 'SN2126VD1S310AT11',
            'vestige_num' : 'A2126S310AHB100B01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '100X100X6X8X7400',
            'bm_quan' : '1',
            'mass' : '127', 
            'spar_num' : '2126HB100BJ81130SN',
            //'storage_place' : '청룡산업㈜', 
          //  'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1312'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 10,
            'pj_code' : 'SN2126VD1S310AT13',
            'vestige_num' : 'A2126S310AHB250A02',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '250X125X6X9X8000',
            'bm_quan' : '1',
            'mass' : '237', 
            'spar_num' : '2126HB250AJ81150SN',
            //'storage_place' : '청룡산업㈜', 
           // 'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1312'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 11,
            'pj_code' : 'SN2126VD1S310AT16',
            'vestige_num' : 'A2126S310AHB200C02',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '200X200X8X12X10700',
            'bm_quan' : '1',
            'mass' : '534', 
            'spar_num' : '2126HB200CJ81150SN',
           // 'storage_place' : '청룡산업㈜', 
           // 'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1312'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 12,
            'pj_code' : 'SN2126VD1C010BT01',
            'vestige_num' : 'C2126C010BHB200A01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '200X100X5.5X8X1800',
            'bm_quan' : '1',
            'mass' : '38.3', 
            'spar_num' : 'A2126S310AHB200A01',
           // 'storage_place' : '청룡산업㈜', 
            //'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1403'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 13,
            'pj_code' : 'SN2126VD1C010BT02',
            'vestige_num' : 'A2126C010BHB150C01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '150X150X7X10X4900',
            'bm_quan' : '1',
            'mass' : '154', 
            'spar_num' : '2126HB150CJ81150SN',
            //'storage_place' : '청룡산업㈜', 
            //'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1403'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 14,
            'pj_code' : 'SN2126VD1S610AU06',
            'vestige_num' : 'B2126S610API114L01',
            'serial' : 1,
            'hard_class' : 'PI',
            'material_name' : 'API5L-X52-PSL2',
            'specification' : '114.3X6.4X2500',
            'bm_quan' : '1',
            'mass' : '42.3', 
            'spar_num' : '2126PI114LPB3090SA',
            //'storage_place' : '청룡산업㈜', 
           // 'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1403'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 15,
            'pj_code' : 'SN2126VD1S610AU07',
            'vestige_num' : 'A2126S610AHB200A03',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '200X100X5.5X8X4600',
            'bm_quan' : '1',
            'mass' : '98', 
            'spar_num' : '2126HB200AJ81100SN',
           // 'storage_place' : '청룡산업㈜', 
            //'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1430'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 16,
            'pj_code' : 'SN2126VD1S610AU08',
            'vestige_num' : 'A2126S610API168M01',
            'serial' : 1,
            'hard_class' : 'PI',
            'material_name' : 'V-5L X52 PSL2',
            'specification' : '168.3X7.9X5800',
            'bm_quan' : '1',
            'mass' : '182', 
            'spar_num' : '7108PI168MPB8120SV',
           // 'storage_place' : '청룡산업㈜', 
           // 'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1430'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 17,
            'pj_code' : 'SN2126VD1S610AU12',
            'vestige_num' : 'A2126S610AHB200C02',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '200X200X8X12X11600',
            'bm_quan' : '1',
            'mass' : '579', 
            'spar_num' : '2126HB200CJ81150SN',
          //  'storage_place' : '청룡산업㈜', 
          //  'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1430'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 18,
            'pj_code' : 'SN2126VD1S610AU13',
            'vestige_num' : 'B2126S610AHB100B01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '100X100X6X8X2200',
            'bm_quan' : '1',
            'mass' : '37.8', 
            'spar_num' : '2126HB100BJ81160SN',
          //  'storage_place' : '청룡산업㈜', 
          //  'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1430'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 19,
            'pj_code' : 'SN2126VD1S610AU17',
            'vestige_num' : 'A2126S610AHB250A04',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '250X125X6X9X10900',
            'bm_quan' : '1',
            'mass' : '323', 
            'spar_num' : '2126HB250AJ81160SN',
          //  'storage_place' : '청룡산업㈜', 
          //  'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1430'
      	}));
        this.store.insert(0,new Ext.data.Record({
      		'id': 20,
            'pj_code' : 'SN2126VD1P610AT25',
            'vestige_num' : 'B2126P610AHB150C01',
            'serial' : 1,
            'hard_class' : 'HB',
            'material_name' : 'SM490YB',
            'specification' : '150X150X7X10X3300',
            'bm_quan' : '1',
            'mass' : '104', 
            'spar_num' : 'A2126C010BHB150C01',
          //  'storage_place' : '청룡산업㈜', 
          //  'request_comment' : '재사용후 소진', 
            'pj_code2' : 'COV-1510'
      	})); */
    }
});
