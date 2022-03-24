/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.HEAVY4_RecvPoDoorView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'heavy4-recvPoDoor-view',
    initComponent: function(){
    	
    	//this.initDefValue();
		
    	//생성시 디폴트 값.
		// this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);

		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		// this.addSearchField('user_id');

		this.addSearchField('item_name');
		this.addSearchField('pj_code');
		this.addSearchField('pj_name');
		this.addSearchField('description');
		
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델 정의
        // this.createStore('Rfx.model.HEAVY4_PCSSTD_VIEW', [{
	    //         property: 'unique_id',
	    //         direction: 'DESC'
	    //     }],
	    //     /*pageSize*/
	    //     gMain.pageSize
	    //     //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        // 	//Orderby list key change
        // 	//ordery create_date -> p.create로 변경.
	    //     ,{}
        // 	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        // 	, ['pcsstd']
		// 	);

			this.createStoreSimple({
                    modelClass: 'Rfx.model.HEAVY4_PCSSTD_VIEW',
                    pageSize: gMain.pageSize,/*pageSize*/
                    sorters: [{
                        property: 'serial_no',
                        direction: 'asc'
                    }]
                }, {
                    groupField: 'pj_code'
            });
				
		this.store.getProxy().setExtraParam('pcs_code', 'DOR');
		this.store.load();

		var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
            // id: 'group',
            // ftype: 'groupingsummary',
	        /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	        	groupHeaderTpl: '<font color=#003471>{name}</font>'
		}); 

        var option = {
				features: [groupingFeature]
		};
			
		(buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);
      	  }
        });
		
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGridCore(arr, option);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        
        //디폴트 로드
        gMain.setCenterLoading(false);
		//this.store.load(function(records){});
		this.loadStoreAlways = true;

    }
});
