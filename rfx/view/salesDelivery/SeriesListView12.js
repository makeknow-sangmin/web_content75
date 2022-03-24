Ext.define('Rfx.view.salesDelivery.SeriesListView', {
  extend: 'Rfx.base.BaseView',
  xtype: 'series-list-view',
  initComponent: function () {
    this.initDefValue();

    //검색툴바 필드 초기화
    this.initSearchField();

    //검색툴바 추가
    // this.addSearchField({
    //   // type: 'combo',
    //   field_id: 'unique_id',
    //   emptyText: '장비 선택',
    //   store: 'equipmentPropsComboStore',
    //   displayField: 'name_ko',
    //   valueField: 'unique_id',
    //   // ,value: 'unique_id'
    //   innerTpl: '<div data-qtip='{unique_id}'>{name}</div>',
    // });
    // 검색 툴바에 콤보로 적용할지 TestField로 적용할지 ?

    // 검색 툴바 Text Search Fields
    this.addSearchField('mchn_code');
    this.addSearchField('name_ko'); //.J2_CODE에 추가후 적용 예정 

    //검색툴바 생성
    var searchToolbar = this.createSearchToolbar();

    // //명령툴바 생성
    var buttonToolbar = this.createCommandToolbar({
      REMOVE_BUTTONS: ['REMOVE', 'COPY', 'EDIT','REGIST'],
    });

    // default load store 선언 EquipmentProps.js 
    this.createStore(
      'Rfx.model.SeriesAdd',
      [
        {
          property: 'unique_id',
          direction: 'DESC',
          sorter: [
            {
              property: 'unique_id',
              direction: 'DESC',
            },
          ],
        },
      ],
      gMain.pageSize,
      console.log('gMainPage', gMain.pageSize),
      // 10000/*pageSize*/
      {},
      ['srcahd'] //삭제테이블 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
    );

    this.createGrid(searchToolbar, buttonToolbar);

    this.createCrudTab();

    Ext.apply(this, {
      layout: 'border',
      items: [this.grid, this.crudTab],
    });

    // 신규등록 버튼 선언
    this.addPropsButton = Ext.create('Ext.Action', {
      xtype: 'button',
      iconCls: 'af-plus-circle',
      text: '반제품 등록',
      tooltip: 'RAP 코드등록 반제품',
      disabled: false,
      handler: function () {
        gm.me().addProps();
      }
    });

    // 신규등록 버튼 선언
    this.addPropsButton2 = Ext.create('Ext.Action', {
      xtype: 'button',
      iconCls: 'af-plus-circle',
      text: '제품 등록',
      tooltip: 'RAP 코드등록 반제품',
      disabled: false,
      handler: function () {
        gm.me().addProps2();
      }
    });

    // 수정 버튼 선언
    this.modifyPropsButton = Ext.create('Ext.Action', {
      xtype: 'button',
      iconCls: 'af-edit',
      text: gm.getMC('CMD_MODIFY', '수정'),
      tooltip: '속성 수정',
      disabled: true,
      handler: function () {

        var rec = gm.me().grid.getSelectionModel().getSelection()[0];
      var class_code = rec.get('class_code');

      //제품과 반제품의경우 수정창 다르게
       if(class_code == 'RAP'){
          gm.me().modifyRapProps();
       }else if(class_code == 'RPD'){
        gm.me().modifyPrdProps();
       }
      },
    });

      // 복사 버튼 선언
      this.copyPropsButton = Ext.create('Ext.Action', {
        xtype: 'button',
        iconCls: 'af-edit',
        text: '복사등록',
        tooltip: '제품 복사',
        disabled: true,
        handler: function () {
          var rec = gm.me().grid.getSelectionModel().getSelection()[0];
          var class_code = rec.get('class_code');

          if(class_code == 'RAP'){
            gm.me().copyRapProps();
          }else if(class_code == 'RPD'){
            gm.me().copyPrdProps();
          }
          
        },
      });

    // 삭제 버튼 선언
    this.deletePropsButton = Ext.create('Ext.Action', {
      xtype: 'button',
      iconCls: 'af-remove',
      text: gm.getMC('CMD_DELETE', '삭제'),
      tooltip: '속성 삭제',
      disabled: true,
      handler: function () {
        gm.me().deleteProps();
      }
    });


 

    // buttonToolbar.items.each(function (item, index, length) {
    //   if (index == 1 || index == 2) {
    //     buttonToolbar.items.remove(item);
    //   }
    // });

    // 명령툴바 버튼 삽입
    buttonToolbar.insert(1, this.addPropsButton);
    buttonToolbar.insert(2, this.addPropsButton2);
    buttonToolbar.insert(3, this.modifyPropsButton);
    buttonToolbar.insert(4, this.copyPropsButton);
    buttonToolbar.insert(5, this.deletePropsButton);
    
    this.callParent(arguments);

    // Row 클릭시 수정 및 삭제 버튼 활성화
    this.setGridOnCallback(function (selections) {
      console_logs('>>>>callback', selections);
      if (selections != null && selections.length > 0) {
        this.modifyPropsButton.enable();
        this.deletePropsButton.enable();
        this.copyPropsButton.enable();
      } else {
        this.modifyPropsButton.disable();
        this.deletePropsButton.disable();
        this.copyPropsButton.disable();
      }
    });

    //옵션펙터 그리드 스토어
    this.generaOptionFactorStore = Ext.create('Rfx.store.OptionFactorStore', {});

    //디폴트 로드
    gMain.setCenterLoading(false);
    this.store.load(function (records) { });
    this.loadStoreAlways = true;

    // this.addCallback('AUTO_ITEMCODE', function (o) {
    //   // 마지막 자재번호 가져오기
    //   var target2 = gMain.selPanel.getInputTarget('item_code');
    //   var class_code = gMain.selPanel.inputClassCode.get('system_code');
    //   var wa_code = gMain.selPanel.inputBuyer.get('wa_code');
    //   var item_first = wa_code.substring(0, 1) + class_code.substring(0, 1) + '-';
     
      
    //   Ext.Ajax.request({
    //       url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
    //       params: {
    //           item_first: item_first,
    //           codeLength: 3
    //       },
    //       success: function (result, request) {
    //           var result = result.responseText;
    //           console_logs('result 2', result);
    //           target2.setValue(result);
    //       },// endofsuccess
    //       failure: extjsUtil.failureMessage
    //   });// endofajax
    // });
  },
  items: [],

  // 반제품수정 버튼 Action Fucntion
  modifyRapProps: function () {
    var rec = gm.me().grid.getSelectionModel().getSelection()[0];
    console_logs('>>>>> rec', rec.get('specification'));
    var spec = rec.get('comment');
    var type = spec.split('_');
   
   

    var form = Ext.create('Ext.form.Panel', {
      id: gu.id('modifyRapPropsPenel'),
      xtype: 'form',
      frame: false,
      border: false,
      width: '100%',
      height: '100%',
      bodyPadding: '3 3 0',
      region: 'center',
      layout: 'column',
      fieldDefaults: {
        labelAlign: 'right',
        msgTarget: 'side',
      },
      items: [
        {
          xtype: 'fieldset',
          id: gu.id('modifyRapProps'),
          title: '속성수정',
          frame: true,
          width: '100%',
          height: '100%',
          layout: 'column',
          defaults: {
            margin: '2 2 2 2',
          },
          items: [
            new Ext.form.Hidden({
              name: 'unique_id',
              id: 'unique_id',
              value: rec.get('unique_id'),
            }),
            {
              fieldLabel: this.getFieldName('Actuator Type'),
              xtype: 'textfield',
              anchor: '100%',
              readOnly: true,
              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
              id: 'actucator_type',
              name: 'actucator_type',
              //value: rec.get('name_ko'),
              value: 'RAP',
              width: '48%',
            },
            {
              fieldLabel: this.getFieldName('Oper. Condition'),
              xtype: 'textfield',
              anchor: '100%',
              readOnly: true,
              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
              id: 'oper_condition',
              name: 'oper_condition',
              //value: rec.get('name_ko'),
              value: 'N',
              width: '48%',
            },
            {
              fieldLabel: this.getFieldName('Actuator Size'),
              xtype : 'combo',
              
              allowBlank: true,
              id: gu.id('actucator_size'),
              name: 'actucator_size',
             
              fieldStyle: 'background-image: none;',
              store : this.actingSizeStore = Ext.create('Rfx.store.OptionFactorStore'),
              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              allowBlank: false,
              value : type[1],
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  // getInnerTpl: function () {
                  //   return '<div data-qtip="{oname}">{ocode}</div>';
                  // }
              },
              listeners: {
               
                 afterrender: function (combo, record) {
                  gm.me().actingSizeStore.getProxy().setExtraParams({
                        option_code : '200'
                     });
                 }

              },
              
              
              // pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            }, 
            {
              fieldLabel: this.getFieldName('Housing PCD'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('housing_pcd'),
              name: 'housing_pcd',
             
              fieldStyle: 'background-image: none;',
              store : this.housingPCD = Ext.create('Rfx.store.OptionFactorStore'),
              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              allowBlank: false,
              value : type[7],
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
                  gm.me().housingPCD.getProxy().setExtraParams({
                        option_code : '800'
                     });
                    }
              },
              
              
              // pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            }, 
            {
              fieldLabel: this.getFieldName('Acting Type'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('acting_type'),
              name: 'acting_type',
             
              fieldStyle: 'background-image: none;',
              store : this.actingTypeStore = Ext.create('Rfx.store.OptionFactorStore'),
              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              allowBlank: false,
              value : type[2],
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
               
                 gm.me().actingTypeStore.getProxy().setExtraParams({
                  
                       option_code : '300'
                    }
                  );
                 
                }
              },
              
              // pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            }, 
            {
              fieldLabel: this.getFieldName('Pinio_Stem x Key'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('pinion_stem_x_key'),
              name: 'pinion_stem_x_key',
             
              fieldStyle: 'background-image: none;',
              store : this.pinioStemxKey = Ext.create('Rfx.store.OptionFactorStore'),

              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              allowBlank: false,
              value : type[8],
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
                  gm.me().pinioStemxKey.getProxy().setExtraParams({
                        option_code : '900'
                     });
                 }
              },
              
              triggerAction: 'all',
              width: '48%',
              
            }, 
            
         
            {
              fieldLabel: this.getFieldName('Cylinder Size'),
              xtype: 'textfield',
              anchor: '100%',
              readOnly: true,
              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
              id: 'cylinder_size',
              name: 'cylinder_size',
              value: '1',
              width: '48%',
              allowBlank: false,
            },
            {
              fieldLabel: this.getFieldName('Bolt Housing+Cyl'),
              xtype: 'textfield',
              anchor: '100%',
              readOnly: true,
              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
              id: 'bolt',
              name: 'bolt',
              //value: rec.get('name_ko'),
              value: 'C',
              width: '48%',
              allowBlank: false,
            },
            {
              fieldLabel: this.getFieldName('Temp. Condition'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('temp_condition'),
              name: 'temp_condition',
             
              fieldStyle: 'background-image: none;',
              store : this.tempCondition = Ext.create('Rfx.store.OptionFactorStore'),
              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              allowBlank: false,
              value : type[4],
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
                  gm.me().tempCondition.getProxy().setExtraParams({
                        option_code : '500'
                     });
                 }
              },
              
              
              // pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            }, 
            {
              fieldLabel: this.getFieldName('Revision No'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('revision_no'),
              name: 'revision_no',
              
              fieldStyle: 'background-image: none;',
              store : this.revisionNo = Ext.create('Rfx.store.OptionFactorStore'),
              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              allowBlank: false,
              value : type[10],
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
                  gm.me().revisionNo.getProxy().setExtraParams({
                        option_code : '1100'
                      });
                  }
              },
              
              
              // pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            },
            {
              fieldLabel: this.getFieldName('Hydr. Conn'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('hydraulic_connection'),
              name: 'hydraulic_connection',
             
              fieldStyle: 'background-image: none;',
              store : this.hydrConn = Ext.create('Rfx.store.OptionFactorStore'),
              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              allowBlank: false,
              value : type[5],
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
                  gm.me().hydrConn.getProxy().setExtraParams({
                        option_code : '600'
                     });
                    }
              },
              
              
              // pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            },
            {
              fieldLabel: this.getFieldName('품명'),
              xtype: 'textfield',
              anchor: '100%',
              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
              id: 'item_name',
              name: 'item_name',
              allowBlank: false,
              value: rec.get('item_name'),

              width: '48%',
            }

          ],
        },
      ],
    });

    var myWidth =700;
    var myHeight = 300;

    var prWin = Ext.create('Ext.Window', {
      modal: true,
      title: '수정',
      width: myWidth,
      height: myHeight,
      plain: true,
      items: form,
      buttons: [
        {
          text: CMD_OK,
          handler: function (btn) {
            if (btn == 'no') {
              prWin.close();
            } else {
              if (form.isValid()) {
                var val = form.getValues(false);
                prWin.setLoading(true);
                var full = val['actucator_type'] + val['actucator_size'] + val['acting_type']
              + val['cylinder_size']+ val['temp_condition']+ val['hydraulic_connection']+ val['oper_condition'] + '_'+ val['housing_pcd']+ val['pinion_stem_x_key']
              + val['bolt']+ val['revision_no'];

              var specType = val['actucator_type']  + '_'+ val['actucator_size']  + '_'+ val['acting_type']
              + '_'+ val['cylinder_size'] + '_'+ val['temp_condition'] + '_'+ val['hydraulic_connection'] + '_'+ val['oper_condition']  + '_'+ val['housing_pcd'] + '_'+ val['pinion_stem_x_key']
              + '_'+ val['bolt'] + '_'+ val['revision_no'];
               

                Ext.Ajax.request({
                  url:
                    CONTEXT_PATH +
                    '/design/bom.do?method=updateSemiSrcahd',
                  params: {
                    id : val['unique_id'],
                    specification : full,
                    item_name : val['item_name'],
                    comment : specType,
                    item_code : rec.get('item_code')
                  },
                  success: function (result, request) {
                    if (prWin) {
                      console.log(`prWin : ${prWin}`);
                      prWin.setLoading(false);
                      Ext.MessageBox.alert('알림', '수정처리 되었습니다.');
                      prWin.close();
                    }
                    gm.me().store.load();
                  }, //endofsuccess
                  failure: function () {
                    prWin.setLoading(false);
                    extjsUtil.failureMessage();
                  },
                }); //endofajax
              }
            }
          },
        },
        {
          text: CMD_CANCEL,
          handler: function () {
            if (prWin) {
              prWin.close();
            }
          },
        },
      ],
    });

    prWin.show();
  },


  //복사등록 Action function
  copyRapProps: function () {
    var rec = gm.me().grid.getSelectionModel().getSelection()[0];
    var spec = rec.get('comment');
    var type = spec.split('_');

    Ext.Ajax.request({
     url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
     params: {
         item_first: 'RAP',
         codeLength: 8
     },
     success: function (result, request) {
         var result = result.responseText;
           this.item_code = result;
         
     },// endofsuccess
     failure: extjsUtil.failureMessage
  });// endofajax

   var form = Ext.create('Ext.form.Panel', {
     id: gu.id('addPropsPanel'),
     xtype: 'form',
     frame: false,
     border: false,
     width: '100%',
     height: '100%',
     bodyPadding: '3 3 0',
     region: 'center',
     layout: 'column',
     fieldDefaults: {
       labelAlign: 'right',
       msgTarget: 'side',
     },

     items: [
       {
         xtype: 'fieldset',
         title: 'RAP 제품등록',
         id: gu.id('addProps'),
         //frame: true,
         width: '100%',

         style: 'padding:10px',
         height: '100%',
         flex : 1,
         layout: 'column',
         defaults: {
           margin: '7 7 2 2',
         },
         items: [
          
          {
            fieldLabel: this.getFieldName('Actuator Type'),
            xtype: 'textfield',
            anchor: '100%',
            readOnly: true,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            id: 'actucator_type',
            name: 'actucator_type',
            //value: rec.get('name_ko'),
            value: 'RAP',
            width: '48%',
          },
          {
            fieldLabel: this.getFieldName('Oper. Condition'),
            xtype: 'textfield',
            anchor: '100%',
            readOnly: true,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            id: 'oper_condition',
            name: 'oper_condition',
            //value: rec.get('name_ko'),
            value: 'N',
            width: '48%',
          },
          {
            fieldLabel: this.getFieldName('Actuator Size'),
            xtype : 'combo',
            
            allowBlank: true,
            id: gu.id('actucator_size'),
            name: 'actucator_size',
           
            fieldStyle: 'background-image: none;',
            store : this.actingSizeStore = Ext.create('Rfx.store.OptionFactorStore'),
            queryMode: 'remote',
            displayField: 'ocode',
            valueField: 'ocode',
            editable: false,
            typeAhead: false,
            minChars: 1,
            allowBlank: false,
            value : type[1],
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                // getInnerTpl: function () {
                //   return '<div data-qtip="{oname}">{ocode}</div>';
                // }
            },
            listeners: {
             
               afterrender: function (combo, record) {
                gm.me().actingSizeStore.getProxy().setExtraParams({
                      option_code : '200'
                   });
               }

            },
            
            
            // pageSize: 25,
            triggerAction: 'all',
            width: '48%',
            
          }, 
          {
            fieldLabel: this.getFieldName('Housing PCD'),
            xtype : 'combo',
            anchor: '10%',
            allowBlank: true,
            id: gu.id('housing_pcd'),
            name: 'housing_pcd',
           
            fieldStyle: 'background-image: none;',
            store : this.housingPCD = Ext.create('Rfx.store.OptionFactorStore'),
            queryMode: 'remote',
            displayField: 'ocode',
            valueField: 'ocode',
            editable: false,
            typeAhead: false,
            minChars: 1,
            allowBlank: false,
            value : type[7],
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                getInnerTpl: function () {
                  return '<div data-qtip="{oname}">{ocode}</div>';
                }
            },
            listeners: {
              afterrender: function (combo, record) {
                gm.me().housingPCD.getProxy().setExtraParams({
                      option_code : '800'
                   });
                  }
            },
            
            
            // pageSize: 25,
            triggerAction: 'all',
            width: '48%',
            
          }, 
          {
            fieldLabel: this.getFieldName('Acting Type'),
            xtype : 'combo',
            anchor: '10%',
            allowBlank: true,
            id: gu.id('acting_type'),
            name: 'acting_type',
           
            fieldStyle: 'background-image: none;',
            store : this.actingTypeStore = Ext.create('Rfx.store.OptionFactorStore'),
            queryMode: 'remote',
            displayField: 'ocode',
            valueField: 'ocode',
            editable: false,
            typeAhead: false,
            minChars: 1,
            allowBlank: false,
            value : type[2],
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                getInnerTpl: function () {
                  return '<div data-qtip="{oname}">{ocode}</div>';
                }
            },
            listeners: {
              afterrender: function (combo, record) {
             
               gm.me().actingTypeStore.getProxy().setExtraParams({
                
                     option_code : '300'
                  }
                );
               
              }
            },
            
            // pageSize: 25,
            triggerAction: 'all',
            width: '48%',
            
          }, 
          {
            fieldLabel: this.getFieldName('Pinio_Stem x Key'),
            xtype : 'combo',
            anchor: '10%',
            allowBlank: true,
            id: gu.id('pinion_stem_x_key'),
            name: 'pinion_stem_x_key',
           
            fieldStyle: 'background-image: none;',
            store : this.pinioStemxKey = Ext.create('Rfx.store.OptionFactorStore'),

            queryMode: 'remote',
            displayField: 'ocode',
            valueField: 'ocode',
            editable: false,
            typeAhead: false,
            minChars: 1,
            allowBlank: false,
            value : type[8],
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                getInnerTpl: function () {
                  return '<div data-qtip="{oname}">{ocode}</div>';
                }
            },
            listeners: {
              afterrender: function (combo, record) {
                gm.me().pinioStemxKey.getProxy().setExtraParams({
                      option_code : '900'
                   });
               }
            },
            
            triggerAction: 'all',
            width: '48%',
            
          }, 
          
       
          {
            fieldLabel: this.getFieldName('Cylinder Size'),
            xtype: 'textfield',
            anchor: '100%',
            readOnly: true,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            id: 'cylinder_size',
            name: 'cylinder_size',
            value: '1',
            width: '48%',
            allowBlank: false,
          },
          {
            fieldLabel: this.getFieldName('Bolt Housing+Cyl'),
            xtype: 'textfield',
            anchor: '100%',
            readOnly: true,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            id: 'bolt',
            name: 'bolt',
            //value: rec.get('name_ko'),
            value: 'C',
            width: '48%',
            allowBlank: false,
          },
          {
            fieldLabel: this.getFieldName('Temp. Condition'),
            xtype : 'combo',
            anchor: '10%',
            allowBlank: true,
            id: gu.id('temp_condition'),
            name: 'temp_condition',
           
            fieldStyle: 'background-image: none;',
            store : this.tempCondition = Ext.create('Rfx.store.OptionFactorStore'),
            queryMode: 'remote',
            displayField: 'ocode',
            valueField: 'ocode',
            editable: false,
            typeAhead: false,
            minChars: 1,
            allowBlank: false,
            value : type[4],
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                getInnerTpl: function () {
                  return '<div data-qtip="{oname}">{ocode}</div>';
                }
            },
            listeners: {
              afterrender: function (combo, record) {
                gm.me().tempCondition.getProxy().setExtraParams({
                      option_code : '500'
                   });
               }
            },
            
            
            // pageSize: 25,
            triggerAction: 'all',
            width: '48%',
            
          }, 
          {
            fieldLabel: this.getFieldName('Revision No'),
            xtype : 'combo',
            anchor: '10%',
            allowBlank: true,
            id: gu.id('revision_no'),
            name: 'revision_no',
            
            fieldStyle: 'background-image: none;',
            store : this.revisionNo = Ext.create('Rfx.store.OptionFactorStore'),
            queryMode: 'remote',
            displayField: 'ocode',
            valueField: 'ocode',
            editable: false,
            typeAhead: false,
            minChars: 1,
            allowBlank: false,
            value : type[10],
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                getInnerTpl: function () {
                  return '<div data-qtip="{oname}">{ocode}</div>';
                }
            },
            listeners: {
              afterrender: function (combo, record) {
                gm.me().revisionNo.getProxy().setExtraParams({
                      option_code : '1100'
                    });
                }
            },
            
            
            // pageSize: 25,
            triggerAction: 'all',
            width: '48%',
            
          },
          {
            fieldLabel: this.getFieldName('Hydr. Conn'),
            xtype : 'combo',
            anchor: '10%',
            allowBlank: true,
            id: gu.id('hydraulic_connection'),
            name: 'hydraulic_connection',
           
            fieldStyle: 'background-image: none;',
            store : this.hydrConn = Ext.create('Rfx.store.OptionFactorStore'),
            queryMode: 'remote',
            displayField: 'ocode',
            valueField: 'ocode',
            editable: false,
            typeAhead: false,
            minChars: 1,
            allowBlank: false,
            value : type[5],
            listConfig: {
                loadingText: 'Searching...',
                emptyText: 'No matching posts found.',
                getInnerTpl: function () {
                  return '<div data-qtip="{oname}">{ocode}</div>';
                }
            },
            listeners: {
              afterrender: function (combo, record) {
                gm.me().hydrConn.getProxy().setExtraParams({
                      option_code : '600'
                   });
                  }
            },
            
            
            // pageSize: 25,
            triggerAction: 'all',
            width: '48%',
            
          },
          {
            fieldLabel: this.getFieldName('품명'),
            xtype: 'textfield',
            anchor: '100%',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            id: 'item_name',
            name: 'item_name',
            allowBlank: false,
            value: rec.get('item_name'),

            width: '48%',
          }
   
         ]
       },

     ]
   });
   

   // var myWidth = 310;
   var myWidth =700;
   var myHeight = 350;

   var prWin = Ext.create('Ext.Window', {
     modal: true,
     title: '복사등록',
     width: myWidth,
     height: myHeight,
     plain: true,
     items: form,
     overflowY: 'scroll',
     buttons: [{
       text: CMD_OK,
       handler: function (btn) {

         var val = form.getValues(false);

         var full = val['actucator_type'] + val['actucator_size'] + val['acting_type']
         + val['cylinder_size']+ val['temp_condition']+ val['hydraulic_connection']+ val['oper_condition'] + '_'+ val['housing_pcd']+ val['pinion_stem_x_key']
         + val['bolt']+ val['revision_no'];

         var specType = val['actucator_type']  + '_'+ val['actucator_size']  + '_'+ val['acting_type']
         + '_'+ val['cylinder_size'] + '_'+ val['temp_condition'] + '_'+ val['hydraulic_connection'] + '_'+ val['oper_condition']  + '_'+ val['housing_pcd'] + '_'+ val['pinion_stem_x_key']
         + '_'+ val['bolt'] + '_'+ val['revision_no'];
          



         if (btn == 'no') {
           prWin.close();
         } else {
             Ext.Ajax.request({
               url: CONTEXT_PATH + '/admin/Series.do?method=checkSpec',
               params: {
                   specification: full
               },
               success: function (result, request) {
                   var resultText = result.responseText;


                   if (resultText == '0') {
                         if (form.isValid()) {

           
                           Ext.Ajax.request({
                             url: CONTEXT_PATH + '/design/bom.do?method=createNew',
                             params: {
                               parent_uid: -1,
                               parent: -1,
                               ac_uid: -1,
                               pl_no: '---',
                               //pl_no: 1,
                               bm_quan: 1,
                               item_name : val['item_name'],
                               item_code : item_code,
                               specification : full,
                               standard_flag : 'A',
                               pj_code: '',
                               child: -1,
                               sg_code : 'T',
                               class_code : 'RAP',
                               comment : specType
             
                             },
                             success: function (result, request) {
             
             
                               
                               prWin.setLoading(false);
                               Ext.MessageBox.alert('알림', '등록처리 되었습니다.')
                               prWin.close();
                               gm.me().store.load();
                             }, //endofsuccess
                             failure: function () {
                               prWin.setLoading(false);
                               extjsUtil.failureMessage();
                               prWin.close();
                               gm.me().store.load();
                             }
                           }); //endofajax
             
           
                       }
                   } else {
                       Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
                        

                       });
                       prWin.setLoading(false);
 //	        					gMain.selPanel.getInputTarget('checkCode').setValue('');
                   }
               },
               failure: extjsUtil.failureMessage
           }); //end of ajax

         
         }
       }
     }, {
       text: CMD_CANCEL,
       handler: function () {
         if (prWin) {
           prWin.close();
         }
       }
     }
     ]
   });
   prWin.show();
 },

 

  // 반제품등록
  addProps: function () {
     Ext.Ajax.request({
      url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
      params: {
          item_first: 'RAP',
          codeLength: 8
      },
      success: function (result, request) {
          var result = result.responseText;
       
            this.item_code_rap = result;
 
            
          
      },// endofsuccess
      failure: extjsUtil.failureMessage
   });// endofajax


   var test = [
    {
      fieldLabel: this.getFieldName('Actuator Type'),
      xtype: 'textfield',
      anchor: '100%',
      readOnly: true,
      fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      id: 'actucator_type',
      name: 'actucator_type',
      //value: rec.get('name_ko'),
      value: 'RAP',
      width: '48%',
    },
    {
      fieldLabel: this.getFieldName('Oper. Condition'),
      xtype: 'textfield',
      anchor: '100%',
      readOnly: true,
      fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      id: 'oper_condition',
      name: 'oper_condition',
      //value: rec.get('name_ko'),
      value: 'N',
      width: '48%',
    },
    {
      fieldLabel: this.getFieldName('Actuator Size'),
      xtype : 'combo',
      
      allowBlank: true,
      id: gu.id('actucator_size'),
      name: 'actucator_size',
     
      fieldStyle: 'background-image: none;',
      store : this.actingSizeStore = Ext.create('Rfx.store.OptionFactorStore'),
      queryMode: 'remote',
      displayField: 'ocode',
      valueField: 'ocode',
      editable: false,
      typeAhead: false,
      minChars: 1,
      allowBlank: false,
      listConfig: {
          loadingText: 'Searching...',
          emptyText: 'No matching posts found.',
          getInnerTpl: function () {
            return '<div data-qtip="{oname}">{ocode}</div>';
          }
      },
      listeners: {
       
         afterrender: function (combo, record) {
          gm.me().actingSizeStore.getProxy().setExtraParams({
                option_code : '200'
             });
         }

      },
      
      
      // pageSize: 25,
      triggerAction: 'all',
      width: '48%',
      
    }, 
    {
      fieldLabel: this.getFieldName('Housing PCD'),
      xtype : 'combo',
      anchor: '10%',
      allowBlank: true,
      id: gu.id('housing_pcd'),
      name: 'housing_pcd',
     
      fieldStyle: 'background-image: none;',
      store : this.housingPCD = Ext.create('Rfx.store.OptionFactorStore'),
      queryMode: 'remote',
      displayField: 'ocode',
      valueField: 'ocode',
      editable: false,
      typeAhead: false,
      minChars: 1,
      allowBlank: false,
      listConfig: {
          loadingText: 'Searching...',
          emptyText: 'No matching posts found.',
          getInnerTpl: function () {
            return '<div data-qtip="{oname}">{ocode}</div>';
          }
      },
      listeners: {
        afterrender: function (combo, record) {
          gm.me().housingPCD.getProxy().setExtraParams({
                option_code : '800'
             });
            }
      },
      
      
      // pageSize: 25,
      triggerAction: 'all',
      width: '48%',
      
    }, 
    {
      fieldLabel: this.getFieldName('Acting Type'),
      xtype : 'combo',
      anchor: '10%',
      allowBlank: true,
      id: gu.id('acting_type'),
      name: 'acting_type',
     
      fieldStyle: 'background-image: none;',
      store : this.actingTypeStore = Ext.create('Rfx.store.OptionFactorStore'),
      queryMode: 'remote',
      displayField: 'ocode',
      valueField: 'ocode',
      editable: false,
      typeAhead: false,
      minChars: 1,
      allowBlank: false,
      listConfig: {
          loadingText: 'Searching...',
          emptyText: 'No matching posts found.',
          getInnerTpl: function () {
            return '<div data-qtip="{oname}">{ocode}</div>';
          }
      },
      listeners: {
        afterrender: function (combo, record) {
       
         gm.me().actingTypeStore.getProxy().setExtraParams({
          
               option_code : '300'
            }
          );
         
        }
      },
      
      // pageSize: 25,
      triggerAction: 'all',
      width: '48%',
      
    },
    // gu.getCmp('pinion_stem_x_key').getStore().
    {
      fieldLabel: this.getFieldName('Pinio_Stem x Key'),
      xtype : 'combo',
      anchor: '10%',
      allowBlank: true,
      id: gu.id('pinion_stem_x_key'),
      name: 'pinion_stem_x_key',
      fieldStyle: 'background-image: none;',
      store : this.pinioStemxKey = Ext.create('Rfx.store.OptionFactorStore'),
      queryMode: 'remote',
      displayField: 'ocode',
      valueField: 'ocode',
      editable: false,
      typeAhead: false,
      minChars: 1,
      allowBlank: false,
      listConfig: {
          loadingText: 'Searching...',
          emptyText: 'No matching posts found.',
          getInnerTpl: function () {
            return '<div data-qtip="{oname}">{ocode}</div>';
          }
      },
      listeners: {
        afterrender: function (combo, record) {
          gm.me().pinioStemxKey.getProxy().setExtraParams({
                option_code : '900'
             });
         }
      },
      
      triggerAction: 'all',
      width: '48%',
      
    }, 
    
 
    {
      fieldLabel: this.getFieldName('Cylinder Size'),
      xtype: 'textfield',
      anchor: '100%',
      readOnly: true,
      fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      id: 'cylinder_size',
      name: 'cylinder_size',
      value: '1',
      width: '48%',
      allowBlank: false,
    },
    {
      fieldLabel: this.getFieldName('Bolt Housing+Cyl'),
      xtype: 'textfield',
      anchor: '100%',
      readOnly: true,
      fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      id: 'bolt',
      name: 'bolt',
      //value: rec.get('name_ko'),
      value: 'C',
      width: '48%',
      allowBlank: false,
    },
    {
      fieldLabel: this.getFieldName('Temp. Condition'),
      xtype : 'combo',
      anchor: '10%',
      allowBlank: true,
      id: gu.id('temp_condition'),
      name: 'temp_condition',
     
      fieldStyle: 'background-image: none;',
      store : this.tempCondition = Ext.create('Rfx.store.OptionFactorStore'),
      queryMode: 'remote',
      displayField: 'ocode',
      valueField: 'ocode',
      editable: false,
      typeAhead: false,
      minChars: 1,
      allowBlank: false,
      listConfig: {
          loadingText: 'Searching...',
          emptyText: 'No matching posts found.',
          getInnerTpl: function () {
            return '<div data-qtip="{oname}">{ocode}</div>';
          }
      },
      listeners: {
        afterrender: function (combo, record) {
          gm.me().tempCondition.getProxy().setExtraParams({
                option_code : '500'
             });
         }
      },
      
      
      // pageSize: 25,
      triggerAction: 'all',
      width: '48%',
      
    }, 
    {
      fieldLabel: this.getFieldName('Revision No'),
      xtype : 'combo',
      anchor: '10%',
      allowBlank: true,
      id: gu.id('revision_no'),
      name: 'revision_no',
      
      fieldStyle: 'background-image: none;',
      store : this.revisionNo = Ext.create('Rfx.store.OptionFactorStore'),
      queryMode: 'remote',
      displayField: 'ocode',
      valueField: 'ocode',
      editable: false,
      typeAhead: false,
      minChars: 1,
      allowBlank: false,
      listConfig: {
          loadingText: 'Searching...',
          emptyText: 'No matching posts found.',
          getInnerTpl: function () {
            return '<div data-qtip="{oname}">{ocode}</div>';
          }
      },
      listeners: {
        afterrender: function (combo, record) {
          gm.me().revisionNo.getProxy().setExtraParams({
                option_code : '1100'
              });
          }
      },
      
      
      // pageSize: 25,
      triggerAction: 'all',
      width: '48%',
      
    },
    {
      fieldLabel: this.getFieldName('Hydr. Conn'),
      xtype : 'combo',
      anchor: '10%',
      allowBlank: true,
      id: gu.id('hydraulic_connection'),
      name: 'hydraulic_connection',
     
      fieldStyle: 'background-image: none;',
      store : this.hydrConn = Ext.create('Rfx.store.OptionFactorStore'),
      queryMode: 'remote',
      displayField: 'ocode',
      valueField: 'ocode',
      editable: false,
      typeAhead: false,
      minChars: 1,
      allowBlank: false,
      listConfig: {
          loadingText: 'Searching...',
          emptyText: 'No matching posts found.',
          getInnerTpl: function () {
            return '<div data-qtip="{oname}">{ocode}</div>';
          }
      },
      listeners: {
        afterrender: function (combo, record) {
          gm.me().hydrConn.getProxy().setExtraParams({
                option_code : '600'
             });
            }
      },
      
      
      // pageSize: 25,
      triggerAction: 'all',
      width: '48%',
      
    },
    {
      fieldLabel: this.getFieldName('품명'),
      xtype: 'textfield',
      anchor: '100%',
      fieldStyle: 'background-color: #FBF8E6; background-image: none;',
      id: 'item_name',
      name: 'item_name',
      allowBlank: false,
      //value: rec.get('name_ko'),

      width: '48%',
    },
  ]; 

    var form = Ext.create('Ext.form.Panel', {
      id: gu.id('addPropsPanel'),
      xtype: 'form',
      frame: false,
      border: false,
      width: '100%',
      height: '100%',
      bodyPadding: '3 3 0',
      region: 'center',
      layout: 'column',
      fieldDefaults: {
        labelAlign: 'right',
        msgTarget: 'side',
      },

      items: [
        {
          xtype: 'fieldset',
          title: '반제품등록',
          id: gu.id('addProps'),
          //frame: true,
          width: '100%',

          style: 'padding:10px',
          height: '100%',
          flex : 1,
          layout: 'column',
          defaults: {
            margin: '7 7 2 2',
          },
          items: test
        },

      ]
    });
    

    // var myWidth = 310;
    var myWidth =700;
    var myHeight = 350;

    var prWin = Ext.create('Ext.Window', {
      modal: true,
      title: 'RAP 코드등록_반제품',
      width: myWidth,
      height: myHeight,
      plain: true,
      items: form,
      overflowY: 'scroll',
      buttons: [{
        text: CMD_OK,
        handler: function (btn) {

          var val = form.getValues(false);

          var full = val['actucator_type'] + val['actucator_size'] + val['acting_type']
          + val['cylinder_size']+ val['temp_condition']+ val['hydraulic_connection']+ val['oper_condition'] + '_'+ val['housing_pcd']+ val['pinion_stem_x_key']
          + val['bolt']+ val['revision_no'];

          var specType = val['actucator_type']  + '_'+ val['actucator_size']  + '_'+ val['acting_type']
          + '_'+ val['cylinder_size'] + '_'+ val['temp_condition'] + '_'+ val['hydraulic_connection'] + '_'+ val['oper_condition']  + '_'+ val['housing_pcd'] + '_'+ val['pinion_stem_x_key']
          + '_'+ val['bolt'] + '_'+ val['revision_no'];
           



          if (btn == 'no') {
            prWin.close();
          } else {
              Ext.Ajax.request({
                url: CONTEXT_PATH + '/admin/Series.do?method=checkSpec',
                params: {
                    specification: full
                },
                success: function (result, request) {
                    var resultText = result.responseText;


                    if (resultText == '0') {
                          if (form.isValid()) {

                          var child = -1;
                          var ac_uid = -1;
                          var unique_uid = -1;
                          var assy_name = '반제품등록';
            
                          
              
                            Ext.Ajax.request({
                              url: CONTEXT_PATH + '/design/bom.do?method=createNew',
                              params: {
                                parent_uid: -1,
                                parent: -1,
                                ac_uid: -1,
                                pl_no: '---',
                                //pl_no: 1,
                                bm_quan: 1,
                                item_name : val['item_name'],
                                item_code : item_code_rap,
                                specification : full,
                                standard_flag : 'A',
                                pj_code: '',
                                child: -1,
                                sg_code : 'T',
                                sp_code : 'B',
                                class_code : 'RAP',
                                comment : specType
              
                              },
                              success: function (result, request) {
              
              
                                
                                prWin.setLoading(false);
                                Ext.MessageBox.alert('알림', '등록처리 되었습니다.')
                                prWin.close();
                                gm.me().store.load();
                              }, //endofsuccess
                              failure: function () {
                                prWin.setLoading(false);
                                extjsUtil.failureMessage();
                                prWin.close();
                                gm.me().store.load();
                              }
                            }); //endofajax
              
            
                        }
                    } else {
                        Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
                         

                        });
                        prWin.setLoading(false);
  //	        					gMain.selPanel.getInputTarget('checkCode').setValue('');
                    }
                },
                failure: extjsUtil.failureMessage
            }); //end of ajax

          
          }
        }
      }, {
        text: CMD_CANCEL,
        handler: function () {
          if (prWin) {
            prWin.close();
          }
        }
      }
      ]
    });
    prWin.show();
  },


  //제품등록 버튼 이벤트
  addProps2: function () {


     Ext.Ajax.request({
      url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
      params: {
          item_first: 'RPD',
          codeLength: 8
      },
      success: function (result, request) {
          var result = result.responseText;
          //console_logs('상민', this.item_code_prd);
            this.item_code_prd = result;
            
          
      },// endofsuccess
      failure: extjsUtil.failureMessage
   });// endofajax

    var form = Ext.create('Ext.form.Panel', {
      id: gu.id('addPropsPanel'),
      xtype: 'form',
      frame: false,
      border: false,
      width: '100%',
      height: '100%',
      bodyPadding: '3 3 0',
      region: 'center',
      layout: 'column',
      flex : 1,
      fieldDefaults: {
        labelAlign: 'right',
        msgTarget: 'side',
      },

      items: [
        {
          xtype: 'fieldset',
          title: 'RAP 제품등록',
          id: gu.id('addProps'),
          //frame: true,
          width: '100%',

          style: 'padding:10px',
          height: '100%',
          flex : 1,
          layout: 'column',
          defaults: {
            margin: '7 7 2 2',
          },
          items: [
            
            
            {
              fieldLabel: this.getFieldName('반제품 코드'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('specification'),
              name: 'specification',
             
              fieldStyle: 'background-image: none;',
              store: this.rap_select = Ext.create('Rfx.store.SeriesItemStore'),
              queryMode: 'remote',
              displayField: 'specification',
              valueField: 'specification',
              editable: false,
              typeAhead: false,
              minChars: 1,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{specification}">{specification} </div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
                  gm.me().rap_select.getProxy().setExtraParams({
                        class_code : 'RAP'
                      });
                  }
              },
              
              
              pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            }, 
          
           
           
          
            {

              fieldLabel: this.getFieldName('Indication Box'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('indication_box'),
              name: 'indication_box',
             
              fieldStyle: 'background-image: none;',
              store : this.indicationBox = Ext.create('Rfx.store.OptionFactorStore'),

              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
                  gm.me().indicationBox.getProxy().setExtraParams({
                        option_code : '1300'
                      });
                  }
              },
              
              
              pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            }, 
            {
         
              fieldLabel: this.getFieldName('Control Block'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('control_block'),
              name: 'control_block',
             
              fieldStyle: 'background-image: none;',
              store : this.controlBlock = Ext.create('Rfx.store.OptionFactorStore'),
   
              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
                  gm.me().controlBlock.getProxy().setExtraParams({
                        option_code : '1200'
                      });
                  }
              },
              
              
              pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            }, 
            {

              fieldLabel: this.getFieldName('Inter. Flange'),
              xtype : 'combo',
              anchor: '10%',
              allowBlank: true,
              id: gu.id('inter_flange'),
              name: 'inter_flange',
             
              fieldStyle: 'background-image: none;',
              store : this.interFlange = Ext.create('Rfx.store.OptionFactorStore'),
              queryMode: 'remote',
              displayField: 'ocode',
              valueField: 'ocode',
              editable: false,
              typeAhead: false,
              minChars: 1,
              listConfig: {
                  loadingText: 'Searching...',
                  emptyText: 'No matching posts found.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
              },
              listeners: {
                afterrender: function (combo, record) {
                  gm.me().interFlange.getProxy().setExtraParams({
                        option_code : '1400'
                      });
                  }
              },
              
              
              pageSize: 25,
              triggerAction: 'all',
              width: '48%',
              
            },
            {
              fieldLabel: this.getFieldName('품명'),
              xtype: 'textfield',
              anchor: '100%',
              fieldStyle: 'background-color: #FBF8E6; background-image: none;',
              id: 'item_name',
              name: 'item_name',
              allowBlank: false,
              //value: rec.get('name_ko'),
    
              width: '48%',
            },
            
           
           
          ]
        },

      ]
    });
    var myWidth =700;
    var myHeight = 250;

    var prWin = Ext.create('Ext.Window', {
      modal: true,
      title: 'RAP 코드등록_제품',
      width: myWidth,
      height: myHeight,
      plain: true,
      items: form,
      overflowY: 'scroll',
      buttons: [{
        text: CMD_OK,
        handler: function (btn) {


          var val = form.getValues(false);

          var full = val['specification']  + '_' + val['control_block']+val['indication_box'] + val['inter_flange'];

          var specType = val['control_block']  + '_'+ val['indication_box']+ '_'+ val['inter_flange']

          if (btn == 'no') {
            prWin.close();
          }  else {
              Ext.Ajax.request({
                url: CONTEXT_PATH + '/admin/Series.do?method=checkSpec',
                params: {
                    specification: full
                },
                success: function (result, request) {
                    var resultText = result.responseText;


            if (resultText == '0') {
                if (form.isValid()) {

             

                  prWin.setLoading(true);

                  Ext.Ajax.request({
                    url: CONTEXT_PATH + '/design/bom.do?method=createNew',
                    params: {
                      parent_uid: -1,
                      parent: -1,
                      ac_uid: -1,
                      pl_no: '---',
                      bm_quan: 1,
                      item_name : val['item_name'],
                      comment : specType,
                      item_code : item_code_prd,
                      specification : full,
                      standard_flag : 'A',
                      pj_code: '',
                      child: -1,
                      sg_code : 'T',
                      class_code : 'RPD'

                    },
                    success: function (result, request) {
                      prWin.setLoading(false);
                      Ext.MessageBox.alert('알림', '등록처리 되었습니다.')
                      prWin.close();
                      gm.me().store.load();
                    }, //endofsuccess
                    failure: function () {
                      prWin.setLoading(false);
                      extjsUtil.failureMessage();
                      prWin.close();
                      gm.me().store.load();
                    }
                  }); //endofajax
                }
              }else{
                Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
              });
              prWin.setLoading(false);
            }
          },
          failure: extjsUtil.failureMessage
        });
      }
    }
      }, {
        text: CMD_CANCEL,
        handler: function () {
          if (prWin) {
            prWin.close();
          }
        }
      }
      ]
    });
    prWin.show();
  },

  //제품수정 //Action function
  modifyPrdProps: function () {
    var rec = gm.me().grid.getSelectionModel().getSelection()[0];
    var spec = rec.get('comment');
    var spec2 = rec.get('specification');
    var type = spec.split('_');
    var type2 = spec2.split('_');

    console_logs('상민',spec);


    Ext.Ajax.request({
     url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
     params: {
         item_first: 'RPD',
         codeLength: 8
     },
     success: function (result, request) {
         var result = result.responseText;
         //console_logs('상민', this.item_code_prd);
           this.item_code_prd = result;
           
         
     },// endofsuccess
     failure: extjsUtil.failureMessage
  });// endofajax

   var form = Ext.create('Ext.form.Panel', {
     id: gu.id('addPropsPanel'),
     xtype: 'form',
     frame: false,
     border: false,
     width: '100%',
     height: '100%',
     bodyPadding: '3 3 0',
     region: 'center',
     layout: 'column',
     flex : 1,
     fieldDefaults: {
       labelAlign: 'right',
       msgTarget: 'side',
     },

     items: [
       {
         xtype: 'fieldset',
         title: '제품수정',
         id: gu.id('addProps'),
         //frame: true,
         width: '100%',

         style: 'padding:10px',
         height: '100%',
         flex : 1,
         layout: 'column',
         defaults: {
           margin: '7 7 2 2',
         },
         items: [

          new Ext.form.Hidden({
            name: 'unique_id',
            id: 'unique_id',
            value: rec.get('unique_id'),
          }),
           
           
           {
             fieldLabel: this.getFieldName('반제품 코드'),
             xtype : 'combo',
             anchor: '10%',
             allowBlank: true,
             id: gu.id('specification'),
             name: 'specification',
            
             fieldStyle: 'background-image: none;',
             store: this.rap_select = Ext.create('Rfx.store.SeriesItemStore'),
             queryMode: 'remote',
             displayField: 'specification',
             valueField: 'specification',
             editable: false,
             typeAhead: false,
             minChars: 1,
             value : type2[0]+ '_' +type2[1],
             listConfig: {
                 loadingText: 'Searching...',
                 emptyText: 'No matching posts found.',
                 getInnerTpl: function () {
                   return '<div data-qtip="{specification}">{specification} </div>';
                 }
             },
             listeners: {
               afterrender: function (combo, record) {
                 gm.me().rap_select.getProxy().setExtraParams({
                       class_code : 'RAP'
                     });
                 }
             },
             
             
             pageSize: 25,
             triggerAction: 'all',
             width: '48%',
             
           }, 
         
          
          
         
           {

             fieldLabel: this.getFieldName('Indication Box'),
             xtype : 'combo',
             anchor: '10%',
             allowBlank: true,
             id: gu.id('indication_box'),
             name: 'indication_box',
            
             fieldStyle: 'background-image: none;',
             store : this.indicationBox = Ext.create('Rfx.store.OptionFactorStore'),

             queryMode: 'remote',
             displayField: 'ocode',
             valueField: 'ocode',
             editable: false,
             typeAhead: false,
             minChars: 1,
             value : type[1],
             listConfig: {
                 loadingText: 'Searching...',
                 emptyText: 'No matching posts found.',
                 getInnerTpl: function () {
                   return '<div data-qtip="{oname}">{ocode}</div>';
                 }
             },
             listeners: {
               afterrender: function (combo, record) {
                 gm.me().indicationBox.getProxy().setExtraParams({
                       option_code : '1300'
                     });
                 }
             },
             
             
             pageSize: 25,
             triggerAction: 'all',
             width: '48%',
             
           }, 
           {
        
             fieldLabel: this.getFieldName('Control Block'),
             xtype : 'combo',
             anchor: '10%',
             allowBlank: true,
             id: gu.id('control_block'),
             name: 'control_block',
            
             fieldStyle: 'background-image: none;',
             store : this.controlBlock = Ext.create('Rfx.store.OptionFactorStore'),
  
             queryMode: 'remote',
             displayField: 'ocode',
             valueField: 'ocode',
             editable: false,
             typeAhead: false,
             minChars: 1,
             value : type[0],
             listConfig: {
                 loadingText: 'Searching...',
                 emptyText: 'No matching posts found.',
                 getInnerTpl: function () {
                   return '<div data-qtip="{oname}">{ocode}</div>';
                 }
             },
             listeners: {
               afterrender: function (combo, record) {
                 gm.me().controlBlock.getProxy().setExtraParams({
                       option_code : '1200'
                     });
                 }
             },
             
             
             pageSize: 25,
             triggerAction: 'all',
             width: '48%',
             
           }, 
           {

             fieldLabel: this.getFieldName('Inter. Flange'),
             xtype : 'combo',
             anchor: '10%',
             allowBlank: true,
             id: gu.id('inter_flange'),
             name: 'inter_flange',
            
             fieldStyle: 'background-image: none;',
             store : this.interFlange = Ext.create('Rfx.store.OptionFactorStore'),
             queryMode: 'remote',
             displayField: 'ocode',
             valueField: 'ocode',
             editable: false,
             typeAhead: false,
             minChars: 1,
             value : type[2],
             listConfig: {
                 loadingText: 'Searching...',
                 emptyText: 'No matching posts found.',
                 getInnerTpl: function () {
                   return '<div data-qtip="{oname}">{ocode}</div>';
                 }
             },
             listeners: {
               afterrender: function (combo, record) {
                 gm.me().interFlange.getProxy().setExtraParams({
                       option_code : '1400'
                     });
                 }
             },
             
             
             pageSize: 25,
             triggerAction: 'all',
             width: '48%',
             
           }
           
          
          
         ]
       },

     ]
   });
   var myWidth =700;
   var myHeight = 250;

   var prWin = Ext.create('Ext.Window', {
     modal: true,
     title: '제품코드수정',
     width: myWidth,
     height: myHeight,
     plain: true,
     items: form,
     overflowY: 'scroll',
     buttons: [{
       text: CMD_OK,
       handler: function (btn) {


         var val = form.getValues(false);

         var full = val['specification']  + '_' + val['control_block']+val['indication_box'] + val['inter_flange'];

         var specType = val['control_block']  + '_'+ val['indication_box']+ '_'+ val['inter_flange']
         

         if (btn == 'no') {
           prWin.close();
         }  else {
             Ext.Ajax.request({
               url: CONTEXT_PATH + '/admin/Series.do?method=checkSpec',
               params: {
                   specification: full
               },
               success: function (result, request) {
                   var resultText = result.responseText;


           if (resultText == '0') {
               if (form.isValid()) {

            

                 prWin.setLoading(true);

                 Ext.Ajax.request({
                   url: CONTEXT_PATH + '/design/bom.do?method=update',
                   params: {
                    id : val['unique_id'],
                     item_name : val['item_name'],
                     specification : full,
                     comment : specType,
                   },
                   success: function (result, request) {
                     prWin.setLoading(false);
                     Ext.MessageBox.alert('알림', '등록처리 되었습니다.')
                     prWin.close();
                     gm.me().store.load();
                   }, //endofsuccess
                   failure: function () {
                     prWin.setLoading(false);
                     extjsUtil.failureMessage();
                     prWin.close();
                     gm.me().store.load();
                   }
                 }); //endofajax
               }
             }else{
               Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
             });
             prWin.setLoading(false);
           }
         },
         failure: extjsUtil.failureMessage
       });
     }
   }
     }, {
       text: CMD_CANCEL,
       handler: function () {
         if (prWin) {
           prWin.close();
         }
       }
     }
     ]
   });
   prWin.show();
 },


 copyPrdProps: function () {
  var rec = gm.me().grid.getSelectionModel().getSelection()[0];
  var spec = rec.get('comment');
  var spec2 = rec.get('specification');
  var type = spec.split('_');
  var type2 = spec2.split('_');



  Ext.Ajax.request({
   url: CONTEXT_PATH + '/sales/poreceipt.do?method=lastnoMesItem',
   params: {
       item_first: 'RPD',
       codeLength: 8
   },
   success: function (result, request) {
       var result = result.responseText;
         this.item_code_prd = result;
         
       
   },// endofsuccess
   failure: extjsUtil.failureMessage
});// endofajax

 var form = Ext.create('Ext.form.Panel', {
   id: gu.id('addPropsPanel'),
   xtype: 'form',
   frame: false,
   border: false,
   width: '100%',
   height: '100%',
   bodyPadding: '3 3 0',
   region: 'center',
   layout: 'column',
   flex : 1,
   fieldDefaults: {
     labelAlign: 'right',
     msgTarget: 'side',
   },

   items: [
     {
       xtype: 'fieldset',
       title: 'RAP 제품등록',
       id: gu.id('addProps'),
       //frame: true,
       width: '100%',

       style: 'padding:10px',
       height: '100%',
       flex : 1,
       layout: 'column',
       defaults: {
         margin: '7 7 2 2',
       },
       items: [
         
         
         {
           fieldLabel: this.getFieldName('반제품 코드'),
           xtype : 'combo',
           anchor: '10%',
           allowBlank: true,
           id: gu.id('specification'),
           name: 'specification',
          
           fieldStyle: 'background-image: none;',
           store: this.rap_select = Ext.create('Rfx.store.SeriesItemStore'),
           queryMode: 'remote',
           displayField: 'specification',
           valueField: 'specification',
           editable: false,
           typeAhead: false,
           minChars: 1,
           value : type2[0]+ '_' + type2[1],
           listConfig: {
               loadingText: 'Searching...',
               emptyText: 'No matching posts found.',
               getInnerTpl: function () {
                 return '<div data-qtip="{specification}">{specification} </div>';
               }
           },
           listeners: {
             afterrender: function (combo, record) {
               gm.me().rap_select.getProxy().setExtraParams({
                     class_code : 'RAP'
                   });
               }
           },
           
           
           pageSize: 25,
           triggerAction: 'all',
           width: '48%',
           
         }, 
       
        
        
       
         {

           fieldLabel: this.getFieldName('Indication Box'),
           xtype : 'combo',
           anchor: '10%',
           allowBlank: true,
           id: gu.id('indication_box'),
           name: 'indication_box',
          
           fieldStyle: 'background-image: none;',
           store : this.indicationBox = Ext.create('Rfx.store.OptionFactorStore'),

           queryMode: 'remote',
           displayField: 'ocode',
           valueField: 'ocode',
           editable: false,
           typeAhead: false,
           minChars: 1,
           value : type[1],
           listConfig: {
               loadingText: 'Searching...',
               emptyText: 'No matching posts found.',
               getInnerTpl: function () {
                 return '<div data-qtip="{oname}">{ocode}</div>';
               }
           },
           listeners: {
             afterrender: function (combo, record) {
               gm.me().indicationBox.getProxy().setExtraParams({
                     option_code : '1300'
                   });
               }
           },
           
           
           pageSize: 25,
           triggerAction: 'all',
           width: '48%',
           
         }, 
         {
      
           fieldLabel: this.getFieldName('Control Block'),
           xtype : 'combo',
           anchor: '10%',
           allowBlank: true,
           id: gu.id('control_block'),
           name: 'control_block',
          
           fieldStyle: 'background-image: none;',
           store : this.controlBlock = Ext.create('Rfx.store.OptionFactorStore'),

           queryMode: 'remote',
           displayField: 'ocode',
           valueField: 'ocode',
           editable: false,
           typeAhead: false,
           minChars: 1,
           value : type[0],
           listConfig: {
               loadingText: 'Searching...',
               emptyText: 'No matching posts found.',
               getInnerTpl: function () {
                 return '<div data-qtip="{oname}">{ocode}</div>';
               }
           },
           listeners: {
             afterrender: function (combo, record) {
               gm.me().controlBlock.getProxy().setExtraParams({
                     option_code : '1200'
                   });
               }
           },
           
           
           pageSize: 25,
           triggerAction: 'all',
           width: '48%',
           
         }, 
         {

           fieldLabel: this.getFieldName('Inter. Flange'),
           xtype : 'combo',
           anchor: '10%',
           allowBlank: true,
           id: gu.id('inter_flange'),
           name: 'inter_flange',
          
           fieldStyle: 'background-image: none;',
           store : this.interFlange = Ext.create('Rfx.store.OptionFactorStore'),
           queryMode: 'remote',
           displayField: 'ocode',
           valueField: 'ocode',
           editable: false,
           typeAhead: false,
           minChars: 1,
           value : type[2],
           listConfig: {
               loadingText: 'Searching...',
               emptyText: 'No matching posts found.',
               getInnerTpl: function () {
                 return '<div data-qtip="{oname}">{ocode}</div>';
               }
           },
           listeners: {
             afterrender: function (combo, record) {
               gm.me().interFlange.getProxy().setExtraParams({
                     option_code : '1400'
                   });
               }
           },
           
           
           pageSize: 25,
           triggerAction: 'all',
           width: '48%',
           
         },
         {
          fieldLabel: this.getFieldName('품명'),
          xtype: 'textfield',
          anchor: '100%',
          fieldStyle: 'background-color: #FBF8E6; background-image: none;',
          id: 'item_name',
          name: 'item_name',
          allowBlank: false,
          value: rec.get('item_name'),

          width: '48%',
        },
         
        
        
       ]
     },

   ]
 });
 var myWidth =700;
 var myHeight = 250;

 var prWin = Ext.create('Ext.Window', {
   modal: true,
   title: '제품복사등록',
   width: myWidth,
   height: myHeight,
   plain: true,
   items: form,
   overflowY: 'scroll',
   buttons: [{
     text: CMD_OK,
     handler: function (btn) {


       var val = form.getValues(false);

       var full = val['specification']  + '_' + val['control_block']+val['indication_box'] + val['inter_flange'];

       var specType = val['specification']  + '_'+ val['control_block']  + '_'+ val['indication_box']+ '_'+ val['inter_flange']
       

       if (btn == 'no') {
         prWin.close();
       }  else {
           Ext.Ajax.request({
             url: CONTEXT_PATH + '/admin/Series.do?method=checkSpec',
             params: {
                 specification: full
             },
             success: function (result, request) {
                 var resultText = result.responseText;


         if (resultText == '0') {
             if (form.isValid()) {

          

               prWin.setLoading(true);

               Ext.Ajax.request({
                 url: CONTEXT_PATH + '/design/bom.do?method=createNew',
                 params: {
                   parent_uid: -1,
                   parent: -1,
                   ac_uid: -1,
                   pl_no: '---',
                   bm_quan: 1,
                   item_name : rec.get('item_name'),
                   item_code : item_code_prd,
                   specification : full,
                   comment : specType,
                   standard_flag : 'A',
                   pj_code: '',
                   child: -1,
                   sg_code : 'T',
                   sp_code : 'B',
                   class_code : 'RPD'

                 },
                 success: function (result, request) {
                   prWin.setLoading(false);
                   Ext.MessageBox.alert('알림', '등록처리 되었습니다.')
                   prWin.close();
                   gm.me().store.load();
                 }, //endofsuccess
                 failure: function () {
                   prWin.setLoading(false);
                   extjsUtil.failureMessage();
                   prWin.close();
                   gm.me().store.load();
                 }
               }); //endofajax
             }
           }else{
             Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function () {
           });
           prWin.setLoading(false);
         }
       },
       failure: extjsUtil.failureMessage
     });
   }
 }
   }, {
     text: CMD_CANCEL,
     handler: function () {
       if (prWin) {
         prWin.close();
       }
     }
   }
   ]
 });
 prWin.show();
},



  // 삭제 버튼 Action Function
  deleteProps: function () {
    var confirmFlag = null;
    var rec = gm.me().grid.getSelectionModel().getSelection()[0];
    console_logs('>>>>>REC', rec);

     var uniqueId = rec['data']['unique_id'];
    var itemName = rec['data']['item_name'];
    var itemCode = rec['data']['item_code'];

    var confirmResult = Ext.MessageBox.confirm('삭제 알림', `${itemName}를 삭제하시겠습니까?`,
      function (btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            url: CONTEXT_PATH + '/design/bom.do?method=deleteSrcAhdSemi',
            params: { 
              'srcahd_uid': uniqueId,
              'item_code' : itemCode
            },
            success: function (request, request) {
              Ext.MessageBox.alert('알림', '삭제처리 되었습니다');
              gm.me().store.load();
            },
            failure: function () {
              extjsUtil.failureMessage();
            },
          });
        } else {
          return;
        }
      }
    );
   


  },

  
  



});


 