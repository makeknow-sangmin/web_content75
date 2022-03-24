/**
 * 하나로 BOM 구성
 */
Ext.define('Hanaro.view.equipState.SpbomHanaroView', {
	extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'spbom-view',
    selected_product : null,
    initComponent: function(){
    	
    	this.multiSortHidden = true;
    	
    	this.commonUnitStore = Ext.create('Mplm.store.CommonUnitStore', {hasNull: false} );
    	this.commonCurrencyStore = Ext.create('Mplm.store.CommonCurrencyStore', {hasNull: false} );
    	this.commonModelStore = Ext.create('Mplm.store.CommonModelStore', {hasNull: false} );
    	this.commonDescriptionStore = Ext.create('Mplm.store.CommonDescriptionStore', {hasNull: false} );
    	this.commonStandardStore2  = Ext.create('Mplm.store.CommonStandardStore', {hasNull: false} );
    	this.GubunStore  = Ext.create('Mplm.store.GubunStore', {hasNull: false} );
    	
    	// 검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField('pj_name');

        this.createStore('Rfx2.model.company.hanaro.PartLine', [{
	            property: 'pl_no',
	            direction: 'ASC'
	        }],
	        gMain.pageSize/* pageSize */
	        // order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	// Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'a.creator',
	        	unique_id: 'a.unique_uid'
	        }
// //삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
         	, ['assymap']
         	
	        );
        
        this.addPcsPlanAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '공정 설계',
			 tooltip: '',
			 disabled: true,
			 
			 handler: function() {
				 
				 
			 }
		});
        
		this.removeAction = Ext.create('Ext.Action', {
			 iconCls: 'af-remove',
			 text: CMD_DELETE,
			 tooltip: '삭제하기',
			 disabled: true,
			 handler: function(widget, event) {
			    	Ext.MessageBox.show({
			            title: '삭제하기',
			            msg: '선택한 항목을 삭제하시겠습니까?',
			            buttons: Ext.MessageBox.YESNO,
			            fn: gm.me().deleteConfirm,
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});

		this.bomEditAction = Ext.create('Ext.Action', {
			iconCls: 'af-edit',
			text: 'BOM 수정',
			tooltip: '수정하기',
			disabled: true,
			handler: function(widget, event) {

				   var uniqueId = gm.me().assymapUidbom;
				   var pcr_div = gm.me().assymapPcr_div;
				   var bm_quan = gm.me().assymapBmQuan;
				   var hier_pos = gm.me().assyId;
				   var child = gm.me().child;
				   var reserved_integer1 = gm.me().assylevel;
				   var pl_no = rec.get('pl_no');
				   var item_code = rec.get('item_code');
				   var item_name = rec.get('item_name');
				   var full_spec_nomaker = rec.get('full_spec_nomaker');
				   var quan = rec.get('quan');
					console_logs('quan+++++++++++++++++', quan);
				   var unit_code = rec.get('unit_code');
				   var comment = rec.get('comment');
//	    	    	if(assyCode==null || assyCode=='') {
//	    	    		Ext.MessageBox.alert('Error','수정할 Assembly를 선택하세요.', callBack);  
//	    	            function callBack(id){  
//	    	                return
				   
//	    	            } 
//	    	            return;
//	    	    	}

				   
				   
						   var lineGap = 30;
						   var bHeight = 250;
						   
						   var inputItem= [];
						   inputItem.push(
								   {
									   xtype: 'textfield',
									   name: 'pl_no',
									   fieldLabel: gm.me().getColName('pl_no'),
									   anchor: '-5',
									   //readOnly : true,
									   //fieldStyle : 'background-color: #ddd; background-image: none;',
									   allowBlank:true,
									   value:pl_no,
									   editable:true
									   //fieldStyle : 'background-color: #ddd; background-image: none;'
								   });
							inputItem.push(
							{
								xtype: 'numberfield',
								name: 'bm_quan',
								fieldLabel: gm.me().getColName('bm_quan'),
								anchor: '-5',
								//readOnly : true,
								//fieldStyle : 'background-color: #ddd; background-image: none;',
								allowBlank:true,
								editable:true,
								value:bm_quan
							});
						   inputItem.push(
								   {
									   xtype: 'textfield',
									   name: 'item_code',
									   fieldLabel: gm.me().getColName('item_code'),
									   anchor: '-5',
									   readOnly : true,
									   fieldStyle : 'background-color: #ddd; background-image: none;',
									   allowBlank:true,
									   value:item_code,
									   editable:true
								   });
						   inputItem.push(
								   {
									   xtype: 'textfield',
									   name: 'item_name',
									   fieldLabel: gm.me().getColName('item_name'),
									   anchor: '-5',
									   readOnly : true,
									   //fieldStyle : 'background-color: #ddd; background-image: none;',
									   allowBlank:true,
									   //editable:true,
									   value:item_name,
									   fieldStyle : 'background-color: #ddd; background-image: none;'
								   });
						   inputItem.push(
								   {
									   xtype: 'textfield',
									   name: 'unit_code',
									   fieldLabel: gm.me().getColName('unit_code'),
									   anchor: '-5',
									   readOnly : true,
									   //fieldStyle : 'background-color: #ddd; background-image: none;',
									   allowBlank:true,
									   value:unit_code,
									   //editable:true,
									   fieldStyle : 'background-color: #ddd; background-image: none;'
								   });
						   inputItem.push(
								   {
									   xtype: 'textfield',
									   name: 'comment',
									   fieldLabel: gm.me().getColName('comment'),
									   anchor: '-5',
									   readOnly : true,
									   //fieldStyle : 'background-color: #ddd; background-image: none;',
									   allowBlank:true,
									   value:comment,
									   //editable:true,
									   fieldStyle : 'background-color: #ddd; background-image: none;'
								   });
					 
						   
						   var form = Ext.create('Ext.form.Panel', {
							   id: 'BomEditPanel-DBM7',
							   defaultType: 'textfield',
							   border: false,
							   bodyPadding: 15,
							   width: 400,
							   height: bHeight,
							   defaults: {
								   // anchor: '100%',
								   editable:false,
								   allowBlank: false,
								   msgTarget: 'side',
								   labelWidth: 100
							   },
								items: inputItem
						   });
						   var win = Ext.create('ModalWindow', {
							   title: 'BOM 수정',
							   width: 400,
							   height: bHeight,
							   minWidth: 400,
							   minHeight: 400,
							   items: form,
							   buttons: [{
								   text: CMD_OK,
								   handler: function(){
									   var form = Ext.getCmp('BomEditPanel-DBM7').getForm();
									   if(form.isValid())
									   {
									   var val = form.getValues(false);
									   Ext.Ajax.request({
										   url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
										   params: {
											   item_code: val['item_code']
										   },
										   success: function(result, request) {
											   var jsonData = Ext.decode(result.responseText);
											   var records = jsonData.datas;
											   if (records != null && records.length > 0) {
												   
												   var child = records[0].unique_id;
												   
												   Ext.Ajax.request({
													   url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=assymapUdate',
													   params:{
														   child:child,
														   unique_id : uniqueId, //유니크아이디
														   //full_spec_nomaker  : val['full_spec_nomaker'],
														   quan  : val['bm_quan'],
														   //unit_code  : val['unit_code'],
														   //remark   : val['remark']
														   //id : val['hier_pos'],			//ID
														   //level : val['level'],			//Level
														   //pcrDiv : val['pcr_div'],		//조달구분
														   bmQuan : val['bm_quan']			//bmQuan
													   },
													   success : function(result, request) {   
			 
														   gm.me().store.load();
													   },
													   failure: extjsUtil.failureMessage
												   });
												   
												   //gm.me().setPartFormObj(records[0]);
												   
												   
											   } else {
												   Ext.MessageBox.alert('알림', '알 수없는 자재번호입니다.');
											   }

										   },
										   failure: extjsUtil.failureMessage
									   });
									   
									   
									   
										
										  if(win) 
										  {
											  win.close();
										  } 
									   } else {
										   Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
									   }

									 }
							   },{
								   text: CMD_CANCEL,
								   handler: function(){
									   if(win) {
										   win.close();
									   }
								   }
							   }]
						   });
						   win.show(/* this, function(){} */); 
			} //endofhandler
	   });




		this.bomAddAction =Ext.create('Ext.Action', {
            itemId: 'addPartAction',
            iconCls: 'af-plus-circle',
            disabled: false,
            text: CMD_ADD,
            handler: function(widget, event) {

                if (gm.me().selected_product == null) {
                    Ext.MessageBox.alert('Error', '추가할 모 Assembly를 선택하세요.', function callBack(id) {
                        return
                    });
                    return;
                }
				
				
           
				var totalCount = gm.me().equipStore.totalCount;
				

				var systemCode ='S';
				if(systemCode=='S') {
					prefix = 'K';
				} else if(systemCode=='O') {
					prefix = 'A';
				}
				  Ext.Ajax.request({
				   url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
				   params:{
					   first:prefix,
					   parent_uid:gm.me().selectedAssyUid
				   },
                    success: function(result, request) {
                        var result = result.responseText;
                        var pl_no = result;
                        
                        var lineGap = 30;
                        var bHeight = 600;
                        var bWidth = 600;
                        
                     // 새로운 createPartForm
                        gm.me().createPartForm = Ext.create('Ext.form.Panel', {
                            //title: '입력폼',
                            xtype: 'form',
                            width: bWidth,
                            height: bHeight,
                            bodyPadding: 15,
                            layout: {
                                type: 'vbox',
                                align: 'stretch' // Child items are stretched to full width
                            },
                            defaults: {
                                allowBlank: true,
                                msgTarget: 'side',
                                labelWidth: 60
                            },
              
                            items: [{
                                xtype: 'displayfield',
                                value: '먼저 등록된 자재인지 검색하세요.'
                            }, {
                                id: gu.id('information'),
                                fieldLabel: '종전자재',
                                field_id:  'information',
                                name: 'information',
                                xtype: 'combo',
                                emptyText: '코드나 규격으로 검색',
                                store: gm.me().searchStore,
                                displayField: 'specification',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                sortInfo: {
                                    field: 'specification',
                                    direction: 'ASC'
								},
                                minChars: 1,
                                typeAhead: false,
                                hideLabel: true,
                                hideTrigger: true,
                                anchor: '100%',
                                triggerAction:'all',
                                listConfig: {
                                    loadingText: '검색중...',
                                    emptyText: '일치하는 결과가 없습니다.',
                                    // Custom rendering template for each item
                                    getInnerTpl: function() {
                                        return '<div onclick="gm.me().setBomData({id});" ><a class="search-item" href="javascript:gm.me().setBomData({id});">' +
                                            '<font color=#999><small>{item_code}</small></font> <font color=#999>{item_name}</font> <font color=#999>{model_no}</font><br />{specification_query} <font color=#999><small>{maker_name}</small></font>' +
                                            '</a></div>';
                                    }
                                },
                                pageSize: 10
							},
							new Ext.form.Hidden({
								id: gu.id('remark'),
                                name: 'remark',
                                value: gm.me().selectedRemark
                            }),
                            new Ext.form.Hidden({
                                name: 'parent',
                                value: gm.me().selectedChild
                            }),
                            new Ext.form.Hidden({
                                name: 'parent_uid',
                                value: gm.me().selectedAssyUid
                            }),
                            new Ext.form.Hidden({
                                name: 'ac_uid',
                                value: gm.me().selectedPjUid
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('pj_code'),
                                name: 'pj_code',
                                value: gm.me().selectedPjCode
                            }),
                            new Ext.form.Hidden({
                                id: 'assy_code',
                                name: 'assy_code',
                                value: gm.me().selectedAssyCode
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('vCompanyReserved4'),
                                name: 'vCompanyReserved4',
                                value: vCompanyReserved4
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('coord_key2'),
                                name: 'coord_key2'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('standard_flag'),
                                name: 'standard_flag',
                                value: 'R'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('child'),
                                name: 'child'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('sg_code'),
                                name: 'sg_code',
                                value: 'NSD'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('hier_pos'),
                                name: 'hier_pos'
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('assy_name'),
                                name: 'assy_name',
                                value: this.selectedAssyName

                            }),
                            new Ext.form.Hidden({
                                id: gu.id('pj_name_2'),
                                name: 'pj_name',
                                value: this.selectedPjName
                            }),
                            new Ext.form.Hidden({
                                id: gu.id('isUpdateSpec'),
                                name: 'isUpdateSpec',
                                value: 'false'
                            }),
                            new Ext.form.Hidden({
                                    id: gu.id('isUpdateSpec'),
                                    name: 'isUpdateSpec',
                                    value: 'false'
                            }),
                            {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    margin: '10 0 5 0',
                                    defaults: {
                                        allowBlank: true,
                                        msgTarget: 'side',
                                        labelWidth: 60
                                    },
                                    items: [{
                                        fieldLabel: gm.me().getColName('unique_id'),
                                        xtype: 'textfield',
                                        id: gu.id('unique_id'),
                                        name: 'unique_id',
                                        emptyText: '자재 UID',
                                        flex: 1,
                                        readOnly: true,
                                        width: 300,
                                        fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                    },
//                                        {
//                                            xtype: 'textfield',
//                                            id: gu.id('unique_uid'),
//                                            name: 'unique_uid',
//                                            emptyText: 'BOM UID',
//                                            flex: 1,
//                                            readOnly: true,
//                                            fieldStyle: 'background-color: #EAEAEA; background-image: none;'
//                                        }
                                    ]
                                },
                                {
                                    xtype: 'textfield',
                                    fieldLabel: gm.me().getColName('item_code'),
                                    id: gu.id('item_code'),
                                    name: 'item_code',
                                    readOnly: true,
                                    fieldStyle: 'background-color: #EAEAEA; background-image: none;'
                                },
                                {
                                    id: gu.id('standard_flag_disp'),
                                    name: 'standard_flag_disp',
                                    xtype: 'combo',
                                    mode: 'local',
                                    editable: true,
                                    allowBlank: true,
                                    queryMode: 'remote',
                                    hidden: true,
                                    displayField: 'codeName',
                                    value: '',
                                    triggerAction: 'all',
                                    fieldLabel: gm.me().getColName('sp_code'), // + '*',
                                    store: gm.me().commonStandardStore2,
                                    listConfig: {
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                        }
                                    },
                                    listeners: {
                                        select: function(combo, record) {
                                            console_log('Selected Value : ' + combo.getValue());
                                            var systemCode = record.get('systemCode');
                                            var codeNameEn = record.get('codeNameEn');
                                            var codeName = record.get('codeName');
                                            console_log('systemCode : ' + systemCode +
                                                ', codeNameEn=' + codeNameEn +
                                                ', codeName=' + codeName);
                                            gu.getCmp( 'standard_flag').setValue(systemCode);

                                            gm.me().getPl_no(systemCode);

                                        }
                                    }
                                },
                                {
                                    xtype: 'fieldset',
                                    title: '품번* | 품명*', //panelSRO1139,
                                    collapsible: false,
                                    readOnly : true,
                                    fieldStyle : 'background-color: #E7EEF6; background-image: none;',
                                    defaults: {
                                        labelWidth: 40,
                                        anchor: '100%',
                                        layout: {
                                            type: 'hbox',
                                            defaultMargins: {
                                                top: 0,
                                                right: 3,
                                                bottom: 0,
                                                left: 0
                                            }
                                        }
                                    },
                                    items: [
                                        {
                                            xtype: 'fieldcontainer',
                                            combineErrors: true,
                                            msgTarget: 'side',
                                            defaults: {
                                                hideLabel: true
                                            },
                                            items: [{
                                                xtype: 'textfield',
                                                width: 100,
                                                emptyText: '품번*',
                                                name: 'pl_no',
                                                id: gu.id('pl_no'),
                                                fieldLabel: '품번',
												readOnly: false,
												value: pl_no,
                                                //fieldStyle : 'background-color: #E7EEF6; background-image: none;',
                                                allowBlank: false
                                            },
                                                {
                                                    xtype: 'textfield',
                                                    flex: 1,
                                                    emptyText: '품명' + '*',
                                                    name: 'item_name',
                                                    id: gu.id('item_name'),
                                                    fieldLabel: gm.me().getColName('item_name'),
                                                    readOnly: true,
                                                    fieldStyle : 'background-color: #E7EEF6; background-image: none;',
                                                    allowBlank: false
                                                }
                                            ]
                                        }
                                    ]
								},
								{
									xtype:'component',
									html: "<hr />",
								},
                                {
									xtype: 'textfield',
									labelWidth: 60,
									fieldLabel: gm.me().getColName('specification'),
									id: gu.id('specification'),
									name: 'specification',
									allowBlank: false,
									readOnly: true,
									fieldStyle : 'background-color: #E7EEF6; background-image: none;',
									width: '93%'
								}, 
                                {
                                    xtype: 'textfield',
                                    fieldLabel: gm.me().getColName('maker_name'),
                                    id: gu.id('maker_name'),
                                    name: 'maker_name',
                                    readOnly: true,
                                    fieldStyle : 'background-color: #E7EEF6; background-image: none;',
                                    allowBlank: true
                                },
                                {
									xtype: 'textfield',
									fieldLabel: gm.me().getColName('model_no'),
                                    id: gu.id('model_no'),
                                    name: 'model_no',
                                    readOnly: true,
                                    fieldStyle : 'background-color: #E7EEF6; background-image: none;',
                                    allowBlank: true
                                }, {
									xtype: 'textfield',
									fieldLabel: gm.me().getColName('description'),
                                    id: gu.id('description'),
                                    name: 'description',
									readOnly: true,
                                    fieldStyle : 'background-color: #E7EEF6; background-image: none;',
                                    allowBlank: true
                                },
                                
                                 {
                                    xtype: 'textfield',
                                    fieldLabel: gm.me().getColName('comment'),
                                    id: gu.id('comment'),
									name: 'comment',
									fieldStyle : 'background-color: #E7EEF6; background-image: none;',
                                    allowBlank: true
                                }, 
                               {
                                    xtype: 'textfield',
                                    fieldLabel: gm.me().getColName('unit_mass'),  // 단중(단위중량)
                                    id: gu.id('unit_mass'),
                                    name: 'unit_mass',
                                    allowBlank: true,
                                    emptyText: 'Kg',
                                    value: 1,
                                    hidden: true
                                }, {
                                    xtype: 'combo',
                                    fieldLabel: gm.me().getColName('notify_flag'),  // 봄 구매여부
                                    id: gu.id('notify_flag'),
                                    name: 'notify_flag',
                                    allowBlank: true,
                                    value: 'N',
                                    hidden: true,
                                    field_id: 'notify_flag',
                                    store:gm.me().notifyStore,
                                    displayField: 'display',
                                    valueField: 'value',
                                    innerTpl	: '<div data-qtip="{value}">[{value}]{display}</div>',
                                    minChars: 1,
                                    typeAhead:true,
                                    queryMode: 'remote',
                                    // fieldStyle: 'background-color: #FBF8E6'
                                }, {
                                    xtype:'checkboxfield',
                                    align:'right',
                                    fieldLabel:'화면유지',
									id: 'win_check',
									hidden: true,
                                    checked: gm.me().win_check == true ? true : false,
                                    inputValue: '-1',
                                    listeners:{
                                        change:function(checkbox, checked){

                                            if(checked) {
                                                gm.me().win_check = true;
                                            } else {
                                                gm.me().win_check = false;
                                            }
                                        }
                                    }
                                },
                                {
                                    xtype: 'fieldset',
                                    title: '분류코드', //panelSRO1139,
                                    collapsible: false,
                                    hidden: true,
                                    defaults: {
                                        labelWidth: 40,
                                        anchor: '100%',
                                        layout: {
                                            type: 'hbox',
                                            defaultMargins: {
                                                top: 0,
                                                right: 3,
                                                bottom: 0,
                                                left: 0
                                            }
                                        }
                                    },
                                },
                                
                                {
                                    xtype: 'fieldset',
                                    border: true,
                                    // style: 'border-width: 0px',
//                                    title: panelSRO1186 + ' | ' + panelSRO1187 + ' | ' + panelSRO1188 + ' | 통화', //panelSRO1174,
                                    collapsible: false,
                                    defaults: {
                                        labelWidth: 100,
                                        anchor: '100%',
                                        layout: {
                                            type: 'hbox',
                                            defaultMargins: {
                                                top: 0,
                                                right: 0,
                                                bottom: 0,
                                                left: 0
                                            }
                                        }
                                    },
                                    items: [

                                        {
                                            xtype: 'fieldset',
                                            title: '수량 | 단가 | 통화',
                                            combineErrors: true,
                                            msgTarget: 'side',
                                            defaults: {
                                                hideLabel: true
                                            },
                                            items: [{
                                                xtype: 'numberfield',
                                                minValue: 0,
                                                width: 100,
                                                id: gu.id('bm_quan'),
                                                name: 'bm_quan',
                                                fieldLabel: gm.me().getColName('bm_quan'),
                                                allowBlank: true,
                                                value: '1',
                                                margins: '0'
                                            }, {
                                                width: 100,
                                                id: gu.id('unit_code'),
                                                name: 'unit_code',
                                                xtype: 'combo',
                                                mode: 'local',
                                                editable: true,
                                                allowBlank: true,
                                                queryMode: 'remote',
                                                displayField: 'codeName',
                                                valueField: 'codeName',
                                                value: 'EA',
                                                triggerAction: 'all',
                                                fieldLabel: gm.me().getColName('unit_code'),
                                                store: gm.me().commonUnitStore,
                                                listConfig: {
                                                    getInnerTpl: function() {
                                                        return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                    }
                                                },
                                                listeners: {
                                                    select: function(combo, record) {
                                                        console_log('Selected Value : ' + combo.getValue());
                                                        var systemCode = record.get('systemCode');
                                                        var codeNameEn = record.get('codeNameEn');
                                                        var codeName = record.get('codeName');
                                                        console_log('systemCode : ' + systemCode +
                                                            ', codeNameEn=' + codeNameEn +
                                                            ', codeName=' + codeName);
                                                    }
                                                }
                                            },
                                                {
                                                    xtype: 'numberfield',
                                                    minValue: 0,
                                                    flex: 1,
                                                    id: gu.id('sales_price'),
                                                    name: 'sales_price',
                                                    fieldLabel: gm.me().getColName('sales_price'),
                                                    allowBlank: true,
                                                    value: '0',
                                                    margins: '0'
                                                }, {
                                                    width: 100,
                                                    id: gu.id('currency'),
                                                    name: 'currency',
                                                    xtype: 'combo',
                                                    mode: 'local',
                                                    editable: true,
                                                    allowBlank: true,
                                                    queryMode: 'remote',
                                                    displayField: 'codeName',
                                                    valueField: 'codeName',
                                                    value: 'KRW',
                                                    triggerAction: 'all',
                                                    fieldLabel: gm.me().getColName('currency'),
                                                    store: gm.me().commonCurrencyStore,
                                                    listConfig: {
                                                        getInnerTpl: function() {
                                                            return '<div data-qtip="{systemCode}">{codeName}</div>';
                                                        }
                                                    },
                                                    listeners: {
                                                        select: function(combo, record) {
                                                            console_log('Selected Value : ' + combo.getValue());
                                                            var systemCode = record.get('systemCode');
                                                            var codeNameEn = record.get('codeNameEn');
                                                            var codeName = record.get('codeName');
                                                            console_log('systemCode : ' + systemCode +
                                                                ', codeNameEn=' + codeNameEn +
                                                                ', codeName=' + codeName);
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }, {
                                    xtype: 'button',
                                    text: '초기화',
                                    scale: 'small',
                                    width:50,
                                    maxWidth: 80,
                                    style: {
                                        marginTop: '7px',
                                        marginLeft: '550px'
                                    },
                                    // size:50,
                                    hidden: true,
                                    listeners:{
                                        click: function() {
                                            gm.me().resetPartForm();
                                        }
                                    }

                                }, {
                                    xtype: 'container',
                                    type: 'hbox',
                                    padding: '5',
                                    pack: 'end',
                                    align: 'left',
                                    defaults: {},
                                    margin: '0 0 0 0',
                                    border: false

                                }
                            ]
                        });
                        
                        var partGridWidth = '25%';

                        var searchPartGrid = Ext.create('Ext.grid.Panel', {
                            title: '자재 검색',
                            store: gm.me().searchDetailStore,

                            layout: 'fit',
                            columns: [
                                {text: "품목코드", width: 80, dataIndex: 'item_code', sortable: true},
                                {text: "품명", flex: 1, dataIndex: 'item_name', sortable: true},
                                {text: "규격", width: 125, dataIndex: 'specification', sortable: true},
                                {text: "재질", width: 80, dataIndex: 'model_no', sortable: true},
                                {text: "단가", width: 40, dataIndex: 'sales_price', sortable: true,
                                    hidden:true},
                                {text: "단중", width: 40, dataIndex: 'unit_mass', sortable: true,
                                    hidden: true},
                                {text: "최근 공급사", width: 90, dataIndex: 'supplier_name', sortable: true,
                                    hidden: true}
                            ],
                          //  border: false,
                            multiSelect: false,
                           // frame: false,
                            pageSize: 100,
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: gm.me().searchDetailStore,
                                displayInfo: true,
                                displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
                                emptyMsg: MSG_NO_ITEM
                                ,listeners: {
                                    beforechange: function (page, currentPage) {

                                    }
                                }

                            }),
                            dockedItems: [
                                {
                                dock: 'top',
                                xtype: 'toolbar',
                                cls: 'my-x-toolbar-default1',
                                items: [
                                    {
                                        width: partGridWidth,
                                        field_id:  'search_item_code',
                                        id: gu.id('search_item_code'),
                                        name: 'search_item_code',
                                        xtype: 'triggerfield',
                                        emptyText: '품목코드',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click : function() {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners : {
                                            specialkey : function(fieldObj, e) {
                                                if (e.getKey() == Ext.EventObject.ENTER) {
                                                    gm.me().redrawSearchStore();
                                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                }
                                            },
                                            render: function(c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        width: partGridWidth,
                                        field_id:  'search_item_name',
                                        id: gu.id('search_item_name'),
                                        name: 'search_item_name',
                                        xtype: 'triggerfield',
                                        emptyText: '품명',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click : function() {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners : {
                                            specialkey : function(fieldObj, e) {
                                                if (e.getKey() == Ext.EventObject.ENTER) {
                                                    gm.me().redrawSearchStore();
                                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                }
                                            },
                                            render: function(c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        width: partGridWidth,
                                        field_id:  'search_specification',
                                        id: gu.id('search_specification'),
                                        name: 'search_specification',
                                        xtype: 'triggerfield',
                                        emptyText: '규격',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click : function() {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners : {
                                            specialkey : function(fieldObj, e) {
                                                if (e.getKey() == Ext.EventObject.ENTER) {
                                                    gm.me().redrawSearchStore();
                                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                }
                                            },
                                            render: function(c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },
                                    {
                                        width: partGridWidth,
                                        field_id:  'search_model_no',
                                        id: gu.id('search_model_no'),
                                        name: 'search_model_no',
                                        xtype: 'triggerfield',
                                        emptyText: '재질',
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click : function() {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners : {
                                            specialkey : function(fieldObj, e) {
                                                if (e.getKey() == Ext.EventObject.ENTER) {
                                                    gm.me().redrawSearchStore();
                                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                }
                                            },
                                            render: function(c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    },{
                                        width: partGridWidth,
                                        field_id:  'search_supplier_name',
                                        id: gu.id('search_supplier_name'),
                                        name: 'search_supplier_name',
                                        xtype: 'triggerfield',
                                        emptyText: '공급사',
                                        hidden: true,
                                        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
                                        onTrigger1Click : function() {
                                            this.setValue('');
                                            gm.me().redrawSearchStore();
                                        },
                                        listeners : {
                                            change : function(fieldObj, e) {
                                                //if (e.getKey() == Ext.EventObject.ENTER) {
                                                    gm.me().redrawSearchStore();
                                                    //srchSingleHandler (store, srchId, fieldObj, isWild);
                                                //}
                                            },
                                            render: function(c) {
                                                Ext.create('Ext.tip.ToolTip', {
                                                    target: c.getEl(),
                                                    html: c.emptyText
                                                });
                                            }
                                        }
                                    }
                                ]
                            }] // endofdockeditems
                        }); // endof Ext.create('Ext.grid.Panel',
                        
                        searchPartGrid.getSelectionModel().on({
                            selectionchange: function(sm, selections) {
                                console_logs('selections', selections);
                                if(selections!=null && selections.length>0 && selections[0]!=null) {
                                    gm.me().setBomData(selections[0].getId());
                                }

                            }
                        });
                        
                        var winPart = Ext.create('ModalWindow', {
                            title: 'Part 추가',
                            width: bWidth,
                            height: bHeight,
                            minWidth: 250,
                            minHeight: 180,
                            items: gm.me().createPartForm,
                            buttons: [{
                                text: CMD_OK,
                                handler: function() {
									var form = gm.me().createPartForm;
									var val = form.getValues(false);
                                    console_logs('>>>>>> value ????? ', val);
                                    if (form.isValid()) {
										var val = form.getValues(false);
                                        console_logs('form val', val);
                                        gm.me().registPartFc(val);
                                        if (winPart) {
                                            winPart.close();
										}
										
                                    } else {
                                    	Ext.Msg.alert('오류', '해당 정보가 입력되지 않았습니다.');
                                    }

                                }
                            }, {
                                text: CMD_CANCEL,
                                handler: function() {
                                    if (winPart) {
                                        winPart.close();
                                    }
                                }
                            }]
                        });
                        winPart.show( /* this, function(){} */ );
                    } // endofhandler
                });
            },
            failure: extjsUtil.failureMessage
        }),
                
		
        // PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            
            tooltip:'PartList 출력',
            disabled: false,
            
            handler: function(widget, event) {
            	var ac_uid = gm.me().vSELECTED_PROJECT_UID;
            	var item_code = gm.me().vSELECTED_PRODUCT_CODE;
            	
            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printPl',
            		params:{
            			item_code : item_code,
            			rtgast_uid: gm.me().selectedAssyUid,
            			parent_uid: gm.me().selectedAssyUid,
            			ac_uid : ac_uid,
            			pdfPrint : 'pdfPrint',
            			is_rotate : 'N'
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
      
        var buttonToolbar = Ext.create('widget.toolbar', {
    		cls: 'my-x-toolbar-default2',
    		items: [
					{
						id: gu.id('target-routeTitlename'),
					    xtype:'component',
					    html: "BOM List을 선택하세요.",
					    width: 370,
					    style: ''
					    
					 },
					 
			          '->',
			         this.bomAddAction,
			         this.bomEditAction,
// '-',
// '-',
					 this.removeAction,
// '-',
					 
// this.printPDFAction, '-',
// {
// xtype: 'component',
// // style: 'margin:5px;',
// //html: 'BOM 수량:'
// },
// {
// xtype: 'component',
// style: 'margin:5px;width:18px;text-align:right',
// id: gu.id('childCount'),
// html: ''
// }
    		        ]
    	});
        
        this.createGrid([ buttonToolbar ], {width: '60%'});
        
        
        this.setGridOnCallback(function(selections) {
        	if (selections.length) {
        		rec = selections[0];
        		console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>',rec.get('request_comment'));
        		gm.me().assymapUidbom=rec.get('unique_uid');
        		gm.me().assymapPcr_div=rec.get('request_comment');
        		gm.me().assymapBmQuan=rec.get('bm_quan');
        		gm.me().assyId=rec.get('hier_pos');
        		gm.me().assylevel=rec.get('reserved_integer1');
        		gm.me().child=rec.get('unique_id');
        		gUtil.enable(gm.me().addPcsPlanAction);
        		gUtil.enable(gm.me().bomEditAction);
        		gUtil.enable(gm.me().bomaAddction);
        		
        	} else {
        		gUtil.disable(gm.me().addPcsPlanAction);
        		gUtil.disable(gm.me().bomEditAction);
        		// gUtil.disable(gm.me().bomAddAction);
        	}
        	
        	
        });
        
    	
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });
    	
        
	    this.commonStandardStore.load(function(records) {
    		for (var i=0; i<records.length; i++){ 
    	       	var obj = records[i];
    	       	// console_logs('commonStandardStore2['+i+']=', obj);
				try {
					gm.me().standard_flag_datas.push(obj);
				} catch (e) {
					console_logs('gm.me().standard_flag_datas.push(obj); e', e);
				}
    		}
    	});
	    

		console_logs('this.equipStore.load', 'start');
		this.equipStore.load(function(records) {
			console_logs('this.equipStore.load records', records);
    		for (var i=0; i<records.length; i++){ 
    	       	var obj = records[i];
    	       	// console_logs('commonStandardStore2['+i+']=', obj);
    		}
    	});
    	
    	this.callParent(arguments);
    	
    },
    setRelationship: function (relationship) {},
    
    createCenter: function() {
	    this.inpuArea = Ext.widget({
	 	      title: 'Excel Form',
	 	      xtype: 'form',
	 	      disabled: true,
	 	      collapsible: false,
	 	      border: false,
	 	      layout: 'fit',
	 	      dockedItems: [{
	            dock: 'top',
	            xtype: 'toolbar',
	            items: [
	 	         {
		 	       	 iconCls: 'search',
			 	   	 text: CMD_INIT,
			 	   	 handler: function() {
				 	   	 Ext.MessageBox.show({
		                     title:'초기화 확인',
		                     msg: '초기화하면 현재 작업한 내용은 지워지고 서버에 저장된 현재 BOM으로 대체됩니다.<br />계속하시겠습니까?',
		                     buttons: Ext.MessageBox.YESNO,
		                     icon: Ext.MessageBox.QUESTION,
		                     fn: function(btn) {
		                         var result = MessageBox.msg('{0}', btn);
		                         if(result=='yes') {
		                        	 var o = gu.getCmp('bom_content');
		                        	 o.setValue(bomTableInfo);
		                         }
		                     }
		                 });
	            	 
		             }
	 	         },'-',
	 	        {
		 	       	 iconCls: 'textfield',
			 	   	 text: '모두 지우기',
			 	   	 handler: function() {
				 	   	 Ext.MessageBox.show({
		                     title:'모두 지우기',
		                     msg: '모두 지우시겠습니까?',
		                     buttons: Ext.MessageBox.YESNO,
		                     icon: Ext.MessageBox.QUESTION,
		                     fn: function(btn) {
		                         var result = MessageBox.msg('{0}', btn);
		                         if(result=='yes') {
		                        	 var o = gu.getCmp('bom_content');
		                        	 o.setValue('');
		                         }
		                     }
		                 });
	            	 
		             }
	 	         },'-', {
		 	       	 iconCls: 'application_view_tile',
			 	   	 text: '사전검증',
			 	   	 handler: function() {
			 	   		 var bom_content = gu.getCmp('bom_content');
			 	   		 
			 	   		 var htmlContent = bom_content.getValue();
			 	   		 
					  	Ext.Ajax.request({
							url: CONTEXT_PATH + '/design/upload.do?method=validateBom',
							params:{
								pj_code: gm.me().selectedPjCode,
								assy_code: gm.me().selectedAssyCode,
								pj_uid: gm.me().selectedPjUid,
								parentUid: gm.me().selectedparent,
								parent: gm.me().selectedparent,
								parent_uid: gm.me().selectedAssyUid,
								pj_name: Ext.JSON.encode(gm.me().selectedPjName),
								assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
								htmlContent: htmlContent
							},
							success : function(result, request) {   
								var val = result.responseText;
								// console_logs("val", val);
								// var htmlData = Ext.decode(val);
								// console_logs("htmlData", val);
								
					 	   		// htmlContent=func_replaceall(htmlContent,'<table
								// border="0"','<table border="1"');
					 	   		
					 	   		bom_content.setValue(val);
					
							},
							failure: extjsUtil.failureMessage
						});
			 	   		 
	            	 
		             }
	 	         },'-', {
		             text: '디플로이',
		             iconCls: 'save',
		             handler: function() {
                        var bom_content = gu.getCmp('bom_content');
			 	   		 
                        var htmlContent = bom_content.getValue();
			 	   		 
                        gu.getCmp('bom_content').setLoading(true);
			 	   		 
					  	Ext.Ajax.request({
							url: CONTEXT_PATH + '/design/upload.do?method=deployHtmlBom',
							params:{
								pj_code: gm.me().selectedPjCode,
								assy_code: gm.me().selectedAssyCode,
								pj_uid: gm.me().selectedPjUid,
								parentUid: gm.me().selectedparent,
								pj_name: Ext.JSON.encode(gm.me().selectedPjName),
								assy_name: Ext.JSON.encode(gm.me().selectedAssyName),
								htmlContent: htmlContent
							},
							success : function(result, request) { 
			     				
		        				var jsonData = Ext.decode(result.responseText);
		        				console_logs('jsonData', jsonData);
		        				
		        				var result = jsonData['result'];
		        				
		        				if(result == 'true' || result  == true) {// 정상이면
																			// Reload.
						    		if(gm.me().selectedAssyDepth==1) {
						    			gm.me().editAssyAction.disable();
						    			gm.me().removeSpEquip.disable();
						    		} else {
						    			gm.me().editAssyAction.enable();
						    			gm.me().removeSpEquip.enable();		
						    		}
						    		gm.me().store.getProxy().setExtraParam('parent', gm.me().selectedparent);
						    		gm.me().store.getProxy().setExtraParam('ac_uid', gm.me().selectedPjUid);
						    		gm.me().store.load(function(records){
					            		// insertStockStoreRecord(records);
					            		gm.me().routeTitlename = '[' + gm.me().selectedAssyCode  + '] ' + gm.me().selectedAssyName;
					            		gm.me().selectAssy(gm.me().selectedFolderName, gm.me().selectedAssyDepth);
					            		gm.me().setChildQuan(records.length);

					            		
					            		gm.me().setMakeTable(records);
					            		
					            	});
					            	
		        				} else {
		        					Ext.MessageBox.alert('오류','입력한 Excel Form에 오류가 있습니다.<br> 먼저 \'사전검증\'을 실시하세요.');
		        				}
		        				gu.getCmp('bom_content').setLoading(false);
							},
							failure: extjsUtil.failureMessage
						});

		             }
	 	         }, '-',
		         '->'/*
						 * , addExcelWithProject, '-',excel_sample
						 */]
	 	      }],
	 	      items: [
	 	      {
	 	    	     id: gu.id('bom_content'),
		             name: 'bom_content',
		             xtype: 'htmleditor',
		             width: '100%',
		             height: '100%',
		             border: false,
		             enableColors: false,
		             enableAlignments: false,
		             anchor: '100%',
		             listeners: {
		                 initialize: function(editor) {
		                	 console_logs('editor', editor);
		                     var styles = {
                          };
  
		                     Ext.DomHelper.applyStyles(editor.getEditorBody(), styles);
		                 }
		             },
		             value: this.initTableInfo
		            	
		             
		    	 }]
	 		});

    		this.grid.setTitle('BOM');
			this.center =  Ext.widget('tabpanel', {
				layout:'border',
			    border: true,
			    region: 'center',
	            width: '75%',
			    items: [this.grid]
			});
			
			return this.center;

    },
    
    // ----------------------- END OF CENTER --------------------
    
    createWest: function() {
    	
    	this.removeSpEquip = Ext.create('Ext.Action', {
    		itemId: 'removeSpEquip',
    	    iconCls: 'af-remove',
    	    text: 'S/P BOM 삭제',
    	    disabled: true,
    	    handler: function(widget, event) {
    	    	Ext.MessageBox.show({
    	            title:'삭제하기',
    	            msg: '선택한 항목을 삭제하시겠습니까?',
    	            buttons: Ext.MessageBox.YESNO,
    	            fn: gm.me().removeSpEquipConfirm,
    	            // animateTarget: 'mb4',
    	            icon: Ext.MessageBox.QUESTION
    	        });
    	    }
    	});
    	  	
    	this.editAssyAction = Ext.create('Ext.Action', {
    		itemId:'editAssyAction',
    		iconCls: 'af-edit',
    		disabled: true,
    	    text: '제품 수정',
    	    handler: function(widget, event) {
    	    	
    	    	
    	    	var uniqueId = parent;
    	    	var classCode = gm.me().classCode;
    	    	var mchn_code = gm.me().mchn_code;
    	    	var modelNo = gm.me().modelNo;
    	    	var description = gm.me().description;	
    			var lineGap = 30;
    			var bHeight = 250;
    					
    			    	var inputItem= [];
    			    	inputItem.push(
    			    	{
    						xtype: 'textfield',
    						name: 'classCode',
    						fieldLabel: '분류코드',
    						allowBlank:false,
    						value: classCode,
    						anchor: '-5',
    						// readOnly : true,
    						fieldStyle : 'background-color: #ddd; background-image: none;'
    					});
    			    	inputItem.push(
    					    	{
    								xtype: 'textfield',
    								name: 'mchn_code',
    								fieldLabel: '품목코드',
    								allowBlank:false,
    								value: mchn_code,
    								anchor: '-5',
    								readOnly : true,
    								fieldStyle : 'background-color: #ddd; background-image: none;'
    							});
    			    	inputItem.push(
    			    	{
    						xtype: 'textfield',
    						name: 'modelNo',
    						fieldLabel: '자재',
    						allowBlank:true,
    						value: modelNo,
    						anchor: '-5',
    						editable:true// ,
    						// readOnly : false
    						// ,
    						// fieldStyle : 'background-color: #ddd;
							// background-image: none;'
    					});
    			    	
    			    	inputItem.push(
    			    			{
    			                    fieldLabel: '상세사양',
    			                    x: 5,
    			                    y: 0 + 3*lineGap,
    			                    name: 'description',
    			                    value: description,
    			                    // readOnly : false,
    			                    allowBlank:true,
    			                    editable:true,
    			                    anchor: '-5'  // anchor width by
													// percentage
    			                }
    			    			);
    			
    			    	
    			    	var form = Ext.create('Ext.form.Panel', {
    			    		id: gu.id('modformPanel'),
    			            defaultType: 'textfield',
    			            border: false,
    			            bodyPadding: 15,
    			            width: 400,
    			            height: bHeight,
    			            defaults: {
    			                // anchor: '100%',
    			                editable:false,
    			                allowBlank: false,
    			                msgTarget: 'side',
    			                labelWidth: 100
    			            },
    			             items: inputItem
    			        });
    			        var win = Ext.create('ModalWindow', {
    			            title: '제품정보수정',
    			            width: 400,
    			            height: bHeight,
    			            minWidth: 250,
    			            minHeight: 180,
    			            items: form,
    			            buttons: [{
    			                text: CMD_OK,
    			            	handler: function(){
    			                    var form = gu.getCmp('modformPanel').getForm();
    			                    if(form.isValid())
    			                    {
    			                	var val = form.getValues(false);

    			                	Ext.Ajax.request({
    			            			url: CONTEXT_PATH + '/purchase/material.do?method=update',
    			            			params:{
			            				
    			            				id : uniqueId,
    			            				model_no : val['modelNo'],
    			            				description : val['description'],
    			                			standard_flag : 'A'

    			            			},
    			            			success : function(result, request) {                	
    					                 	productlist.store.getProxy().setExtraParam('class_code', gm.me().classCode);
    					                 	productlist.store.load();
    			            			},
    			            			failure: extjsUtil.failureMessage
    			            		});
    			                	 
    		                       	if(win) 
    		                       	{
    		                       		win.close();
    		                       	} 
    			                    } else {
    			                    	Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
    			                    }

    			                  }
    			            },{
    			                text: CMD_CANCEL,
    			            	handler: function(){
    			            		if(win) {
    			            			win.close();
    			            		}
    			            	}
    			            }]
    			        });
    			        win.show(/* this, function(){} */);
    	    } // endofhandler
    	});
    	
    	
        this.searchMachineAction = Ext.create('Ext.Action', {
            itemId: 'searchMachineAction',
            iconCls: 'af-search',
            disabled: false,
            text: '검색',
            handler: function(widget, event) {

				gm.me().equipStore.load();

            },
            failure: extjsUtil.failureMessage
        });



    	// Context Popup Menu
    	this.contextMenu = Ext.create('Ext.menu.Menu', {
    	    items: [ this.searchMachineAction ,this.editAssyAction, this.removeSpEquip ]
    	});
    	
    	
	    Ext.define('SrcAhd', {
		   	 extend: 'Ext.data.Model',
		   	 fields: [     
		       		 { name: 'unique_id', type: "string" }
		     		,{ name: 'item_code', type: "string"  }
		     		,{ name: 'item_name', type: "string"  }
		     		,{ name: 'specification', type: "string"  }
		     		,{ name: 'maker_name', type: "string"  }
		     		,{ name: 'description', type: "string"  }
		     		,{ name: 'specification_query', type: "string"  }
		     	  	  ],
		   	    proxy: {
		   			type: 'ajax',
		   	        api: {
		   	            read: CONTEXT_PATH + '/purchase/material.do?method=searchPart'
		   	        },
		   			reader: {
		   				type: 'json',
		   				root: 'datas',
		   				totalProperty: 'count',
		   				successProperty: 'success'
		   			}
		   		}
		   });    	
    	this.searchStore = new Ext.data.Store({  
    		pageSize: 16,
    		model: 'SrcAhd',
    		// remoteSort: true,
    		sorters: [{
                property: 'specification',
                direction: 'ASC'
            },
            {
                property: 'item_name',
                direction: 'ASC'
            }]

		});
		this.searchStore.getProxy().setExtraParam('standard_flag', 'S');
    	

    	
		var myFormPanel = Ext.create('Ext.form.Panel', {
			id: gu.id('addPartForm'),
			title: 'Part',
			xtype: 'form',
			frame: false,
	        border: false,
            bodyPadding: 10,
            autoScroll: true,
            disabled: true,
	        defaults: {
	            anchor: '100%',
	            allowBlank: true,
	            msgTarget: 'side',
	            labelWidth: 60
	        },
	        // border: 0,
            dockedItems: [
              {
			      dock: 'top',
			    xtype: 'toolbar',
				items: [this.resetAction, '-', this.modRegAction/*
																 * , '-',
																 * copyRevAction
																 */]
			  }],
	        items: [{
				id :gu.id('search_information'),
				field_id :'search_information',
		        name : 'search_information',
	            xtype: 'combo',
	            emptyText: '규격으로 검색',
	            store: this.searchStore,
	            displayField: 'specification',
	            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
	            sortInfo: { field: 'specification', direction: 'ASC' },
	            minChars: 1,
	            typeAhead: false,
	            hideLabel: true,
	            hideTrigger:true,
	            anchor: '100%',
	            listConfig: {
	                loadingText: '검색중...',
	                emptyText: '일치하는 결과가 없습니다.',

	                // Custom rendering template for each item
	                getInnerTpl: function() {
	                    return '<div><a class="search-item" href="javascript:setBomData({id});">' +
	                        '<span style="color:#999;"><small>{item_code}</small></span> <span style="color:#999;">{item_name}</span><br />{specification_query} <span style="color:#999;"><small>{maker_name}</small></span>' +
	                    '</a></div>';
	                }
	            },
	            pageSize: 10
	        }, {
	            xtype: 'component',
	            style: 'margin-top:10px',
	            html: '먼저, 등록된 자재인지 검색하세요.<hr>'
	        }
	        ,
	        new Ext.form.Hidden({
        		name: 'parent'
        	}),
        	new Ext.form.Hidden({
        		name: 'ac_uid'
        	}),
        	new Ext.form.Hidden({
        		name: 'pj_code'
        	}),
        	new Ext.form.Hidden({
        		name: 'coord_key2'
        	}),
        	new Ext.form.Hidden({
        		id: gu.id('standard_flag'),
        		name: 'standard_flag'
        	}),
        	new Ext.form.Hidden({
        		name: 'child'
        	}),
        	new Ext.form.Hidden({
        		name: 'sg_code',
        		value:'NSD'
        	}),
        	new Ext.form.Hidden({
        		name: 'hier_pos'
        	}),
			new Ext.form.Hidden({
				name: 'assy_name',
				value:this.selectedAssyName
				
			}),
			new Ext.form.Hidden({
				name: 'pj_name',
				value:this.selectedPjName
			}),
			new Ext.form.Hidden({
				id: gu.id('isUpdateSpec'),
				name: 'isUpdateSpec',
				value: 'false'
			}),
	        {
          	   xtype: 'container',
          	   layout: 'hbox',
          	   margin: '10 0 5 0',
   		        defaults: {
		            allowBlank: true,
		            msgTarget: 'side',
		            labelWidth: 60
		        },
               items: [
        				{	
        					fieldLabel:    this.getColName('unique_id'),
        		   			xtype:  'textfield', 
        					id:gu.id('unique_id'),
        					name: 'unique_id',
        					emptyText: '자재 UID', 
        					flex:1,
        					readOnly: true,
        					width: 300,
        					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
        		        },
        				{	
        		   			xtype:  'textfield',
        					id:   gu.id('unique_uid'),
        					name: 'unique_uid',
        					emptyText: 'BOM UID', 
        					flex:1,
        					readOnly: true,
        					fieldStyle: 'background-color: #EAEAEA; background-image: none;'
        		        }
               ]
	        },
	        {	
	        	xtype:  'triggerfield',
				fieldLabel:    this.getColName('item_code'),
				id:  gu.id('item_code'),
				name: 'item_code',
				emptyText: '자동 생성',
				listeners : {
	          		specialkey : function(field, e) {
	          		if (e.getKey() == Ext.EventObject.ENTER) {
	          		}
	          	}
		      	},
		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger', 'onTrigger1Click': function() {
		          	
		        	  
		        	  var val = gu.getCmp('item_code').getValue();
		        	  if(val!=null && val!='') {
		        	  

		        		Ext.Ajax.request({
		        			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialByItemcode',
		        			params:{
		        				item_code :val
		        			},
		        			success : function(result, request) {  
		        				var jsonData = Ext.decode(result.responseText);
		        				var records = jsonData.datas;
		        				if(records!=null && records.length>0) {
					        		modRegAction.enable();
					        		resetPartForm();
			        				gm.me().setPartFormObj(records[0]);
		        				} else {
		        					Ext.MessageBox.alert('알림','알 수없는 자재번호입니다.');
		        				}

		        			},
		        			failure: extjsUtil.failureMessage
		        		});  
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  }// endofif
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  
		        	  
		      	}
				// readOnly: true,
				// fieldStyle: 'background-color: #EAEAEA; background-image:
				// none;'
	        },
	        {

                id:           gu.id('standard_flag_disp'),
                name:           'standard_flag_disp',
                xtype:          'combo',
                mode:           'local',
                editable:       false,
                allowBlank: false,
                queryMode: 'remote',
                displayField:   'codeName',
                value:          '',
                triggerAction:  'all',
                fieldLabel: this.getColName('sp_code')+'*',
                store: this.commonStandardStore2,
                listConfig:{
                	getInnerTpl: function(){
                		return '<div data-qtip="{systemCode}">{codeName}</div>';
                	}			                	
                },
 	               listeners: {
     	                    select: function (combo, record) {
     	                    	console_log('Selected Value : ' + combo.getValue());
     	                    	console_logs('record : ', record);
     	                    	var systemCode = record.get('systemCode');
     	                    	var codeNameEn  = record.get('codeNameEn');
     	                    	var codeName  = record.get('codeName');
     	                    	console_log('systemCode : ' + systemCode 
     	                    			+ ', codeNameEn=' + codeNameEn
     	                    			+ ', codeName=' + codeName	);
     	                    	gu.getCmp('standard_flag').setValue(systemCode);
     	                    	
     	                    	gm.me().getPl_no(systemCode);
// var prefix = systemCode;
     	                    	var oClass_code1 = gu.getCmp('class_code1');
							 	if(systemCode=='S') {
							 		oClass_code1.setDisabled(false);
							 	} else {
							 		oClass_code1.setDisabled(true);
							 	}

     	                    }
     	               }
            },
            {
                fieldLabel: this.getColName('class_code'),
                id: gu.id('class_code1'),
                name: 'class_code1',
                emptyText: '분류체계',
                xtype: 'combo',
                mode: 'local',
                editable: false,
                allowBlank: false,
                disabled: true,
                queryMode: 'remote',
                displayField: 'class_name',
                valueField: 'class_code',
                hidden: true,
                store: this.materialClassStore,
                listConfig:{
                	getInnerTpl: function(){
                		return '<div data-qtip="{class_code}">[{class_code}] {class_name}</div>';
                	}			                	
                },
	                listeners: {
	                    select: function (combo, record) {
	                    	console_log('Selected Value : ' + combo.getValue());
	                    	var class_code = record[0].get('class_code');
	                    	var class_name = record[0].get('class_name');
	                    	var rand = RandomString(10);
	                    	var item_code = class_code.substring(0,4) + '-' + rand.substring(0,7);
	                    	gu.getCmp('item_code').setValue(item_code);
	                    }
 	            }
            },
            {
	            xtype: 'fieldset',
	            title: '품번* | 품명*', // panelSRO1139,
	            collapsible: false,
	            defaults: {
	                labelWidth: 40,
	                anchor: '100%',
	                layout: {
	                    type: 'hbox',
	                    defaultMargins: {top: 0, right: 3, bottom: 0, left: 0}
	                }
	            },
	            items: [

	                {
	                    xtype : 'fieldcontainer',
	                    combineErrors: true,
	                    msgTarget: 'side',
	                    defaults: {
	                        hideLabel: true
	                    },
	                    items : [     
		                {
		                    xtype: 'textfield',
		                    width:      50,
		                    emptyText: '품번*', 
		                    name : 'pl_no',
		                    id : gu.id('pl_no'),
		                    fieldLabel: '품번',
		                    readOnly : false,
		                    allowBlank: false
		                },
		                {
		                    xtype: 'textfield',
		                    flex : 1,
		                    emptyText: '품명'+'*', 
		                    name : 'item_name',
		                    id : gu.id('item_name'),
		                    fieldLabel: this.getColName('item_name'),
		                    readOnly : false,
		                    allowBlank: false
		                }
		            ]
			        }
			    ]
			},
        {
        	xtype:  'textfield',
       	 	fieldLabel: this.getColName('specification')+'*',
       	 	id: gu.id('specification'),
       	 	name: 'specification',
            allowBlank: false
       }
        ,{
        	xtype:  'textfield', 
        	fieldLabel: this.getColName('maker_name'),
            id: gu.id('maker_name'),
            name: 'maker_name',
            allowBlank: true
		},{
		    id:           gu.id('model_no'),
		    name:           'model_no',
		    xtype:          'combo',
		    mode:           'local',
		    editable:       true,
		    allowBlank: true,
		    queryMode: 'remote',
		    displayField:   'codeName',
		    valueField:     'codeName',
		    triggerAction:  'all',
		    fieldLabel: this.getColName('model_no'),
		    store: this.commonModelStore,
		    listConfig:{
		    	getInnerTpl: function(){
		    		return '<div data-qtip="{systemCode}">{codeName}</div>';
		    	}			                	
		    },
		    listeners: {			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
							systemCode:'',
							codeNameEn: '',
							codeName: ''
					};
					this.add(blank);
				}
			    },
		            select: function (combo, record) {
		            	console_log('Selected Value : ' + combo.getValue());
		            	var systemCode = record.get('systemCode');
		            	var codeNameEn  = record.get('codeNameEn');
		            	var codeName  = record.get('codeName');
		            	console_log('systemCode : ' + systemCode 
		            			+ ', codeNameEn=' + codeNameEn
		            			+ ', codeName=' + codeName	);
		            }
		       }
        }
		,{
		    id:           gu.id('description'),
		    name:           'description',
		    xtype:          'combo',
		    mode:           'local',
		    editable:       true,
		    allowBlank: true,
		    queryMode: 'remote',
		    displayField:   'codeName',
		    valueField:     'codeName',
		    triggerAction:  'all',
		    fieldLabel: this.getColName('description'),
		    store: this.commonDescriptionStore,
		    listConfig:{
		    	getInnerTpl: function(){
		    		return '<div data-qtip="{systemCode}">{codeName}</div>';
		    	}			                	
		    },
		    listeners: {			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
							systemCode:'',
							codeNameEn: '',
							codeName: ''
					};
					
					this.add(blank);
				}
			    },
		            select: function (combo, record) {
		            	console_log('Selected Value : ' + combo.getValue());
		            	var systemCode = record.get('systemCode');
		            	var codeNameEn  = record.get('codeNameEn');
		            	var codeName  = record.get('codeName');
		            	console_log('systemCode : ' + systemCode 
		            			+ ', codeNameEn=' + codeNameEn
		            			+ ', codeName=' + codeName	);
		            }
		       }
        }
        ,{
			xtype:  'textfield', 
			fieldLabel: this.getColName('comment'),
		    id: gu.id('comment'),
		    name: 'comment',
		    allowBlank: true
		}
		,{
		    xtype: 'fieldset',
		    border: true,
		    // style: 'border-width: 0px',
		    // title: panelSRO1186+' | '+panelSRO1187+' | '+panelSRO1188+' |
			// 통화',//panelSRO1174,
		    collapsible: false,
		    defaults: {
		        labelWidth: 40,
		        anchor: '100%',
		        layout: {
		            type: 'hbox',
		            defaultMargins: {top: 0, right: 0, bottom: 0, left: 0}
		        }
		    },
		    items: [
		
		        {
		            xtype : 'fieldcontainer',
		            combineErrors: true,
		            msgTarget: 'side',
		            defaults: {
		                hideLabel: true
		            },
		            items : [
                 {
                     xtype: 'numberfield',
                     minValue: 0,
                     width : 50,
                     id: gu.id('bm_quan'),
                     name : 'bm_quan',
                     fieldLabel: this.getColName('bm_quan'),
                     allowBlank: true,
                     value: '1',
                     margins: '0'
                 },{
                    width:          50,
                    id:           gu.id('unit_code'),
                    name:           'unit_code',
                    xtype:          'combo',
                    mode:           'local',
                    editable:       false,
                    allowBlank: false,
                    queryMode: 'remote',
	                displayField:   'codeName',
	                valueField:     'codeName',
                    value:          'PC',
                    triggerAction:  'all',
                    fieldLabel: this.getColName('unit_code'),
                   store: this.commonUnitStore,
	                listConfig:{
	                	getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}			                	
	                },
     	               listeners: {
     	                    select: function (combo, record) {
     	                    	console_log('Selected Value : ' + combo.getValue());
     	                    	var systemCode = record.get('systemCode');
     	                    	var codeNameEn  = record.get('codeNameEn');
     	                    	var codeName  = record.get('codeName');
     	                    	console_log('systemCode : ' + systemCode 
     	                    			+ ', codeNameEn=' + codeNameEn
     	                    			+ ', codeName=' + codeName	);
     	                    }
     	               }
            },
            {
                xtype: 'numberfield',
                minValue: 0,
                flex: 1,
                id : gu.id('sales_price'),
                name : 'sales_price',
                fieldLabel: this.getColName('sales_price'),
                allowBlank: true,
                value: '0',
                margins: '0'
            }, {
                width:         50,
                id:           gu.id('currency'),
                name:           'currency',
                xtype:          'combo',
                mode:           'local',
                editable:       false,
                allowBlank: false,
                queryMode: 'remote',
                displayField:   'codeName',
                valueField:     'codeName',
                value:          'KRW',
                triggerAction:  'all',
                fieldLabel: this.getColName('currency'),
                store: this.commonCurrencyStore,
                listConfig:{
                	getInnerTpl: function(){
                		return '<div data-qtip="{systemCode}">{codeName}</div>';
                	}			                	
                },
                listeners: {
	                    select: function (combo, record) {
	                    	console_log('Selected Value : ' + combo.getValue());
	                    	var systemCode = record.get('systemCode');
	                    	var codeNameEn  = record.get('codeNameEn');
	                    	var codeName  = record.get('codeName');
	                    	console_log('systemCode : ' + systemCode 
	                    			+ ', codeNameEn=' + codeNameEn
	                    			+ ', codeName=' + codeName	);
	                    }
	               }
        }
        ]
        }
	    ]
	}
		,{
            xtype: 'container',
                                        type: 'hbox',
                                        padding:'5',
                                        pack:'end',
                                        align:'left',
            defaults: {
            },
            margin: '0 0 0 0',
            border:false,
            items: [
		        {
                    xtype:'button',
                    id: gu.id('ok_btn_id'),
                    text: CMD_OK,
		            handler: function() {
		            	
		            	var item_code = gu.getCmp('item_code').getValue();
			    		if(item_code==null || item_code.length==0) {
			    			item_code = this.selectedPjCode + this.selectedAssyCode + gu.getCmp('pl_no').getValue();
			    			gu.getCmp('item_code').setValue(item_code);
			    		}

		            	
		                this.up('form').getForm().isValid();


		            	var isUpdateSpec = gu.getCmp('isUpdateSpec').getValue();
		            	var specification = gu.getCmp('specification').getValue();
		            	var unique_id = gu.getCmp('unique_id').getValue();
		            	var standard_flag = gu.getCmp('standard_flag').getValue();
		            	var idx = specification.search(gm.me().CHECK_DUP);
		            	if(idx>-1) {
		            		Ext.MessageBox.alert('경고','가공품이 아니면 규격 수정이 필요합니다. 다시 한번 확인하세요.');
		            	} else {
			            	if( (isUpdateSpec=='true' || unique_id.length < 3)
			            			
			            			&& standard_flag !='O'
			            	
			            	) {// 중복체크 필요.
			            		Ext.Ajax.request({
			            			url: CONTEXT_PATH + '/design/bom.do?method=getMaterialBySpecification',				
			            			params:{
			            				specification : specification
			            			},
			            			success : function(result, request) {
			            				var jsonData = Ext.decode(result.responseText);
			             				var found = jsonData['result'];
			             				var exist = gu.getCmp('unique_id').getValue();
			             				
			             				if(found.length>2 && exist != found ) {// 다른
																				// 중목자재
																				// 있음.
			             					Ext.MessageBox.alert('경고','표준 또는 메이커 자재에 이미 동일한 규격이 등록되어 있습니다.');
			             				} else {
			             					gm.me().addNewAction();
			    			                // resetPartForm();
			    			                // this.up('form').getForm().reset();
			             				}
			            			},// endof success for ajax
			            			failure: extjsUtil.failureMessage
			            		}); // endof Ajax
			            	} else {
			            		gm.me().addNewAction();
				                // resetPartForm();
				                // this.up('form').getForm().reset();
			            	}
		            	}
		            }
		        },{
		            xtype:'button',
		            id: gu.id('init_btn_id'),
		            text: '초기화',
		            handler: function() {
		            	gm.me().resetPartForm();
		                this.up('form').getForm().reset();
		            }
		        }
    		]
         }
    
	        ]
		});
		

    	this.equipStore = Ext.create('Mplm.store.PcsMchnStore');
    	this.equipStore.getProxy().setExtraParam('reserved_varchar9', 'Y');
    	
    	var productItems = [
            {
			    dock: 'top',
			    xtype: 'toolbar',
			    cls: 'my-x-toolbar-default2',
				items: [
				        this.searchMachineAction, 
				        this.removeSpEquip
				       ]
			}

            ];
    	 this.equipGrid = Ext.create('Rfx.view.grid.MaterialSpGrid', {
			id: this.link + '-Assembly',
			title: '대상 설비', // cloud_product_class,
			border: true,
			resizable: true,
			scroll: true,
			collapsible: false,
			store: this.equipStore,
			bbar: getPageToolbar(this.equipStore),
			layout: 'fit',
			forceFit: true,
			dockedItems: productItems
		}); //equipGrid of End
    	
        this.equipGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {
        		console_logs('여기>>>>>>>>>>>>>');
        		console_logs('BOM등록현황');
        		// try{
        		if(selections!=null && selections.length > 0){
					 var rec = selections[0];
	        		 gm.me().selected_product = rec;
					 console_logs('rec>>>>>>>>>>>>>',rec);
					 gu.getCmp('target-routeTitlename').update('<b>['+rec.get('mchn_code') + '] ' + rec.get('name_ko') +'</b>');

	        		 gm.me().classCode = rec.get('mchn_code');
	        		 gm.me().mchn_code = rec.get('mchn_code');
	        		 gm.me().modelNo = rec.get('name_ko');
	        		 gm.me().description = rec.get('description');
	        		 gm.me().parent = rec.get('unique_id');
					 gm.me().reserved_varchar1 = rec.get('mchn_code');
					 
					 gm.me().selectedChild = rec.get('unique_id');
					 gm.me().selectedAssyUid = rec.get('unique_id');
					 
	         		 gUtil.enable(gm.me().removeSpEquip);
					 gUtil.enable(gm.me().editAssyAction);
					 gUtil.enable(gm.me().bomEditAction);
					 gUtil.enable(gm.me().removeAction);
	        		 parent = rec.get('unique_id_long');
	        		 // parent_uid=rec.get('parent_uid');
	        		 // assy_parent_uid=rec.get('assy_parent_uid');
	        		 gm.me().store.getProxy().setExtraParam('parent', parent);
	        		 //gm.me().store.getProxy().setExtraParam('ac_uid', -1);
	        		 gm.me().store.getProxy().setExtraParam('parent_uid',	gm.me().selectedAssyUid);
	        		 // gm.me().store.getProxy().setExtraParam('assy_parent_uid',
						// assy_parent_uid);
	        		 gm.me().store.getProxy().setExtraParam('orderBy', "pl_no");
	        		 gm.me().store.getProxy().setExtraParam('ascDesc', "ASC");  
					 gm.me().store.load();
					 
	        		 //bom_store = gm.me().store;
        	}

    		}
        });
		
		 this.west =  Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
												// {
			    layout:'border',
			    border: true,
			    region: 'west',
	            width: '40%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [this.equipGrid/* , myFormPanel */]
			});
    	
    	return this.west;
    },
    cellEditing : Ext.create('Ext.grid.plugin.CellEditing', {
    	clicksToEdit: 1
    }),
    cellEditing1 : Ext.create('Ext.grid.plugin.CellEditing', {
    	clicksToEdit: 1
    }),
    cellEditing2 : Ext.create('Ext.grid.plugin.CellEditing', {
    	clicksToEdit: 1
    }),
    // *****************************GLOBAL VARIABLE**************************/
    grid : null,
    gridMycart : null,
    gridStock : null,
    store : null,
    myCartStore : null,
    stockStore : null,
    itemGubunType : null,
    inpuArea : null,

    sales_price : '',
    quan : '',
    selectedAssyRecord : null,
    lineGap : 35,

    selectedPjUid : '',
    selectedAssyUid : '',

    toPjUidAssy : '',	// parent
    toPjUid : '',	// ac_uid
    selectionLength : 0,

    commonUnitStore : null,
    commonCurrencyStore : null,
    commonModelStore : null,
    commonStandardStore2: null,
    GubunStore: null,

    assy_pj_code:'',
    selectedAssyCode:'',
    selectedPjCode:'',
    selectedPjName:'',
    selectedAssyDepth:0,
    selectedAssyName:'',
    selectedparent:'',
    ac_uid:'',
    selectedPjQuan : 1,
    selectedAssyQuan : 1,
    selectedMakingQuan : 1,

    addpj_code:'',
    is_complished : false,
    routeTitlename : '',
    puchaseReqTitle : '',

    CHECK_DUP : '-copied-',
    gGridMycartSelects: [],
    copyArrayMycartGrid: function(from) {

    	this.gGridMycartSelects = [];
    	if(from!=null && from.length>0) {	
    		for(var i=0; i<from.length; i++) {
    			this.gGridMycartSelects[i] = from[i];
    		}
    	}
    },
    gGridStockSelects:[],
    copyArrayStockGrid: function(from) {

    	this.gGridStockSelects = [];
    	if(from!=null && from.length>0) {	
    		for(var i=0; i<from.length; i++) {
    			this.gGridStockSelects[i] = from[i];
    		}
    	}
    },
    initTableInfo: '',
    INIT_TABLE_HEAD: function(){
    	var a =
    		'<style>'+
    		' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
    		' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
    		' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
    		' </style>' +
    		'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;">' +
    	'<colgroup>'+
    		'<col width="80px">' +
    		'<col width="90px">' +
    		'<col width="*">' +
    		
    		'<col width="90px">' +
    		'<col width="90px">' +
    		'<col width="50px">' +
    		'<col width="90px">' +
    		
    		'<col width="60px">' +
    		'<col width="60px">' +
    		'<col width="40px">' +
    		
    		'<col width="110px">' +
    		'<col width="90px">' +
    	'</colgroup>' +
    		'<tbody>' +
    		'<tr  height="30" >' +
    		'	  <td class="xl66" align=center>프로젝트코드</td>' +
    		'	  <td class="xl67" align=center>' + this.selectedPjCode + '</td>' +
    		'	  <td class="xl66" align=center>프로젝트이름</td>' +
    		'	  <td class="xl67" align=center>'+ this.selectedPjName + '</td>' +
    		'<td colspan="8" rowspan="2">'+
    		'</td>' +
    		'	 </tr>' + 
    		'<tr  height="30" >' +
    		'	  <td class="xl66" align=center>Assy코드</td>' +
    		'	  <td class="xl67" align=center>'+ this.selectedAssyCode + '</td>' +
    		'	  <td class="xl66" align=center>Assy이름</td>' +
    		'	  <td class="xl67" align=center>'+ this.selectedAssyName + '</td>' +
    		'	 </tr>' + 
    		'<tr  height="25" >' +
    		'	  <td class="xl66" align=center>품번</td>' +
    		'	  <td class="xl66" align=center>품명</td>' +
    		'	  <td class="xl66" align=center>규격</td>' +
    		
    		'	  <td class="xl66" align=center>재질</td>' +
    		'	  <td class="xl66" align=center>후처리</td>' +
    		'	  <td class="xl66" align=center>열처리</td>' +
    		'	  <td class="xl66" align=center>제조원</td>' +
    		
    		'	  <td class="xl66" align=center>예상가격</td>' +
    		'	  <td class="xl66" align=center>수량</td>' +
    		'	  <td class="xl66" align=center>구분</td>' +
    		'	  <td class="xl66" align=center>품목코드</td>' +
    		'	  <td class="xl66" align=center>UID</td>' +
    	'	 </tr>';
    		
    		return a;
    	},
    	INIT_TABLE_TAIL: 
    		'</tbody></table><br><br>' +
    		'<div style="color:blue;font-size:11px;position:relative; "><ul>'+
    		'<li>Excel Form에서는 엑셀프로그램과 Copy/Paste(복사/붙여넣기)하여 BOM을 생성,수정할 수 있습니다.</li>'+
    		'<li>위 영역의 모든 셀을 선택하여 복사(Ctrl+C)하여 엑셀에 붙여넣기(Ctrl+P) 해보세요.</li>'+
    		'<li>엑셀 작업 후 작업한 내용을 복사 한 후 다시 이곳에 붙여넣기 하고 [디플로이] 버튼을 눌러 저장하세요.</li>'+
    		'</ul></div>',
    	makeInitTable : function() {
    		var initTableLine = 
    			'	 <tr height="25" style="height:12.75pt">' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl65">&nbsp;</td>' +
    			'	  <td class="xl67">&nbsp;</td>' +
    			'	  <td class="xl67">&nbsp;</td>' +
    			'	 </tr>';

			this.initTableInfo = INIT_TABLE_HEAD();
			this.initTableInfo = this.initTableInfo + INIT_TABLE_TAIL;
    	},
    	bomTableInfo : '',
    	
    	createLine: function (val, align, background, style) {
    		return '<td height="25" class="' + style + '" style="background:' + background + '" align=' + align + '>'+ val + '</td>' ;
    	},

    	setChildQuan : function (n) {
    		var o = gu.getCmp('childCount');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    	},
    	
    	setAssyQuan : function(n) {
    		var o = gu.getCmp('assy_quan');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    	},
    	setProjectQuan : function(n) {
    		var o = gu.getCmp('pj_quan');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    	},

    	setMaking_quan : function(n) {
    		var o = gu.getCmp('making_quan');
    		if(o!=null) {
    			o.update(''+ n);	
    		}
    		
    	},

    	createHtml : function(route_type, rqstType, catmapObj) {
    		var htmlItems =
    			'<style>'+
    			' .xl65 {padding-left:2px;padding-right:2px;  font-size:11px; }'+
    			' .xl66 {padding-left:2px;padding-right:2px; background: #FFFF99;  font-size:11px;}' +
    			' .xl67 {padding-left:2px;padding-right:2px; background:#F0F0F0; font-size:9px;}' +
    			' </style><hr />' + '<div style="overflow-y:scroll;overflow-x: hidden;height:140px;">' +
    		'<table border="1" cellpadding="1" cellspacing="1" style="border-collapse: collapse;width:790px;">' +
    		'<colgroup>'+
    			'<col width="10%">' +
    			'<col width="10%">' +
    			'<col width="10%">' +
    			'<col width="20%">' +
    			'<col width="40%">' +
    		'</colgroup>' +
    			'<tbody>' +
    			'<tr  height="25" >' +
    			'	  <td class="xl67" align=center>품목코드</td>' +
    			'	  <td class="xl67" align=center>필요수량</td>' +
    			'	  <td class="xl67" align=center>' + rqstType + '수량</td>' +
    			'	  <td class="xl67" align=center>품명</td>' +
    			'	  <td class="xl67" align=center>규격</td>' +
    			'	 </tr>' ;
    		for(var i=0; i< catmapObj.length; i++) {
    			var rec = catmapObj[i];// grid.getSelectionModel().getSelection()[i];
    			var item_code = rec.get('item_code');
    			var quan = route_type=='P' ? rec.get('reserved_double1') : rec.get('goodsout_quan');
    			var new_pr_quan = rec.get('new_pr_quan');
    			var item_name = rec.get('item_name');
    			var specification = rec.get('specification');
    			
    			htmlItems = htmlItems + '	 <tr height="20" style="height:12.75pt">';
    			htmlItems = htmlItems + createLine(item_code, 'center', '#FFFFFF', 'xl65');// 품번
    			htmlItems = htmlItems + createLine(new_pr_quan, 'right', '#FFFFFF', 'xl65');// 품번
    			htmlItems = htmlItems + createLine(quan, 'right', '#FFFFFF', 'xl65');// 품번
    			htmlItems = htmlItems + createLine(item_name, 'left', '#FFFFFF', 'xl65');// 품번
    			htmlItems = htmlItems + createLine(specification, 'left', '#FFFFFF', 'xl65');// 품번
    			htmlItems = htmlItems + '</tr>';

    		}
    		htmlItems = htmlItems + '</tbody></table></div>';
    		return htmlItems;
    	},

    	setMakeTable : function(records) {
    		this.bomTableInfo = this.INIT_TABLE_HEAD();
    		if(records==null || records.length==0) {
    			// bomTableInfo = initTableInfo;
    		} else {
    			
    			for( var i=0; i<records.length; i++) {
    	          	var rec = records[i];
    	        	var unique_id =  rec.get('unique_id');
    	        	var unique_uid =  rec.get('unique_uid');
    	        	var item_code =  rec.get('item_code');
    	        	var item_name =  rec.get('item_name');
    	        	var specification =  rec.get('specification');
    	        	var standard_flag =  rec.get('standard_flag');
    	        	var sp_code =  rec.get('sp_code'); // 표시는 고객사 선책톧로
    	        	
    	        	var model_no =  rec.get('model_no');	
    	        	var description =  rec.get('description');
    	        	var pl_no =  rec.get('pl_no');
    	        	var comment =  rec.get('comment');
    	        	var maker_name =  rec.get('maker_name');
    	        	var bm_quan =  rec.get('bm_quan');
    	        	var unit_code =  rec.get('unit_code');
    	        	var sales_price =  rec.get('sales_price');
    	        	
    	        	this.bomTableInfo = this.bomTableInfo + '	 <tr height="25" style="height:12.75pt">';
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(pl_no, 'center', '#FFFFFF', 'xl65');// 품번
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(item_name, 'left', '#FFFFFF', 'xl65');// 품명
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(specification, 'left', '#FFFFFF', 'xl65');// 규격
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(model_no, 'left', '#FFFFFF', 'xl65');// 재질/모델
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(description, 'left', '#FFFFFF', 'xl65');// 후처리
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(comment, 'left', '#FFFFFF', 'xl65');// 열처리
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(maker_name, 'left', '#FFFFFF', 'xl65');// 제조원
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(sales_price, 'right', '#FFFFFF', 'xl65');// 예상가(숫자)
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(bm_quan, 'right', '#FFFFFF', 'xl65');// 수량(숫자)
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(sp_code, 'center', '#FFFFFF', 'xl65');// 구분기호
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(item_code, 'center', '#F0F0F0', 'xl67');// 품목코드
    	        	this.bomTableInfo = this.bomTableInfo + this.createLine(unique_uid, 'center', '#F0F0F0', 'xl67');// UID
    	        	this.bomTableInfo = this.bomTableInfo + '	 </tr>';
    			}
    		}
    		this.bomTableInfo = this.bomTableInfo + this.INIT_TABLE_TAIL;
    		var o = gu.getCmp('bom_content');
    		o.setValue(this.bomTableInfo);
    	},

    	insertStockStoreRecord: function(records) {},
    	

    	cloudprojectStore : Ext.create('Mplm.store.cloudProjectStore', {} ),
	    mesProjectTreeStore : Ext.create('Mplm.store.MesProjectTreeStore', {}),
	    routeGubunTypeStore : Ext.create('Mplm.store.RouteGubunTypeStore', {} ),
	    routeGubunTypeStore_W : Ext.create('Mplm.store.RouteGubunTypeStore_W', {} ),
	    commonStandardStore : Ext.create('Mplm.store.CommonStandardStore', {hasNull: true} ),
	    


    	renderCarthistoryPlno : function(value, p, record) {
    		var unique_uid = record.get('unique_uid');
    		
    	    return Ext.String.format(
    	            '<a href="#" onclick="popupCarthistoryPlno(\'{0}\', \'{1}\')" >{1}</a>',
    	           unique_uid, value
    	        );
    	},


    	getPosStandard: function(id){

    		for (var i=0; i<this.standard_flag_datas.length; i++){
    			if(this.standard_flag_datas[i].get('systemCode') == id){
    				return this.standard_flag_datas[i];
    			}
    		}
    		return null;
    	},

    	selectAssy: function(routeTitlename, depth) {
    		console_logs('routeTitlename', routeTitlename);
    		// addAction.enable();
    		this.searchMachineAction.enable();
    		this.inpuArea.enable();
    		gu.getCmp('addPartForm').enable();
    		gu.getCmp('target-routeTitlename').update('<b>'+routeTitlename+'</b>'); 
    		if(depth==1) {
    			this.editAssyAction.disable();
    			this.removeSpEquip.disable();
    		} else {
    			this.editAssyAction.enable();
    			this.removeSpEquip.enable();		
    		}


    	},

    	unselectAssy : function() {
    		// this.addAction.disable();
    		this.searchMachineAction.disable();
    		this.editAssyAction.disable();
    		this.removeSpEquip.disable();
    		this.inpuArea.disable();
    		gu.getCmp('bom_content').setValue(initTableInfo);
    		gu.getCmp('addPartForm').disable();
    		gu.getCmp('target-routeTitlename').update('Assembly를 선택하세요.'); 
    	},


    	item_code_dash: function(item_code){
    		if(item_code==null || item_code.length<13) {
    			return item_code;
    		}else {
    			return item_code.substring(0,12);
    		}
    	},

    	setReadOnlyName: function(name, readonly) {
    		this.setReadOnly(Ext.getCmp(name), readonly);
    	},

    	setReadOnly: function(o, readonly) {
    		if(o!=undefined && o!=null) {
        	    o.setReadOnly(readonly);
        	    if (readonly) {
        	        o.setFieldStyle('background-color: #E7EEF6; background-image: none;');
        	    } else {
        	        o.setFieldStyle('background-color: #FFFFFF; background-image: none;');
        	    }    			
    		}


    	},

    	getPl_no: function (systemCode) {
    	 	var prefix = systemCode;
    	 	if(systemCode=='S') {
    	 		prefix = 'K';
    	 	} else if(systemCode=='O') {
    	 		prefix = 'A';
    	 	}
    		   Ext.Ajax.request({
    			url: CONTEXT_PATH + '/design/bom.do?method=lastnoCloud',
    			params:{
    				first:prefix,
    				parent_uid:this.selectedparent
    			},
    			success : function(result, request) {   
    				var result = result.responseText;
    				var str = result;	// var str = '293';
    				gu.getCmp('pl_no').setValue(str);

    				
    			},
    			failure: extjsUtil.failureMessage
    		});
    	},



    	 fPERM_DISABLING_Complished: function() {
    		// 1. 권한있음.
    		if (fPERM_DISABLING() == false && is_complished == false) {
    			return false;
    		} else { // 2.권한 없음.
    			return true;
    		}
    	},

    	// Define reset Action
    	resetAction : Ext.create('Ext.Action', {
    		 itemId: 'resetButton',
    		 iconCls: 'af-remove',
    		 text: CMD_INIT,
    		 handler: function(widget, event) {
    			 resetPartForm();
    			 gu.getCmp('addPartForm').getForm().reset();
    			 // console_logs('getForm().reset()', 'ok');
    		 }
    	}),
    	
    	pasteAction : Ext.create('Ext.Action', {
    		 itemId: 'pasteActionButton',
    		 iconCls: 'paste_plain',
    		 text: '현재 Assy에 붙여넣기',
    		 disabled: true,
    		 handler: function(widget, event) {
    		    	if(this.selectedparent==null || this.selectedparent=='' || this.selectedPjUid==null || this.selectedPjUid=='') {
    		    		Ext.MessageBox.alert('오류','먼저 BOM을 붙여넣을 \r\n대상 Assembly를선택하세요.');
    		    	} else {

    		    	    var fp = Ext.create('Ext.FormPanel', {
    		    	    	id: gu.id('formPanelSelect'),
    		    	    	frame:true,
    		    	        border: false,
    		    	        fieldDefaults: {
    		    	            labelWidth: 80
    		    	        },
    		    	        width: 300,
    		    	        height: 220,
    		    	        bodyPadding: 10,
    		    	        items: [
    							{
    								xtype: 'component',
    								html:'복사 수행시 수량을 1로 초기화하거나<br> 품번을 대상 Assy에 맞게 재 부여할 수 있습니다.<br>아래에서 선택하세요.'
    							},
    		    	            {
    				    	        xtype: 'container',
    				    	        layout: 'hbox',
    				    	        margin: '10 10 10',
    				    	        items: [{
    						    	            xtype: 'fieldset',
    						    	            flex: 1,
    						    	            border: false,
    						    	            // title: '복사 수행시 수량을 1로 초기화하거나
												// 품번을 대상 Assy에 맞게 재 부여할 수
												// 있습니다.',
    						    	            defaultType: 'checkbox', // each
																			// item
																			// will
																			// be a
																			// checkbox
    						    	            layout: 'anchor',
    						    	            defaults: {
    					    	                anchor: '100%',
    					    	                hideEmptyLabel: false
    					    	            },
    					    	            items: [
    				    	                {
    					    	                fieldLabel: '복사 옵션',
    					    	                boxLabel: '수량을 1로 초기화',
    					    	                name: 'resetQty',
    					    	                checked: true,
    					    	                inputValue: 'true'
    					    	            }, {
    					    	                boxLabel: '품번 재부여',
    					    	                name: 'resetPlno',
    					    	                checked: true,
    					    	                inputValue: 'true'
    					    	            },  new Ext.form.Hidden({
    					        	            name: 'hid_null_value'
    					        		        })]
    				    	        }]
    				    	    }]
    			    	    });
    		    	    
    		    	    w = Ext.create('ModalWindow', {
    			            title:CMD_ADD  + ' :: ' + /* (G) */vCUR_MENU_NAME,
    			            width: 300,
    			            height: 220,
    			            plain:true,
    			            items: fp,
    			            buttons: [{
    			                text: '복사 실행',
    			                disabled: false,
    			            	handler: function(btn){
    			            		var form = gu.getCmp('formPanelSelect').getForm();
    		            			var val = form.getValues(false);
    		            		    var selections = gridMycart.getSelectionModel().getSelection();
    		            		    if (selections) {
    		            		        	var uids = [];
    		            		        	for(var i=0; i< selections.length; i++) {
    		            		        		var rec = selections[i];
    		            		        		var unique_uid = rec.get('unique_uid');
    		            		        		uids.push(unique_uid);
    		            		        	}
    		            		      	   Ext.Ajax.request({
    		            		      			url: CONTEXT_PATH + '/design/bom.do?method=addBomcopyAssymap',
    		            		      			params:{
    		            		      				project_uid: this.selectedPjUid,
    		            		      				parent_uid:  this.selectedparent,
    		            		      				unique_uids: uids,
    		            		      				resetQty: val['resetQty'],
    		            		      				resetPlno: val['resetPlno']
    		            		      			},
    		            		      			success : function(result, request) {   
    		            		            		if(w) {
    		            		            			w.close();
    		            		            		}
    		            		      				var result = result.responseText;
    	            		     					this.myCartStore.load(function() {});
    		            		      				// Ext.MessageBox.alert('결과','총
													// ' + result + '건을
													// 복사하였습니다.');
    		            		     				store.load( function(records) {
    		            		     					gm.me().insertStockStoreRecord(records);
    		            		     					gm.me().setChildQuan(records.length);
    		            			     					
    		            			     			});
    		            		      			},
    		            		      			failure: extjsUtil.failureMessage
    		            		      		});

    		            		    }

    			            	}
    						},{
    			                text: CMD_CANCEL,
    			            	handler: function(){
    			            		if(w) {
    			            			w.close();
    			            		}
    			            	}
    						}]
    			        }); w.show();
    		    		
    		    		
    		    	}
    		 }
    	}),



    	// 수정등록
    	modRegAction : Ext.create('Ext.Action', {
    		 itemId: 'modRegAction',
    		 iconCls: 'page_copy',
    		 text: '값 복사',
    		 disabled: true,
    		 handler: function(widget, event) {
    			 gm.me().unselectForm();
    			 grid.getSelectionModel().deselectAll();
    		 }
    	}),
    	cleanComboStore: function(cmpName)
    	{
    	    var component = Ext.getCmp(cmpName); 
    	    
    	    component.setValue('');
    	    component.setDisabled(false);
    		component.getStore().removeAll();
    		component.setValue(null)
    		component.getStore().commitChanges();
    		component.getStore().totalLength = 0;
    	},

    	resetParam: function() {
    		this.store.getProxy().setExtraParam('unique_id', '');
    		this.store.getProxy().setExtraParam('item_code', '');
    		this.store.getProxy().setExtraParam('item_name', '');
    		this.store.getProxy().setExtraParam('specification', '');
    	},

    	loadTreeAllDef: function(){
    		this.loadTreeAll(this.selectedPjUid);
    	},
    	loadTreeAll: function(pjuid) {
    		// this.pjTreeGrid.setLoading(true);
    		
    		this.mesProjectTreeStore.removeAll(true);
    		this.mesProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
    		this.mesProjectTreeStore.load( {		
    			callback: function(records, operation, success) {

    			}
    		});
    	},
    	
    	setBomData: function(id) {

    		this.modRegAction.enable();
    		this.resetPartForm();
    		
    		Ext.Ajax.request({
    			url: CONTEXT_PATH + '/purchase/material.do?method=read',
    			params:{
    				id :id
    			},
    			success : function(result, request) {   
    	       		
    				var jsonData = Ext.decode(result.responseText);
    				console_logs('jsonData', jsonData);
    				var records = jsonData.datas;
    				// console_logs('records', records);
    				// console_logs('records[0]', records[0]);
    				gm.me().setPartFormObj(records[0]);
    			},
    			failure: extjsUtil.failureMessage
    		});
    		
    	},
    	
    	
    	
    	setPartFormObj : function(o) {

    		// 규격 검색시 standard_flag를 sp_code로 사용하기
    		Ext.Ajax.request({
    			url: CONTEXT_PATH + '/purchase/request.do?method=getPoCondition',				
    			success : function(result) {
    				var text = result.responseText;
    				console_logs('text', text);
    				var o2 = JSON.parse(text, function (key, value) {
    						    return value;
    						});
    				
    			   console_logs('o>>>>>>', o);

    				var standard_flag =  o['standard_flag'];
    				
    				gu.getCmp('unique_id').setValue( o['unique_id']);
    				gu.getCmp('unique_uid').setValue( o['unique_uid']);
    				gu.getCmp('item_code').setValue( o['item_code']);
    				Ext.getCmp(gu.id('item_name')).setValue( o['item_name']);
    				Ext.getCmp(gu.id('specification')).setValue( o['specification']);
    				Ext.getCmp(gu.id('remark')).setValue( o['remark']);
    				Ext.getCmp(gu.id('child')).setValue(o['unique_id_long']);

    				gu.getCmp('standard_flag').setValue(standard_flag);
    				// gu.getCmp('standard_flag_disp').select(getPosStandard(standard_flag));
    				gu.getCmp('model_no').setValue( o['model_no']);	
    				gu.getCmp('description').setValue( o['description']);
    				
    				gu.getCmp('comment').setValue( o['comment']);
    				gu.getCmp('maker_name').setValue( o['maker_name']);
    				gu.getCmp('bm_quan').setValue('1');
    				gu.getCmp('unit_code').setValue( o['unit_code']);
    				gu.getCmp('sales_price').setValue( o['sales_price']);
    				
    				
    				gm.me().getPl_no(standard_flag);
    				
    				var currency =  o['currency'];
    				if(currency==null || currency=='') {
    					currency = 'KRW';
    				}
    				gu.getCmp('currency').setValue(currency);
    				
    			},
    			failure: extjsUtil.failureMessage
    		});
    	},
    	
    	// setPartForm: function(record) {
    	// 	// console_logs('record:', record);

    	// 	gu.getCmp('unique_id').setValue( record.get('unique_id'));
    	// 	gu.getCmp('unique_uid').setValue( record.get('unique_uid'));
    	// 	gu.getCmp('item_code').setValue( record.get('item_code'));

    	// 	gu.getCmp('item_name').setValue( record.get('item_name'));
    	// 	gu.getCmp('specification').setValue( record.get('specification'));
    		
    	// 	var standard_flag =  record.get('standard_flag');
    	// 	gu.getCmp('standard_flag').setValue(standard_flag);
    		
    	// 	gu.getCmp('standard_flag_disp').select(getPosStandard(standard_flag));
    	// 	gu.getCmp('model_no').setValue( record.get('model_no'));	
    	// 	gu.getCmp('description').setValue( record.get('description'));
    	// 	gu.getCmp('pl_no').setValue( record.get('pl_no'));
    	// 	gu.getCmp('comment').setValue( record.get('comment'));
    	// 	gu.getCmp('maker_name').setValue( record.get('maker_name'));
    	// 	gu.getCmp('bm_quan').setValue( record.get('bm_quan'));
    	// 	gu.getCmp('unit_code').setValue( record.get('unit_code'));
    	// 	gu.getCmp('sales_price').setValue( record.get('sales_price'));
    		
    		
    	// 	var currency =  record.get('currency');
    	// 	if(currency==null || currency=='') {
    	// 		currency = 'KRW';
    	// 	}
    	// 	gu.getCmp('currency').setValue(currency);
    		
    	// 	var ref_quan = record.get('ref_quan');
    	// 	// console_logs('ref_quan', ref_quan);
    	// 	if(ref_quan>1) {
    	// 		this.readOnlyPartForm(true);
    	// 		gu.getCmp('isUpdateSpec').setValue('false');
    	// 	} else {
    	// 		this.readOnlyPartForm(false);
    	// 		this.setReadOnlyName(gu.id('item_code'), true);
    	// 		this.setReadOnlyName(gu.id('standard_flag_disp'), true);
    	// 		gu.getCmp('isUpdateSpec').setValue('true');
    	// 	}

    	// },

    	resetPartForm: function() {
			console_logs('resetPartForm');
			
    		gu.getCmp('unique_id').setValue( '');
    		gu.getCmp('unique_uid').setValue( '');
    		gu.getCmp('item_code').setValue( '');
    		gu.getCmp('item_name').setValue( '');
    		gu.getCmp('specification').setValue('');
    		gu.getCmp('standard_flag').setValue('');
    		gu.getCmp('standard_flag_disp').setValue('');

    		gu.getCmp('model_no').setValue('');
    		gu.getCmp('description').setValue('');
    		gu.getCmp('pl_no').setValue('');
    		gu.getCmp('comment').setValue('');
    		gu.getCmp('maker_name').setValue('');
    		gu.getCmp('bm_quan').setValue('1');
    		gu.getCmp('unit_code').setValue('');
    		gu.getCmp('sales_price').setValue( '0');

    		gu.getCmp('currency').setValue('KRW');
    		gu.getCmp('unit_code').setValue('PC');
    		//this.readOnlyPartForm(false);
    	},

    	unselectForm: function(){

    		gu.getCmp('unique_id').setValue('');
    		gu.getCmp('unique_uid').setValue('');
    		gu.getCmp('item_code').setValue('');
    		
    		var cur_val = gu.getCmp('specification').getValue();
    		var cur_standard_flag = gu.getCmp('standard_flag').getValue();
    		
    		if(cur_standard_flag!='O') {
    			gu.getCmp('specification').setValue(cur_val + ' ' + this.CHECK_DUP);		
    		}
    		
    		gu.getCmp('currency').setValue('KRW');
    		
    		this.getPl_no(gu.getCmp('standard_flag').getValue());
    		//this.readOnlyPartForm(false);
    	},

    	readOnlyPartForm :function(b) {

			console_logs('readOnlyPartForm', b);

    		this.setReadOnlyName(gu.id('item_code'), b);
    		this.setReadOnlyName(gu.id('item_name'), b);
    		this.setReadOnlyName(gu.id('specification'), b);
    		this.setReadOnlyName(gu.id('standard_flag'), b);
    		this.setReadOnlyName(gu.id('standard_flag_disp'), b);

    		this.setReadOnlyName(gu.id('model_no'), b);
    		this.setReadOnlyName(gu.id('description'), b);
    		// this.setReadOnlyName('pl_no', b);
    		this.setReadOnlyName(gu.id('comment'), b);
    		this.setReadOnlyName(gu.id('maker_name'), b);

    		this.setReadOnlyName(gu.id('currency'), b);
    		this.setReadOnlyName(gu.id('unit_code'), b);
    		
    		gu.getCmp('search_information').setValue('');
    		
    	},

    	addNewAction: function() {

    		var form = gu.getCmp('addPartForm').getForm();
    	    if(form.isValid()) {
    	    	var val = form.getValues(false);
    	    	
    	    	val['parent'] = this.selectedparent;
    	    	val['ac_uid'] = this.selectedPjUid;
        	    val['pj_code'] = this.selectedPjCode;
        	    val['coord_key2'] = this.order_com_unique;
            	val['assy_name'] = this.selectedAssyName;
                val['pj_name'] = this.selectedPjName;
    	    	
    	    	
  				 Ext.Ajax.request({
					url: CONTEXT_PATH + '/design/bom.do?method=createNew',
					params : val,
				    method: 'POST',
				    success : function() {
           			
           			gm.me().store.load(function(records){
           				gm.me().unselectForm();
           				gm.me().setChildQuan(records.length);
           				gm.me().resetPartForm();
           			});
           			           			
           		},
	               failure: function (result, op)  {
	            	   var jsonData = Ext.util.JSON.decode(result.responseText);
	                   var resultMessage = jsonData.data.result;
	            	   Ext.Msg.alert('안내', '저장에 실패하였습니다.' + " : " + resultMessage, function() {});
	               	
	               }
	        	 });   	

    	    }
    	},

    	searchAction : Ext.create('Ext.Action', {
    		itemId: 'searchButton',
    		iconCls: 'af-search',
    	    text: CMD_REFRESH,
    	    disabled: false ,
    	    handler: function ()
    	    {
    	    	gm.me().myCartStore.load(function() {});
    	    }
    	}),


    	Item_code_dash: function(item_code){
    			return item_code.substring(0,5) + "-" + item_code.substring(5, 9) + "-" +
    					item_code.substring(9, 12);
    	},

    	getColName: function (key) {
    		return gMain.getColNameByField(this.fields, key);
    	},

    	getTextName: function (key) {
    		return gMain.getColNameByField(this.fields, key);
    	},
    	
    	
    	materialClassStore : new Ext.create('Ext.data.Store', {

    		fields:[     
    		        { name: 'class_code', type: "string"  }
    		        ,{ name: 'class_name', type: "string" }
    		        ,{ name: 'level', type: "string"  } 
    	    ],
    		sorters: [{
    	        property: 'display_order',
    	        direction: 'ASC'
    	    }],
    	    proxy: {
    	    	type: 'ajax',
    	    	url: CONTEXT_PATH + '/design/class.do?method=read',
    	    	reader: {
    	    		type:'json',
    	    		root: 'datas',
    	    		totalProperty: 'count',
    	    		successProperty: 'success'
    	    	},
    	    	extraParams : {
    	    		level: '2',
    	    		parent_class_code: ''
    	    	}
    	    	,autoLoad: true
    	    }
    	}),
    	standard_flag_datas : [],
    	pjTreeGrid: null,
    	expandAllTree: function() {
    		if(this.pjTreeGrid!=null) {
    			this.pjTreeGrid.expandAll();
    		}
    	},
    	isExistMyCart: function(inId) {
    		var bEx = false;// Not Exist
    		this.myCartStore.data.each(function(item, index, totalItems) {
    	        console_logs('item', item);
    	        var uid = item.data['unique_uid'];
    	        console_logs('uid', uid);
    	        console_logs('inId', inId);
    	        if(inId == uid) {
    	        	bEx = true;// Found
    	        }
    	    });
    		
    		return bEx;
    	},
        loadStore: function(child) {
        	
        	this.store.getProxy().setExtraParam('child', child);
        	
    	    this.store.load( function(records){
    	     	console_logs('==== storeLoadCallback records', records);
            	console_logs('==== storeLoadCallback store', store);

            });
    	    
        },
        arrAssyInfo: function(o1, o2, o3, o4, o5, o6, o7, o8){
        	gm.me().mtrlChilds = o1;
        	gm.me().bmQuans = o2;
        	gm.me().itemCodes = o3;
        	gm.me().spCode = o4;
        	gm.me().ids = o5;
        	gm.me().levels = o6;
        	gm.me().bomYNs = o7;
        	gm.me().pcr_divs= o8;
        },
// selectedClass1 : '',
// selectedClass2 : '',
// selectedClass3 : '',
        selectedClassCode: '',
        materialStore: Ext.create('Mplm.store.MtrlSubStore'),
        productSubStore:Ext.create('Mplm.store.ProductSubStore')
        // makeClassCode : function() {
        // this.selectedClassCode = this.selectedClass1 + this.selectedClass2 +
		// this.selectedClass3
        // }
        
        
        ,
        addMtrlGrid : null,
        addPrdGrid : null,
        deleteConfirm: function(result) {
            if (result == 'yes') {
                var arr = gm.me().selectionedUids;
                // console_logs('deleteConfirm arr', arr);
                if (arr.length > 0) {

                    var CLASS_ALIAS = gm.me().deleteClass;
                    // console_logs('deleteConfirm CLASS_ALIAS', CLASS_ALIAS);
                    // 삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
                    if (CLASS_ALIAS == null) {
                        CLASS_ALIAS = [];
                        for (var i = 0; i < gm.me().fields.length; i++) {
                            var tableName = o['tableName'] == undefined ? 'map' : o['tableName'];
                            if (tableName != 'map') {
                                CLASS_ALIAS.push(tableName);
                            }

                        }
                        CLASS_ALIAS = extjsUtil.mergeDuplicateArray(CLASS_ALIAS);
                    }
                    // console_logs('deleteConfirm CLASS_ALIAS 2', CLASS_ALIAS);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/generalData.do?method=delete',
                        params: {
                            DELETE_CLASS: CLASS_ALIAS,
                            uids: arr
                        },
                        method: 'POST',
                        success: function(rec, op) {
                            // console_logs('success rec', rec);
                            // console_logs('success op', op);
                            // gm.me().redrawStore();
                            gm.me().store.load()

                        },
                        failure: function(rec, op) {
                            Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});

                        }
                    });

                }
            }

    	},
    	removeSpEquipConfirm: function(result) {
    		if(result=='yes') {
            	if(gm.me().parent == null) {
        			Ext.MessageBox.alert('선택 확인', '선택한 설비가 없습니다.');
        			return;
            	} else {
    		    	var id = gm.me().parent;
    		    		
    	        		    		Ext.Ajax.request({
    	        		     			url: CONTEXT_PATH + '/production/machine.do?method=removeSpbom',
    	        		     			params:{
    	        		     				unique_id : id
    	        		     			},
    	        		     			success : function(result, request) {   
    	        		     				console_logs('result', result);
    	        	        				var jsonData = Ext.decode(result.responseText);
    	        	        				console_logs('jsonData', jsonData);
    	        	        				gm.me().equipStore.load();
    	        		     			},
    	        		     			failure: function(rec, op) {
    	        	                        Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});
    	        	                    }
    	        		       	    });
    		    	}
            	}

    	},
    	registPartFc: function(val) {
            console_logs('registPartFc val', val);
// gm.me().addNewAction(val);
        	Ext.Ajax.request({
    			url: CONTEXT_PATH + '/purchase/material.do?method=addChildBOMTree',
    			params:{
                    parent: val['parent'],
					bm_quan: val['bm_quan'],
                    child: val['child'],
                    item_code: val['item_code'],
                    item_name: val['item_name'],
                    pl_no:val['pl_no'],
                    level:val['reserved_integer1'],
					assytop_uid:val['parent_uid'],
					parent_uid:val['parent_uid'],
					specification:val['specification']
    			},

        		success : function(result, request) {   
        			gm.me().store.getProxy().setExtraParam('parent', gm.me().parent);
                    gm.me().store.getProxy().setExtraParam('parent_uid', gm.me().selectedAssyUid);
                    gm.me().store.getProxy().setExtraParam('ac_uid', -1);
           		 	gm.me().store.load();
    				//Ext.MessageBox.alert('성공','자재가 정상적으로 등록 되었습니다.');
    				
    			},
    			failure: extjsUtil.failureMessage
    		});
        }
    	
});
