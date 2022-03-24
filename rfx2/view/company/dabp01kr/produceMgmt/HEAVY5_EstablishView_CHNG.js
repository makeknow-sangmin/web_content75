/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.dabp01kr.produceMgmt.HEAVY5_EstablishView_CHNG', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'establish-view',
    initComponent: function(){
    	
    	//this.initDefValue();
		
    	//생성시 디폴트 값.
//		this.setDefValue('board_email', /*GLOBAL*/vCUR_EMAIL);
//		this.setDefValue('user_id', /*GLOBAL*/vCUR_USER_ID);
//		this.setDefValue('board_name', /*GLOBAL*/vCUR_USER_NAME);
//		this.setDefValue('board_count', 0); //Hidden Value임.
//		switch(vSYSTEM_TYPE) {
//		case 'MES':
//			this.setDefComboValue('gubun', 'valueField', '0');//ComboBOX의 ValueField 기준으로 디폴트 설정.
//			break;
//		case 'PLACE':
//			this.setDefComboValue('gubun', 'valueField', 'notice');//ComboBOX의 ValueField 기준으로 디폴트 설정.
//		}

		//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	//검색툴바 추가
		this.addSearchField ({
            type: 'dateRange',
            field_id: 'req_date',
            text:'기간:',
            labelWidth: 50,
            sdate: new Date(),
            edate: Ext.Date.add(new Date(), Ext.Date.MONTH, 1)
    	});
		
		this.addSearchField (
				{
						field_id: '담당'
						,store: 'BoardGubunStore'
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
				});	
		
		this.addSearchField (
				{
						field_id: '고객사'
						,store: 'BoardGubunStore'
						,displayField: 'codeName'
						,valueField: 'systemCode'
						,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
				});	

		this.addSearchField('제품명');

		this.addSearchField ({
            type: 'checkbox',
            field_id: 'exclude_complete',
            items: [
            	{
            		boxLabel: '완료제외',
            		pressed: true,
            	},
            ],
    	});

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
        	REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        
        //모델 정의
        this.createStore('Rfx.model.Establish', [{
	            property: 'create_date',
	            direction: 'DESC'
	        }],
	        /*pageSize*/
	        gMain.pageSize
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
        		// 특정한 테이블의 경우 에러가 발생하는데, 이 때 테이블의 이름을 지정할 때 사용한다.
//	        	board_content: 'b.board_content',
//	        	board_count: 'b.board_count',
//	        	board_email: 'b.board_email',
//	        	board_title: 'b.board_title',
//	        	create_date: 'b.create_date',
//	        	creator: 'b.creator',
//	        	gubun: 'b.gubun',
//	        	unique_id: 'b.unique_id',
//	        	user_id: 'b.user_id'
	        }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['board'] // delete문에서 사용할 테이블을 지정한다. 단, 앞에 J2_혹은 J3_는 붙이지 않는다.
	        );
        
        var columns = [];
        
        //수주내역
        var drawingNumber = {
        		text: '도면번호',
        		width: 90,
        		sortable: false,
        		dataIndex: 'alter_item_code',
        		style: 'background-color:#214e96;text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'count',
        		summaryRenderer: function(value, summaryData, dataIndex) {
                    return  isNaN(value) ? '건' : value + ' 건';
                },
        };
        
        var periodDeliveryA = {
        		text: '납기일',
        		width: 70,
        		sortable: false,
        		dataIndex: 'req_date',
        		style: 'background-color:#214e96;text-align:center',
        		locked: false,
        		align: 'center'
        };
        
        var totalWeight = {
        		text: '중량',
        		width: 70,
        		sortable: false,
        		dataIndex: 'mass',
        		style: 'background-color:#214e96;text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        		summaryRenderer: function(value, summaryData, dataIndex) {
                    return  isNaN(value) ? 'Kg' : value + ' Kg';
                },
        };
        
        var obtainOrder = {
        		style: 'background-color:#214e96;text-align:center',
        		text: '수주내역',
        		locked: false,
        		columns: [drawingNumber, periodDeliveryA, totalWeight]
        };
        
        columns.push(obtainOrder);
        
        
        // 수금
        var periodDeliveryB = {
        		text: '납품일',
        		width: 70,
        		sortable: false,
        		dataIndex: 'assy_final_date',
        		style: 'background-color:#498e41;text-align:center',
        		locked: false,
        		align: 'center'
        };
        
        var collectionDay = {
        		text: '수금일',
        		width: 70,
        		sortable: false,
        		dataIndex: 'collection_date',
        		style: 'background-color:#498e41;text-align:center',
        		locked: false,
        		align: 'center'
        };
        
        var unitPriceA = {
        		text: '단가',
        		width: 70,
        		sortable: false,
        		dataIndex: 'sales_price',
        		style: 'background-color:#498e41;text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum'
        };
        
        var collectionAmount = {
        		text: '수금액',
        		width: 70,
        		sortable: false,
        		dataIndex: 'collection_amount',
        		style: 'background-color:#498e41;text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum'
        };
        
        var collection = {
        		text: '수금',
        		style: 'background-color:#498e41;text-align:center',
        		locked: false,
        		columns: [periodDeliveryB, collectionDay, unitPriceA, collectionAmount]
        };
        
        columns.push(collection);
        
        
     // 지급
        var totalAmount = {
        		text: '총액',
        		width: 70,
        		sortable: false,
        		dataIndex: 'sales_amount_str',
        		style: 'background-color:#449bd6;text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum'
        };
        
        var provideMoney = {
        		text: '기 지급',
        		width: 70,
        		sortable: false,
        		dataIndex: 'provide_money',
        		style: 'background-color:#449bd6;text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum'
        };
        
        var provide = {
        		text: '지급',
        		style: 'background-color:#449bd6;text-align:center',
        		locked: false,
        		columns: [totalAmount, provideMoney]
        };
        
        columns.push(provide);
        
        for(var i=0 ; i<gUtil.mesStdProcess.length; i++) {
        	var o = gUtil.mesStdProcess[i];
        	
        	 var completeDayB = {
             		text: '완료일',
             		width: 70,
             		sortable: false,
             		dataIndex: 'end_date' + [i],
             		style: 'text-align:center',
             		locked: false,
             		align: 'center'
             };
             
             var provideDayB = {
             		text: '지급일',
             		width: 70,
             		sortable: false,
             		dataIndex: 'provice_day' + [i],
             		style: 'text-align:center',
             		locked: false,
             		align: 'center'
             };
             
             var unitPriceC = {
             		text: '단가',
             		width: 70,
             		sortable: false,
             		dataIndex: 'sales_price' + [i],
             		style: 'text-align:center',
             		locked: false,
             		align: 'center',
             		summaryType: 'sum',
             };
             
             var priceB = {
             		text: '금액',
             		width: 70,
             		sortable: false,
             		dataIndex: 'price' + [i],
             		style: 'text-align:center',
             		locked: false,
             		align: 'center',
             		summaryType: 'sum',
             };
             
             var stamp = {
             		text: o['name'],
             		locked: false,
             		columns: [completeDayB, provideDayB, unitPriceC, priceB]
             };
             
             columns.push(stamp);
        	
        	/*columns.push({
				text: o['name'],
				cls:'rfx-grid-header', 
				resizable: true,
				autoSizeColumn : true,
				style: 'text-align:center',   
				style: {background:'orange'},
				align:'center'
			}); */
        }
        
    /* // 제작
        var completeDayA = {
        		text: '완료일',
        		width: 70,
        		sortable: false,
        		dataIndex: 'end_date',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var provideDayA = {
        		text: '지급일',
        		width: 70,
        		sortable: false,
        		dataIndex: 'provide_day',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var unitPriceB = {
        		text: '단가',
        		width: 70,
        		sortable: false,
        		dataIndex: 'sales_price',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var priceA = {
        		text: '금액',
        		width: 70,
        		sortable: false,
        		dataIndex: 'price',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var production = {
        		text: '제작',
        		locked: false,
        		columns: [completeDayA, provideDayA, unitPriceB, priceA]
        };
        
        columns.push(production);
        
     // 도장
        var completeDayB = {
        		text: '완료일',
        		width: 70,
        		sortable: false,
        		dataIndex: 'end_date',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var provideDayB = {
        		text: '지급일',
        		width: 70,
        		sortable: false,
        		dataIndex: 'provice_day',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var unitPriceC = {
        		text: '단가',
        		width: 70,
        		sortable: false,
        		dataIndex: 'sales_price',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var priceB = {
        		text: '금액',
        		width: 70,
        		sortable: false,
        		dataIndex: 'price',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var stamp = {
        		text: '도장',
        		locked: false,
        		columns: [completeDayB, provideDayB, unitPriceC, priceB]
        };
        
        columns.push(stamp);
        
        
     // 포장
        var completeDayC = {
        		text: '완료일',
        		width: 70,
        		sortable: false,
        		dataIndex: 'end_date',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var provideDayC = {
        		text: '지급일',
        		width: 70,
        		sortable: false,
        		dataIndex: 'provide_day',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var unitPriceD = {
        		text: '단가',
        		width: 70,
        		sortable: false,
        		dataIndex: 'sales_price',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var priceC = {
        		text: '금액',
        		width: 70,
        		sortable: false,
        		dataIndex: 'price',
        		style: 'text-align:center',
        		locked: false,
        		align: 'center',
        		summaryType: 'sum',
        };
        
        var packItems = {
        		text: '포장',
        		locked: false,
        		columns: [completeDayC, provideDayC, unitPriceD, priceC]
        };*/
        
        //columns.push(packItems);

       /* //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);*/
        
      //그리드 생성
        
        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
        
        this.doSample();
        this.grid = Ext.create('Rfx.base.BaseGrid', {
     	   features: [{
                id: 'group',
                ftype: 'groupingsummary',
                groupHeaderTpl: '{name}',
                hideGroupedHeader: true,
                enableGroupingMenu: true,
            }, {
                ftype: 'summary',
                dock: 'bottom'
            }],
            lockedViewConfig: {
                scroll: 'horizontal'
            },
             columns: columns,
             store: this.store,
             plugins: [cellEditing],
             dockedItems: [buttonToolbar, searchToolbar],
             scrollable : true,
             viewConfig: {
           	   	markDirty:false,
                 stripeRows: true,
                 enableTextSelection: false,
                 preserveScrollOnReload: true,
 	            getRowClass: function(record, index) {
 	            	var recv_flag = record.get('recv_flag');
 	            	switch(recv_flag) {
 	            	case 'EM' : 
 	            		return 'yellow-row';
 	            		break;
 	            	case 'SE':
 	            		return 'red-row';
 	            		break;
 	            	}
 	            }
              },
  			listeners: {
         		afterrender : function(grid) {
 					var elments = Ext.select(".x-column-header",true);
 					elments.each(function(el) {					
 								}, this);	
 					}
             		,
  				cellclick: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
  					this.selColIdx = iColIdx;
  					console_logs('iColIdx', this.selColIdx);
 			 		},
 			    edit: function (editor, e, eOpts) {
 			    	console_logs('record', e.record);
 			    	var idx = this.selColIdx; 	
 			    	var pos = Math.trunc(idx/2);
 			    	var type = idx%2 == 1 ? 'time' : 'human';
 			    	var name = type + (pos+1);
 			        var val = e.record.get(name);
 			        console.log(name, val);
 			    }
 			}
         });
        
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
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    	this.store.insert(0,new Ext.data.Record({
    		'alter_item_code' : 'A120T-SCP-00S300-011',
    		'req_date' : '16.09.20',
    		'mass' : 60.5,
    		'assy_final_date' : '16.09.20',
    		'collection_date' : '16.09.30',
    		'sales_price' : 5600,
    		'collection_amount' : 500560,
    		'sales_amount_str' : 300560,
    		'provide_money' : 300560,
    		'end_date0' : '16.08.20',
    		'provice_day0' : '16.09.10',
    		'sales_price0' : 1500,
    		'price0' : 60112,
    		'end_date1' : '16.08.20',
    		'provice_day1' : '16.09.20',
    		'sales_price1' : 1800,
    		'price1' : 60112,
    		'end_date2' : '16.08.20',
    		'provice_day2' : '16.09.30',
    		'sales_price2' : 1900,
    		'price2' : 60112,
    		'end_date3' : '16.08.20',
    		'provice_day3' : '16.09.30',
    		'sales_price3' : 2000,
    		'price3' : 60112,
    		'end_date4' : '16.08.20',
    		'provice_day4' : '16.09.30',
    		'sales_price4' : 1700,
    		'price4' : 60112
    	}));
    }
});
