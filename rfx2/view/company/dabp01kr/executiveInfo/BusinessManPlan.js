/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.dabp01kr.executiveInfo.BusinessManPlan', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'businessan-plan-view',
    
    
    initComponent: function(){
//    	 var sdate = Ext.Date.add(new Date(), Ext.Date.MONTH, -1);
//         var edte = new Date();
         
     	//order by 에서 자동 테이블명 붙이기 켜기. 
//     	this.orderbyAutoTable = true;
//     	useMultitoolbar = false;
     	//검색툴바 필드 초기화
     	this.initSearchField();
     	//검색툴바 추가
     	
     	//this.addSearchField('unique_id');
     	//this.setDefComboValue('standard_flag', 'valueField', 'R');

     	
 		//명령툴바 생성
         var buttonToolbar = this.createCommandToolbar();
         var searchToolbar =  this.createSearchToolbar();
         
//         this.createStore('Rfx.model.BuyerSales', [{
//	            property: 'item_code',
//	            direction: 'ASC'
//	        }],
//	        gMain.pageSize/*pageSize*/
//	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
//	        ,{
//	        	item_code_dash: 's.item_code',
//	        	comment: 's.comment1'
//	        },
//	        ['srcahd']
//	        );
         this.createStoreSimple({
	    		modelClass: 'Rfx.model.PjSalesMan',
	    		sorters: [{
		        	property: 'pm_name',
		        	direction: 'ASC'
		        }],
		        pageSize: gMain.pageSize,/*pageSize*/
		        byReplacer: {
		        },
			        
		    }, {
		    	groupField: 'pm_name'
     });
     
        (buttonToolbar.items).each(function(item,index,length){
        	  if(index==1||index==2||index==3||index==4||index==5) {
              	buttonToolbar.items.remove(item);
        	  }
          });
        
//        this.setRowClass(function(record, index) {
//        	
//        	console_logs('record11111', record);
//            var c = record.get('combst_uid');
//             console_logs('c', c);
//            switch(c) {
//                case -1:
//                	return 'green-row';
//                	break;
//                default:
//                	
//            }
//
//        });

        
        var columns = [];
        for(var i=0;i < this.columns.length; i++) {
        	var o = this.columns[i];
        	o['locked'] = vCompanyReserved4 == 'KYNL01KR' ? false : true;
        	columns.push(o);
        }
        
        
        columns.push({
            text: '구 분',
            columns: [{
                text     : '영업사원명',
                width    : 130,
                sortable : false,
                dataIndex: 'pm_name'
            }, {
                text     : '구분',
                width    : 70,
                sortable : false,
                dataIndex: 'is_com_check',
                renderer: function(value) {
                    switch(value) {
                        case 'Y':
                        return '매출';
                        case 'N':
                        return '수주';
                        case 'S':
                        return '미납';
                        default:
                        return value;
                    }
                }
            }]
        });
	        
        var monthColumns = [];   
        
        
        for(var i=1; i<13; i++) {
            if(i < 10) {
                i = '0' + i;
            }
   
        	monthColumns.push( {
                text     : i+'월',
                width    : 107,
                sortable : false,
                dataIndex: 'month_' + i
            })
        }
        	//console_logs('i', i);
	        columns.push({
	            text: '월 정보',
	            columns: monthColumns
	        });
        
	    columns.push({
            text     : '합 계',
            width    : 130,
            sortable : false,
            dataIndex: 'sum',
            renderer: function(value) {
                if(value != null && value > 0) {
                    value = Ext.util.Format.number(value, '0,000');
                    return value;
                }
                return value;
            }
	            // text: '합 계',
	            // columns: [{
	            //     text     : '합 계',
	            //     width    : 130,
	            //     sortable : false,
	            //     dataIndex: 'sum'
	            // }, {
	            //     text     : '비율',
	            //     width    : 70,
	            //     sortable : false,
	            //     dataIndex: 'percent'
	            // }]
	    });
	    
        var target = new Date();
        
//        console_logs('----------------columns', columns);

        this.groupField = 'pm_name';
        this.groupDir = 'ASC';

        this.grid = Ext.create('Rfx.base.BaseGrid', {
            columns: columns,
            scroll:true,
            store: this.store,
            multiSelect: false,
//            selModel: Ext.create("Ext.selection.CheckboxModel",{}),
            //layout: 'fit',
            //forceFit: true,
            dockedItems: [buttonToolbar, searchToolbar],
            features: [{ ftype: 'grouping' }],
            viewConfig: {
                markDirty:false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,
                getRowClass: function(record, index) {
//                    var recv_flag = record.get('recv_flag');
                    var combst_uid = record.get('combst_uid');
                    switch(combst_uid) {
                        case -1 :
                            return 'green-row';
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
            }

        });

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                console_logs('테스트', selections);
            }
        });

        this.storeLoad = function() {
            var start_time = new Date();
            console.log('>>>> start_time >>>>', start_time);
            this.store.load(function(records) {
                console_logs('>>> recors', records);
                var pm_name = null;
                    total_price = 0;

                var array_pm_uid = [];

                for(var i=0; i<records.length; i++) {
                    var rec = records[i];
                        pm_uid = rec.get('pm_uid');
                    if(array_pm_uid != null && array_pm_uid.length > 0) {
                        var check = false;
                        for(var j=0; j<array_pm_uid.length; j++) {
                            var uid = array_pm_uid[j];
                            if(uid == pm_uid) {
                                check = true;
                            }
                        }
                        if(check == false) {
                            array_pm_uid.push(pm_uid);
                        }
                    } else {
                        array_pm_uid.push(pm_uid);
                    }
                }

                for(var i=0; i<array_pm_uid.length; i++) {
                    var index_uid = array_pm_uid[i];

                    for(var j=0; j<records.length; j++) {
                        var rec = records[j];
                            pm_uid = rec.get('pm_uid');
                            pm_name = rec.get('pm_name');
                        if(pm_uid == index_uid) {
                            var new_fields = [
                                {
                                    pm_name : pm_name,
                                    pm_uid:pm_uid,
                                    is_com_check : 'S'
                                }
                            ];

                            var is_com = rec.get('is_com_check');
                                datas = rec.get('month_data');
                                mon_data = datas.split(',');

                                sum_val = 0;
                                sum_val_N = 0;
                                sum_notIn = 0;

                                
                                for(var k=0; k<mon_data.length; k++) {
                                    var m_data = mon_data[k];
                                    index = m_data.split(':')[0];
                                    index_data = m_data.split(':')[1];
                                    
                                    if(is_com == 'Y') {
                                        sum_val = Number(sum_val) + Number(index_data);

                                        index_data = gm.me().addComma(index_data);
                                        rec.set('month_' + index, index_data);
                                        // sum_val = gm.me().addComma(sum_val);
                                        rec.set('sum', sum_val);
                                    } else { // N 인 경우
                                        var pre_value = 0;
                                        var N_rec = null;

                                        N_rec = records[j+1];
                                        pre_datas = N_rec.get('month_data');
                                        pre_data = pre_datas.split(',');
                                        pre_index = pre_data[k].split(':')[0];
                                        pre_data = pre_data[k].split(':')[1];


                                        // try {
                                        //     N_rec = records[j-1];
                                        //     // Y 인 데이터
                                        //     pre_datas = N_rec.get('month_data');
                                        //     pre_data = pre_datas.split(',');
                                        //     pre_index = pre_data[k].split(':')[0];
                                        //     pre_data = pre_data[k].split(':')[1];
                                        // } catch (error) {
                                        //     N_rec = records[j+1];
                                        //     pre_datas = N_rec.get('month_data');
                                        //     console_logs('>>>> dd?', N_rec.get('is_com_check'));
                                        //     pre_data = pre_datas.split(',');
                                        //     pre_index = pre_data[k].split(':')[0];
                                        //     pre_data = pre_data[k].split(':')[1];
                                        // }
                                        if(pre_data != null && pre_data.includes('.')) {
                                            pre_data = pre_data.split('.')[0];
                                        }
                                        if(index_data != null && index_data.includes('.')) {
                                            index_data = index_data.split('.')[0];
                                        }

                                        var total = Number(index_data) + Number(pre_data);

                                        sum_notIn = Number(sum_notIn) + Number(index_data);
                                        sum_val_N = Number(sum_val_N) + Number(total);
                                        // sum_val_N = gm.me().addComma(sum_val_N);
                                        rec.set('sum', sum_val_N);

                                        total = gm.me().addComma(total);
                                        index_data = gm.me().addComma(index_data);
                                        rec.set('month_' + index, total);

                                        var n = k;
                                        n++;
                                        if(n < 10) {
                                            n = '0' + n;
                                        }

                                        var field = 'month_' + n;

                                        new_fields[0][field] = index_data
                                        
                                    }
                                    
                                }

                                if(is_com == 'N') {
                                    sum_notIn = gm.me().addComma(sum_notIn);
                                    new_fields[0]['sum'] = sum_notIn;
                                    gm.me().store.add(new_fields);
                                }
                        }
                    }
                }

                // for(var i=0; i<records.length; i++) {
                //     var rec = records[i];
                //         name = rec.get('pm_name');
                //         is_com = rec.get('is_com_check');
                //         datas = rec.get('month_data');
                //         mon_data = [];
                //         mon_data = datas.split(',');
                //         for(var j=0; j<mon_data.length; j++) {
                //             var m_data = mon_data[j];
                //                 index = m_data.split(':')[0];
                //                 index_data = m_data.split(':')[1];
                //                 index_data = gm.me().addComma(index_data);
                            
                                
                //         }
                // }
                var end_time = new Date();
                console.log('>>>> end_time',end_time);
                var elapsed_time = end_time - start_time;
                console.log('>>>> elapsed_time(ms)',elapsed_time);
            })
        }



        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

       //버튼 추가.
       buttonToolbar.insert(2, '-');

        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	rec = selections[0];
                console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id');

           		gMain.selPanel.printBarcodeAction.enable();
             } else {

            	 gMain.selPanel.printBarcodeAction.disable();
             }
             })


        if(vCompanyReserved4 == 'KYNL01KR') {
            this.outqtyAction.enable();
        }

    if(vCompanyReserved4 != 'DABP01KR') {
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('year_month', gu.yyyymm(new Date(), '-'));
        this.storeLoad();
    }

    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL",
	storeLoadCallbackSub: function(records, store, model) {
		console_logs('Stockin', records);
    },
    
    addComma: function(num) {
        try {
            if(num != null && num.includes('.')) {
                num = num.split('.')[0];
            }
        } catch (error) {
            
        }
        
        var regexp = /\B(?=(\d{3})+(?!\d))/g;
        return num.toString().replace(regexp, ',');
    },


    outQty: function(){
        var form = null;

        form = Ext.create('Ext.form.Panel', {
            id: 'formPanel',
            xtype: 'form',
            frame: false ,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            items   : [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items   : [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '불출 개수',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype     : 'numberfield',
                                    id : 'pr_quans',
                                    name      : 'pr_quans',
                                    fieldLabel: '불출 개수',
                                    margin: '0 5 0 0',
                                    width: 200,
                                    allowBlank: false,
//	                                   emptyText: '영문대문자와 숫자만 입력',
//	                                   validator: function(v) {
//	                                       if (/[^A-Z0-9_-]/g.test(v)) {
//	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
//	                                       }
//	                                       this.setValue(v);
//	                                       return true;
//	                                   }  // end of validator
                                }  // end of xtype
                            ]  // end of itmes
                        }  // end of fieldcontainer
                    ]
                }
            ]

        });//Panel end...

        prwin = gMain.selPanel.prwinopen(form);

    },

    prwinopen: function(form) {
        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '불출 개수 지정',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    var stoqtyarr = [];
                    var srcahdarr = [];
                    var wh_qtys = [];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var uid =  rec.get('stoqty_uids');  //STOQTY unique_id
                        var srcahdUid = rec.get('unique_id');
                        var wh_qty = rec.get('wh_qty');
                        stoqtyarr.push(uid);
                        srcahdarr.push(srcahdUid);
                        wh_qtys.push(wh_qty);
                    }

                    form.submit({
                        url : CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequestGoDirect',
                        params:{
                            srcahdUids: srcahdarr,
                            stoqtyUids: stoqtyarr,
                            wh_qtys: wh_qtys,
                        },
                        success: function(val, action){
                            prWin.close();
                            gMain.selPanel.store.load(function(){});
                        },
                        failure: function(val, action){
                            prWin.close();
                        }
                    });


                }//btn handler
            },{
                text: CMD_CANCEL,
                handler: function(){
                    if(prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },
//    monthColumns:[]
});
