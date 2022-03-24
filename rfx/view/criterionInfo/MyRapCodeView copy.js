
Ext.define('Rfx.view.criterionInfo.MyRapCodeView', {
  extend: 'Rfx.base.BaseView',
  xtype: 'myrapCode-view',
  flex: 0.5,
  initComponent: function () {

    //검색툴바 필드 초기화
    //this.initSearchField();
    //검색툴바 추가
    //this.addSearchField('system_code');
    //this.addSearchField('code_name_kr');

    //this.setDefValue('parent_system_code','WORK_GROUP');
    //this.setDefValue('use_yn','Y');

    //Readonly Field 정의
    this.initReadonlyField();
    // this.addReadonlyField('unique_id');
    // this.addReadonlyField('create_date');
    // this.addReadonlyField('creator');
    // this.addReadonlyField('creator_uid');



    //검색툴바 생성
    var searchToolbar = this.craeteSearchToolbar();

    //명령툴바 생성
    var buttonToolbar = this.createCommandToolbar();

    //버튼삭제
    (buttonToolbar.items).each(function (item, index, length) {
      // index == 0 || index == 1 || index == 2 || index == 5 || index == 3 || index == 4
      if ( index == 1 || index == 2 || index == 5 || index == 3 || index == 4) {
        buttonToolbar.items.remove(item);
      }
    });


    //메인스토어
    this.createStore('Rfx.model.Series', [{
      property: 'unique_id',
      direction: 'DESC'
    }],
      gMain.pageSize/*pageSize*/
      , {}
      , ['code']
    );
    // 옵션 그리드 스토어
    this.generaSeriesOptionStore = Ext.create('Rfx.store.SeriesOptionStore', {});
    //옵션펙터 그리드 스토어
    this.generaOptionFactorStore = Ext.create('Rfx.store.OptionFactorStore', {});

    //그리드 생성
    var arr = [];
    arr.push(buttonToolbar);
    arr.push(searchToolbar);

    //grid 생성.
    this.createGrid(arr);


    var optionTypeStore = Ext.create('Ext.data.Store', {
      fields: ['fcode', 'fname'],
      data: [{
          "fcode": "string",
          "fname": "문자열"
      }, {
          "fcode": "number",
          "fname": "숫자"
      }, {
          "fcode": "select",
          "fname": "선택"
      }]
  });

       //시리즈 등록 버튼
       this.addSeriesBtn = Ext.create('Ext.Action', {
        xtype: 'button',
        iconCls: 'af-plus',
        text: '등록',
        tooltip: '코드정보 등록',
        disabled: false,
        handler: function () {
          var rec = gridViewOption.getSelectionModel().getSelection()[0];
  
          var childCodeForm = Ext.create('Ext.form.Panel', {
            title: '시리즈 정의',
            xtype: 'form',
            width: '100%',
            bodyPadding: 20,
            layout: {
              type: 'vbox',
              align: 'stretch'
            }, defaults: {
              allowBlank: true,
              msgTarget: 'side',
              labelWidth: 120
            },
            items: [
              {
                fieldLabel: '분류체계',
                xtype: 'combobox',
                id: gu.id('class_code'),
                name: 'class_code'
              },
              {
                fieldLabel: '제품시리즈 코드',
                xtype: 'textfield',
                id: gu.id('series_code'),
                name: 'series_code',
                allowBlank: false
              },
              {
                fieldLabel: '제품시리즈 명',
                xtype: 'textfield',
                id: gu.id('series_name'),
                name: 'series_name',
                allowBlank: false
              },
              {
                fieldLabel: '표준 단가',
                xtype: 'numberfield',
                id: gu.id('series_standard_price'),
                name: 'series_price',
                value: 0,
                allowBlank: false
              },
              {
                fieldLabel: '설명',
                xtype: 'textareafield',
                id: gu.id('series_desc'),
                height: 126,
                name: 'series_desc'
              },
              {
                xtype : 'filefield',
                //라벨 정의
                fieldLabel : '파일첨부',
                //파일첨부 버튼에 텍스트 정의
                //정의 안할시 Browse... 디폴트 정의됨
                buttonText  : '찾아보기',
                //<input type="file" name="fileupload"> 와 동일하게 서버에서 받기위한 name명이 fileupload
                name : 'fileupload'
            }
  
            ],
          });

          var attachFileGrid = Ext.create('Ext.form.Panel', {
            title: '첨부파일',
            store: this.attachedFileStore,
            title: '시리즈 정의',
            xtype: 'form',
            width: '100%',
            bodyPadding: 20,
            dockedItems: [{
                dock : 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default1',
                items:[gm.me().createMsTab('SIZE', 'SI')
                    // {
                    //     xtype: 'button',
                    //     text: '파일 첨부',
                    //     scale: 'small',
                    //     //glyph: 'xf0c6@FontAwesome',
                    //     scope : this.attachFileGrid,
                    //     handler : function() {
                    //        var file_code = gUtil.RandomString(10);

                    //         var url =  CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + file_code + '&group_code=' + null;

                    //         var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                    //             uploader : 'Ext.ux.upload.uploader.FormDataUploader',
                    //             uploaderOptions : {
                    //                 url : url
                    //             },
                    //             synchronous : true
                    //         });

                    //         var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                    //             dialogTitle : '파일 첨부',
                    //             panel : uploadPanel
                    //         });

                    //         this.mon(uploadDialog, 'uploadcomplete', function(uploadPanel, manager, items, errorCount) {

                    //             console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                    //             console_logs('this.mon uploadcomplete manager', manager);
                    //             console_logs('this.mon uploadcomplete items', items);
                    //             console_logs('this.mon uploadcomplete errorCount', errorCount);

                    //             gm.me().uploadComplete(items);
                    //             //if (!errorCount) {
                    //             uploadDialog.close();

                    //             //}
                    //         }, this);

                    //         gm.me().attachedFileStore.getProxy().setExtraParam('item_code', file_code);
                    //         gm.me().attachedFileStore.load();

                    //         uploadDialog.show();
                    //     }
                    // },
                ]
            }]
        });

          var tabPanel = Ext.widget('tabpanel', {

            layout: 'border',
            border: true,
            //width: "50%",
            minWidth: 200,
            height: "100%",
            region: 'east',
            border: false,
            resizable: true,
            scroll: false,
            tabPosition: 'top',
            collapsible: false,
            items: [childCodeForm, attachFileGrid],
            defaults: {
                listeners: {
                    activate: function (curTab, prevtab) {
                        // gm.me().selected_tab = curTab.multi_grid_id;
                        // activateFc(curTab, prevtab);
                    }
                }
            }
        });
  
  
          var win = Ext.create('Ext.Window', {
            modal: true,
            title: '제품 시리즈 등록',
            width: 600,
            height: 500,
            plain: true,
            items: tabPanel,
            buttons: [{
              text: CMD_OK,
              handler: function (btn) {
                if (btn == "no") {
                  win.close();
                } else {
                  var form = childCodeForm;
                  if (form.isValid()) {
                    win.setLoading(true);
                    var val = form.getValues(false);
                    // 등록 함수 호출
  
                    form.submit({
                      submitEmptyText: false,
                      url: CONTEXT_PATH + '/admin/Series.do?method=addSeries',
                      params: {
                        series_code: val['series_code'],
                        series_name: val['series_name']
                      },
                      success: function (val, action) {

                          //등록 성공 후 이미지 업로드
                          var file_code = gUtil.RandomString(10);
                          console_logs("사임ㄴ",val);
                          // Ext.Ajax.request({
                          //   //var url =  CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + file_code + '&group_code=' + null;
                          //   url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + file_code + '&group_code=' + null,
                          //   params:{
                          //     pj_first: pj_code,
                          //     codeLength: 5
                          //   },
                          //   success : function(result, request) {   	
                          //     win.setLoading(false);
                          //     gm.me().store.load();
                          //     // gm.me().poPrdDetailStore.load();
                          //     win.close();
                          //   },//endofsuccess
                          //   failure: extjsUtil.failureMessage
                          // });//endofajax
                          win.setLoading(false);
                          gm.me().store.load();
                          // gm.me().poPrdDetailStore.load();
                          win.close();
                       
                      },
                      failure: function () {
                        win.setLoading(false);
                        extjsUtil.failureMessage();
                      }
                    });
                  } else {
                    Ext.MessageBox.alert('알림', '입력 사항을 확인해주세요');
  
                  }
  
                }
              }
            }, {
              text: CMD_CANCEL,
              handler: function (btn) {
                win.close();
              }
            }]
          });
          win.show();
  
  
        }
      });
      //시리즈 삭제 버튼
      this.removeSeriesBtn = Ext.create('Ext.Action', {
        iconCls: 'af-remove',
        text: '삭제',
        tooltip: '삭제하기',
        disabled: true,
        handler: function (widget, event) {
          var rec =  gm.me().grid.getSelectionModel().getSelection()[0];
  
          var unique_id = rec.get('unique_id');
          var series_code = rec.get('series_code');
  
          gm.me().deleteSeriesProps(series_code, unique_id);
  
        }
      });
  
      //시리즈 수정 버튼
      this.editSeriesBtn = Ext.create('Ext.Action', {
        iconCls: 'af-edit',
        text: '수정',
        tooltip: '수정하기',
        disabled: true,
        handler: function (widget, event) {
  
          var rec = gm.me().grid.getSelectionModel().getSelection()[0];
  
          gm.me().modifySeriesProps(rec);
  
  
  
        } //endofhandler
      });
      buttonToolbar.insert(1, this.addSeriesBtn);
      buttonToolbar.insert(2, this.editSeriesBtn);
      buttonToolbar.insert(3, this.removeSeriesBtn);
      




    //서브그리드 Factor 등록버튼
    this.addChildCodeBtn = Ext.create('Ext.Action', {
      xtype: 'button',
      iconCls: 'af-plus',
      text: '등록',
      tooltip: '코드정보 등록',
      disabled: true,
      handler: function () {
        var rec = gridViewOption.getSelectionModel().getSelection()[0];

        var childCodeForm = Ext.create('Ext.form.Panel', {
          xtype: 'form',
          width: '100%',
          bodyPadding: 15,
          layout: {
            type: 'vbox',
            align: 'stretch'
          }, defaults: {
            allowBlank: true,
            msgTarget: 'side',
            labelWidth: 80
          },
          items: [
          
            new Ext.form.Hidden({
              name: 'soption_uid',
              id: 'soption_uid',
              value: rec.get('unique_id'),
            }),
            {
             // fieldLabel: 'OPTION',
              xtype: 'textfield',
              id: gu.id('soption'),
              name: 'soption',
              allowBlank: false,
              readOnly: true,
              border: false,
              value : rec.get('oname'),
              inputWrapCls: '',
              // remove default styling for div wrapping the input element and trigger button(s)
              triggerWrapCls: '',
              // remove the input element's background
              fieldStyle: 'background-color: #E3E9EF; background-image: none;'
            },
            {
              xtype: 'component',
              html: '<hr />',
              fieldStyle: 'background-color: #E3E9EF; background-image: none;'
            },
            {
              fieldLabel: '코드',
              xtype: 'textfield',
              id: gu.id('ocode'),
              name: 'ocode',
              allowBlank: false
            },
            {
              fieldLabel: '값',
              xtype: 'textfield',
              id: gu.id('oname'),
              name: 'oname',
              allowBlank: false
            },
            {
              fieldLabel: '선택 딘가',
              xtype: 'numberfield',
              id: gu.id('factor_price'),
              name: 'factor_price',
              value : 0,
              allowBlank: true
            },
            {
              fieldLabel: '선택 설명',
              xtype: 'textareafield',
              id: gu.id('factor_desc'),
              name: 'factor_desc',
              allowBlank: true
            }



          ],
        });

        var win = Ext.create('Ext.Window', {
          modal: true,
          title: '하위코드 등록',
          width: 400,
          height: 300,
          plain: true,
          items: childCodeForm,
          buttons: [{
            text: CMD_OK,
            handler: function (btn) {
              if (btn == "no") {
                win.close();
              } else {
                var form = childCodeForm;
                if (form.isValid()) {
                  win.setLoading(true);
                  var val = form.getValues(false);
                  // 등록 함수 호출

                  form.submit({
                    submitEmptyText: false,
                    url: CONTEXT_PATH + '/admin/Series.do?method=addOptionFactor',
                    params: {
                      soption_uid: val['soption_uid'],
                      ocode: val['ocode'],
                      ocode: val['oname']
                    },
                    success: function (val, action) {

                      win.setLoading(false);
                      gm.me().generaOptionFactorStore.load();
                      // gm.me().poPrdDetailStore.load();
                      win.close();
                    },
                    failure: function () {
                      win.setLoading(false);
                      extjsUtil.failureMessage();
                    }
                  });
                } else {
                  Ext.MessageBox.alert('알림', '입력 사항을 확인해주세요');

                }

              }
            }
          }, {
            text: CMD_CANCEL,
            handler: function (btn) {
              win.close();
            }
          }]
        });
        win.show();


      }
    });


    //서브그리드 Factor 삭제버튼
    this.removeAction = Ext.create('Ext.Action', {
      iconCls: 'af-remove',
      text: '삭제하기',
      tooltip: '삭제하기',
      disabled: true,
      handler: function (widget, event) {
        var rec = gridViewFactor.getSelectionModel().getSelection()[0];

        var unique_id = rec.get('unique_id');
        var ocode = rec.get('ocode');

        gm.me().deleteProps(ocode, unique_id);
        gm.me().generaOptionFactorStore.load();

      }
    });


    //서브그리드 Factor 업데이트
    this.editAction = Ext.create('Ext.Action', {
      iconCls: 'af-edit',
      text: '수정',
      tooltip: '수정하기',
      disabled: true,
      handler: function (widget, event) {

        var rec = gridViewFactor.getSelectionModel().getSelection()[0];

        gm.me().modifyProps(rec);



      } //endofhandler
    });


    this.addOptionBtn = Ext.create('Ext.Action', {
      xtype: 'button',
      iconCls: 'af-plus',
      text: '등록',
      tooltip: '코드정보 등록',
      disabled: true,
      handler: function () {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var childCodeForm = Ext.create('Ext.form.Panel', {
          xtype: 'form',
          width: '100%',
          bodyPadding: 15,
          layout: {
            type: 'vbox',
            align: 'stretch'
          }, defaults: {
            allowBlank: true,
            msgTarget: 'side',
            labelWidth: 80
          },
          items: [
          
            new Ext.form.Hidden({
              name: 'series_uid',
              id: 'series_uid',
              value: rec.get('unique_id'),
            }),
            {
              fieldLabel: '옵션 이름',
              xtype: 'textfield',
              id: gu.id('oname'),
              name: 'oname',
              allowBlank: false,
            },
            {
              fieldLabel: '옵션유형',
              xtype: 'combobox',
              displayField: 'fname',
              valueField: 'fcode',
              id: gu.id('option_type'),
              store: optionTypeStore,
              name: 'option_type'
            },
            {
              fieldLabel: '옵션 단가',
              xtype: 'numberfield',
              id: gu.id('option_price'),
              name: 'option_price',
              value: 0,
              allowBlank: false
            },
            {
              fieldLabel: '설명',
              xtype: 'textareafield',
              id: gu.id('option_desc'),
              height: 80,
              name: 'option_desc'
            }

          ],
        });

        var win = Ext.create('Ext.Window', {
          modal: true,
          title: 'OPTION 등록',
          width: 400,
          height: 300,
          plain: true,
          items: childCodeForm,
          buttons: [{
            text: CMD_OK,
            handler: function (btn) {
              if (btn == "no") {
                win.close();
              } else {
                var form = childCodeForm;
                if (form.isValid()) {
                  win.setLoading(true);
                  var val = form.getValues(false);
                  // 등록 함수 호출

                  form.submit({
                    submitEmptyText: false,
                    url: CONTEXT_PATH + '/admin/Series.do?method=addOption',
                    params: {
                      series_uid: val['series_uid'],
                      ocode: val['oname']
                    },
                    success: function (val, action) {

                      win.setLoading(false);
                      gm.me().generaSeriesOptionStore.load();
                      win.close();
                    },
                    failure: function () {
                      win.setLoading(false);
                      extjsUtil.failureMessage();
                    }
                  });
                } else {
                  Ext.MessageBox.alert('알림', '입력 사항을 확인해주세요');

                }

              }
            }
          }, {
            text: CMD_CANCEL,
            handler: function (btn) {
              win.close();
            }
          }]
        });
        win.show();


      }
    });


    //서브그리드 Factor 삭제버튼
    this.removeOptionBtn = Ext.create('Ext.Action', {
      iconCls: 'af-remove',
      text: '삭제하기',
      tooltip: '삭제하기',
      disabled: true,
      handler: function (widget, event) {
        var rec = gridViewFactor.getSelectionModel().getSelection()[0];

        var unique_id = rec.get('unique_id');
        var ocode = rec.get('ocode');

        gm.me().deleteProps(ocode, unique_id);
        gm.me().generaOptionFactorStore.load();

      }
    });


    //서브그리드 Factor 업데이트
    this.editOptionBtn = Ext.create('Ext.Action', {
      iconCls: 'af-edit',
      text: '수정',
      tooltip: '수정하기',
      disabled: true,
      handler: function (widget, event) {

        var rec = gridViewFactor.getSelectionModel().getSelection()[0];

        gm.me().modifyProps(rec);



      } //endofhandler
    });


    //서브그리드 Factor CRUD 버튼생성
    var FactorbuttonToolbar = Ext.create('widget.toolbar', {
      cls: 'my-x-toolbar-default2',
      items: [
        this.addChildCodeBtn,
        this.editAction,
        this.removeAction
      ]
    });

     //서브그리드 OPTION CRUD 버튼생성
     var OptionbuttonToolbar = Ext.create('widget.toolbar', {
      cls: 'my-x-toolbar-default2',
      items: [
        this.addOptionBtn,
        this.editActionOptionBtn,
        this.removeOptionBtn
      ]
    });





    // 서브 옵션 그리드
    var gridViewOption = Ext.create('Ext.grid.Panel', {
      title: 'OPTION',
      //cls: 'rfx-panel',
      collapsible: true,
      multiSelect: false,
      autoScroll: true,
      autoHeight: true,
      frame: true,
      store: this.generaSeriesOptionStore,
      tbar : OptionbuttonToolbar,

      reigon: 'north',
      layout: 'fit',
      forceFit: true,
      flex: 0.5,
      columns: [
        {
          text: '순번',
          width: 80,
          style: 'text-align:center',
          dataIndex: 'serial1',
        },
        {
          text: '옵션 이름',
          width: 200,
          style: 'text-align:center',
          dataIndex: 'oname',
        },
        {
          text: '옵션 유형',
          width: 100,
          style: 'text-align:center',
          dataIndex: 'option_type',
        },
        {
          text: '옵션 단가',
          width: 150,
          style: 'text-align:right',
          dataIndex: 'option_price',
        },
        {
          text: '설명',
          flex: 1,
          dataIndex: 'option_desc',
        }
      
      
      ],
        viewConfig: {
          plugins: [{
              ptype: 'gridviewdragdrop',
              dragText: 'Drag and drop to reorganize'
          }]
      },
      
      listeners: {

        select: function (dv, record) {
          //this.removeContractMatAction.disable();
          var rec = record.data;
          
          gm.me().readOptionfactor(rec.unique_id);
          gm.me().addChildCodeBtn.enable();


        }


      }


    });

    var gridViewFactor = Ext.create('Ext.grid.Panel', {
      title: '옵션 선택',
      //cls: 'rfx-panel',
      collapsible: true,
      multiSelect: false,
      autoScroll: true,
      autoHeight: true,
      frame: true,
      store: this.generaOptionFactorStore,
      tbar: FactorbuttonToolbar,

      reigon: 'south',
      layout: 'fit',
      forceFit: true,
      flex: 0.5,
      columns: [
        {
          text: '코드',
          width: 80,
          style: 'text-align:center',
          dataIndex: 'ocode'
        }, {
          text: '값',
          width: 150,
          value: "비고",
          style: 'text-align:right',
          dataIndex: 'oname'
        }, {
          text: '선택 딘가',
          width: 150,
          style: 'text-align:center',
          dataIndex: 'factor_price'
        }, {
          text: '선택 설명',
          width: 150,
          value: "비고",
          style: 'text-align:left',
          dataIndex: 'factor_desc'
        }
      
      ],
      listeners: {

        select: function (dv, record) {
          if (record != null && record.length > 0) {
            gm.me().editAction.disable();
            gm.me().removeAction.disable();
              
          }else{
          
            gm.me().editAction.enable();
            gm.me().removeAction.enable();
          }


        }


      }

    });

    var eastPanel = {
      collapsible: false,
      frame: false,
      region: 'east',
      layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
      },
      margin: '0 0 0 0',
      flex: 1,
      items: [gridViewOption, gridViewFactor]
    };






    //grid를 선택했을 때 Callback
    this.setGridOnCallback(function (selections) {
      //this.removeContractMatAction.disable();
      if (selections.length) {
        gm.me().removeSeriesBtn.enable();
        gm.me().editSeriesBtn.enable();
        gm.me().editAction.disable();
        gm.me().removeAction.disable();
        gm.me().addOptionBtn.enable();
        var rec = selections[0];
        this.generaSeriesOptionStore.getProxy().setExtraParams(
          {
            unique_id: rec.get('unique_id'),
          }
        );
        this.generaSeriesOptionStore.load();

      }

    });




    //입력/상세 창 생성.
    this.ceateCrudTab();

    Ext.apply(this, {
      layout: 'border',
      items: [this.grid, eastPanel/*, this.crudTab*/]
    });




    this.callParent(arguments);

    //디폴트 로드
    gMain.setCenterLoading(false);//스토아로딩에서는 Loading Message를 끈다.
    this.store.load(function (records) { });
  },




  readOptionfactor: function (unique_id) {

    //console.log('gene0',generaSeriesOptionStore);

    this.generaOptionFactorStore.getProxy().setExtraParams(
      {
        option_code: unique_id
      }
    );
    this.generaOptionFactorStore.load();

  },



  deleteProps: function (ocode, unique_id) {
    // var confirmFlag = null;
    // var rec = this.gridViewFactor.getSelectionModel().getSelection()[0];
    //var rec = gm.me().gridViewFactor.getSelection()[0];
    // console_logs('>>>>>REC', rec);



    var confirmResult = Ext.MessageBox.confirm('삭제 알림', `${ocode}를 삭제하시겠습니까?`,
      function (btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/Series.do?method=deleteOptionFactor',
            params: {
              'unique_id': unique_id
            },
            success: function (request, request) {
              Ext.MessageBox.alert('알림', '삭제처리 되었습니다');
              gm.me().generaOptionFactorStore.load();
              // gm.me().store.load();
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


  

  // 수정 버튼 Action Fucntion
  modifyProps: function (rec) {
    // var rec = gm.me().grid.getSelectionModel().getSelection()[0];
    // console_logs('>>>>> rec', rec);

    var form = Ext.create('Ext.form.Panel', {
      id: gu.id('modifyPropsPenel'),
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
          id: gu.id('modifyProps'),
          title: '데이터 속성 수정',
          frame: true,
          width: '100%',
          height: '100%',
          layout: 'fit',
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
              fieldLabel: 'OPTION',
              xtype: 'textfield',
              id: gu.id('ocode'),
              name: 'ocode',
              value: rec.get('ocode'),
              allowBlank: false
            },
            {
              fieldLabel: 'CODE',
              xtype: 'textfield',
              id: gu.id('oname'),
              name: 'oname',
              value: rec.get('oname'),
              allowBlank: false
            },

          ],
        },
      ],
    });

    var myWidth = 350;
    var myHeight = 200;

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

                Ext.Ajax.request({
                  url:
                    CONTEXT_PATH +
                    '/admin/Series.do?method=updateOptionFactor',
                  params: val,
                  success: function (result, request) {
                    if (prWin) {
                      console.log(`prWin : ${prWin}`);
                      gm.me().generaOptionFactorStore.load();
                      prWin.setLoading(false);
                      Ext.MessageBox.alert('알림', '수정처리 되었습니다.');
                      prWin.close();
                    }
                    gm.me().generaOptionFactorStore.load();
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

  modifySeriesProps: function (rec) {
    // var rec = gm.me().grid.getSelectionModel().getSelection()[0];
    // console_logs('>>>>> rec', rec);

    var form = Ext.create('Ext.form.Panel', {
      id: gu.id('modifyPropsPenel'),
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
          id: gu.id('modifyProps'),
          title: '시리즈 수정',
          frame: true,
          width: '100%',
          height: '100%',
          layout: 'fit',
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
              fieldLabel: 'SERIES_CODE',
              xtype: 'textfield',
              id: gu.id('series_code'),
              name: 'series_code',
              allowBlank: false
            },
            {
              fieldLabel: 'SERIES_NAME',
              xtype: 'textfield',
              id: gu.id('series_name'),
              name: 'series_name',
              allowBlank: false
            },

          ],
        },
      ],
    });

    var myWidth = 350;
    var myHeight = 200;

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

                Ext.Ajax.request({
                  url:
                    CONTEXT_PATH +
                    '/admin/Series.do?method=updateSeries',
                  params: val,
                  success: function (result, request) {
                    if (prWin) {
                      console.log(`prWin : ${prWin}`);
                      gm.me().generaOptionFactorStore.load();
                      prWin.setLoading(false);
                      Ext.MessageBox.alert('알림', '수정처리 되었습니다.');
                      prWin.close();
                    }
                    gm.me().grid.load();
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

  deleteSeriesProps: function (series_code, unique_id) {
    // var confirmFlag = null;
    // var rec = this.gridViewFactor.getSelectionModel().getSelection()[0];
    //var rec = gm.me().gridViewFactor.getSelection()[0];
    // console_logs('>>>>>REC', rec);



    var confirmResult = Ext.MessageBox.confirm('삭제 알림', `${series_code}를 삭제하시겠습니까?`,
      function (btn) {
        if (btn == 'yes') {
          Ext.Ajax.request({
            url: CONTEXT_PATH + '/admin/Series.do?method=deletSeries',
            params: {
              'unique_id': unique_id
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

  createMsTab: function (title, tabname) {
    var record = gm.me().grid.getSelectionModel().getSelection()[0];
    if (this.stores.length < 1) {
        this.stores.push(Ext.create('Ext.data.Store', {
            fields: ['name', 'size', 'file', 'status']
        }));
    }
    var sc = this.storecount/*++*/;
    var tabDataUpload = Ext.create('Ext.panel.Panel', {
        title: '시리즈 정의',
        tabPosition: 'bottom',
        plain: true,
        width: '100%',
        items: [
            {
                xtype: 'form',
                items: [
                    {
                        items: [{
                            multiSelect: true,
                            xtype: 'grid',
                            id: 'UploadGrid' + [sc],
                            selModel: Ext.create("Ext.selection.CheckboxModel"),
                            columns: [{
                                header: gm.me().getMC('mes_sro5_pln_column_file_name', '파일명'),
                                dataIndex: 'name',
                                flex: 2
                            }, {
                                header: gm.me().getMC('mes_sro5_pln_column_file_size', '파일크기'),
                                dataIndex: 'size',
                                flex: 1,
                                renderer: Ext.util.Format.fileSize
                            }, {
                                header: gm.me().getMC('mes_sro5_pln_column_status', '상태'),
                                dataIndex: 'status',
                                flex: 1,
                                renderer: this.rendererStatus
                            }],
                            viewConfig: {
                                emptyText: gm.me().getMC('mes_sro5_pln_msg_drag', '이곳에 파일을 끌어 놓으세요'),
                                height: 700,
                                deferEmptyText: false
                            },
                            store: this.stores[sc],

                            listeners: {

                                drop: {
                                    element: 'el',
                                    fn: 'drop'
                                },

                                dragstart: {
                                    element: 'el',
                                    fn: 'addDropZone'
                                },

                                dragenter: {
                                    element: 'el',
                                    fn: 'addDropZone'
                                },

                                dragover: {
                                    element: 'el',
                                    fn: 'addDropZone'
                                },

                                dragleave: {
                                    element: 'el',
                                    fn: 'removeDropZone'
                                },

                                dragexit: {
                                    element: 'el',
                                    fn: 'removeDropZone'
                                },

                            },

                            noop: function (e) {
                                e.stopEvent();
                            },

                            addDropZone: function (e) {
                                if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) {
                                    return;
                                }
                                e.stopEvent();
                                this.addCls('drag-over');
                            },

                            removeDropZone: function (e) {
                                var el = e.getTarget(),
                                    thisEl = this.getEl();
                                e.stopEvent();
                                if (el === thisEl.dom) {
                                    this.removeCls('drag-over');
                                    return;
                                }

                                while (el !== thisEl.dom && el && el.parentNode) {
                                    el = el.parentNode;
                                }

                                if (el !== thisEl.dom) {
                                    this.removeCls('drag-over');
                                }

                            },

                            drop: function (e) {

                                e.stopEvent();
                                Ext.Array.forEach(Ext.Array.from(e.browserEvent.dataTransfer.files), function (file) {
                                    gm.me().stores[0].add({
                                        file: file,
                                        name: file.name,
                                        size: file.size,
                                        status: '대기'

                                    });
                                });
                                this.removeCls('drag-over');
                            },

                            tbar: [{
                                text: gm.me().getMC('mes_sro5_pln_btn_upload', '업로드'),
                                handler: function () {
                                    var l_store = gm.me().stores[0];
                                    for (var i = 0; i < l_store.data.items.length; i++) {
                                        if (!(l_store.getData().getAt(i).data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
                                            l_store.getData().getAt(i).data.status = gm.me().getMC('mes_sro5_pln_btn_uploading', '업로드중');
                                            l_store.getData().getAt(i).commit();
                                            gm.me().postDocument(CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long'),
                                                l_store, i, tabname);
                                        }
                                    }
                                }
                            }, {
                                text: gm.me().getMC('mes_sro5_pln_btn_remove_all', '전체삭제'),
                                handler: function () {
                                    var l_store = gm.me().stores[0];
                                    l_store.reload();
                                }
                            }, {
                                text: gm.me().getMC('mes_sro5_pln_btn_remove_optionally', '선택삭제'),
                                handler: function () {
                                    var l_store = gm.me().stores[0];
                                    l_store.remove(Ext.getCmp('UploadGrid0').getSelection());
                                }
                            }]
                        }],
                    }
                ]
            }
        ]
    });
    return tabDataUpload;
},




stores: [],
  items: [],
  attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} )

});



