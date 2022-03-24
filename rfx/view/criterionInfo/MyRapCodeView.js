
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
    var searchToolbar = this.createSearchToolbar();

    //명령툴바 생성
    var buttonToolbar = this.createCommandToolbar();

    //버튼삭제
    (buttonToolbar.items).each(function (item, index, length) {
      // index == 0 || index == 1 || index == 2 || index == 5 || index == 3 || index == 4
      if (index == 1 || index == 2 || index == 5 || index == 3 || index == 4) {
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


    this.addSeriesBtn = Ext.create('Ext.Action', {
      iconCls: 'af-plus-circle',
      text: gm.getMC('CMD_Enrollment', '등록'),
      tooltip: '게시글 등록',
      disabled: false,
      handler: function () {
        gMain.selPanel.labRegistHandler();
      }
    });



    //  //시리즈 등록 버튼
    //  this.addSeriesBtn = Ext.create('Ext.Action', {
    //   xtype: 'button',
    //   iconCls: 'af-plus',
    //   text: gm.getMC('CMD_Enrollment', '등록'),
    //   tooltip: '코드정보 등록',
    //   disabled: false,
    //   handler: function () {
    //     var rec = gridViewOption.getSelectionModel().getSelection()[0];

    //     var file_code = gUtil.RandomString(10);

    //     var docu_items = [];


    //     var childCodeForm = Ext.create('Ext.form.Panel', {
    //       title: '시리즈 정의',
    //       xtype: 'form',
    //       width: '100%',
    //       bodyPadding: 20,
    //       viewModel: {},
    //       layout: {
    //         type: 'vbox',
    //         align: 'stretch'
    //       }, defaults: {
    //         allowBlank: true,
    //         msgTarget: 'side',
    //         labelWidth: 120
    //       },
    //       items: [
    //         {
    //           fieldLabel: '분류체계',
    //           xtype: 'combobox',
    //           id: gu.id('class_code'),
    //           name: 'class_code'
    //         },
    //         {
    //           fieldLabel: '제품시리즈 코드',
    //           xtype: 'textfield',
    //           id: gu.id('series_code'),
    //           name: 'series_code',
    //           allowBlank: false
    //         },
    //         {
    //           fieldLabel: '제품시리즈 명',
    //           xtype: 'textfield',
    //           id: gu.id('series_name'),
    //           name: 'series_name',
    //           allowBlank: false
    //         },
    //         {
    //           fieldLabel: '표준 단가',
    //           xtype: 'numberfield',
    //           id: gu.id('series_standard_price'),
    //           name: 'series_price',
    //           value: 0,
    //           allowBlank: false
    //         },
    //         {
    //           fieldLabel: '설명',
    //           xtype: 'textareafield',
    //           id: gu.id('series_desc'),
    //           height: 126,
    //           name: 'series_desc'
    //         } 
    //         ,
    //         {
    //           xtype: 'filefield',
    //           fieldLabel: '이미지 첨부',
    //           listeners: {
    //               change (field) {
    //                   const dom = Ext.getDom(field.fileInputEl);
    //                   const container = field.up('container');
    //                   const viewModel = container.getViewModel();
    //                   const reader = new FileReader();

    //                   reader.onload = e => viewModel.set('imgData', e.target.result);

    //                   reader.readAsDataURL(dom.files[ 0 ]);
    //               }
    //           }
    //       },
    //       {
    //           xclass: 'Ext.Img',
    //           id: gu.id('file_sumnail'),
    //           flex: 5,

    //           height :126,
    //           bind: {
    //                src: '{imgData}'
    //           }
    //       }

    //       ],
    //     });




    //     var attachFileGrid = Ext.create('Ext.grid.Panel', {
    //       title: '첨부파일',
    //       store: this.attachedFileStore,
    //       layout:'fit',
    //       columns : [
    //           {text: "UID", width: 120, dataIndex: 'unique_id', sortable: true},
    //           {text: "파일명", flex: 1, dataIndex: 'object_name', sortable: true},
    //           {text: "날짜", width: 125, dataIndex: 'create_date', sortable: true},
    //           {text: "크기", width: 125, dataIndex: 'file_size', sortable: true}
    //       ],
    //       border : false,
    //       multiSelect: false,
    //       frame: false,
    //       dockedItems: [{
    //           dock : 'top',
    //           xtype: 'toolbar',
    //           cls: 'my-x-toolbar-default1',
    //           items:[
    //               {
    //                   xtype: 'button',
    //                   text: '파일 첨부',
    //                   scale: 'small',
    //                   glyph: 'xf0c6@FontAwesome',
    //                   scope : this.attachFileGrid,
    //                   handler : function() {

    //                       var url =  CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' + file_code + '&group_code=' + null;

    //                       var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
    //                           uploader : 'Ext.ux.upload.uploader.FormDataUploader',
    //                           uploaderOptions : {
    //                               url : url
    //                           },
    //                           synchronous : true
    //                       });

    //                       var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
    //                           dialogTitle : '파일 첨부',
    //                           panel : uploadPanel
    //                       });

    //                       this.mon(uploadDialog, 'uploadcomplete', function(uploadPanel, manager, items, errorCount) {

    //                           console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
    //                           console_logs('this.mon uploadcomplete manager', manager);
    //                           console_logs('this.mon uploadcomplete items', items);
    //                           console_logs('this.mon uploadcomplete errorCount', errorCount);

    //                           gm.me().uploadComplete(items);
    //                           //if (!errorCount) {
    //                           uploadDialog.close();

    //                           //}
    //                       }, this);

    //                       gm.me().attachedFileStore.getProxy().setExtraParam('item_code', file_code);
    //                       gm.me().attachedFileStore.load();

    //                       uploadDialog.show();
    //                   }
    //               },
    //           ]
    //       }]
    //   });

    //     var tabPanel = Ext.widget('tabpanel', {

    //       layout: 'border',
    //       border: true,
    //       //width: "50%",
    //       minWidth: 200,
    //       height: "100%",
    //       region: 'east',
    //       border: false,
    //       resizable: true,
    //       scroll: false,
    //       tabPosition: 'top',
    //       collapsible: false,
    //       items: [childCodeForm, attachFileGrid],
    //       defaults: {
    //           listeners: {
    //               activate: function (curTab, prevtab) {
    //                   // gm.me().selected_tab = curTab.multi_grid_id;
    //                   // activateFc(curTab, prevtab);
    //               }
    //           }
    //       }
    //   });


    //     var win = Ext.create('Ext.Window', {
    //       modal: true,
    //       title: '제품 시리즈 등록',
    //       width: 600,
    //       height: 550,
    //       plain: true,
    //       items: tabPanel,
    //       buttons: [{
    //         text: CMD_OK,
    //         handler: function (btn) {
    //           if (btn == "no") {
    //             win.close();
    //           } else {
    //             var form = childCodeForm;
    //             if (form.isValid()) {
    //               win.setLoading(true);
    //               var val = form.getValues(false);
    //               // 등록 함수 호출
    //               var file_itemcode = gUtil.RandomString(10);
    //               form.submit({
    //                 //submitEmptyText: false,
    //                 url: CONTEXT_PATH + '/admin/Series.do?method=addSeries',
    //                 params: {
    //                   file_itemcode : file_itemcode,
    //                   series_code: val['series_code'],
    //                   series_name: val['series_name']
    //                 },
    //                 success: function (data) {
    //                   console_logs('상민',data);
    //                   win.setLoading(false);
    //                   gm.me().store.load();
    //                   // gm.me().poPrdDetailStore.load();
    //                   win.close();
    //                 },
    //                 failure: function () {

    //                   win.setLoading(false);
    //                   gm.me().store.load();
    //                   win.close();win.close();
    //                   extjsUtil.failureMessage('작업에 실패하였습니다.');
    //                 }
    //               });
    //             } else {
    //               Ext.MessageBox.alert('알림', '입력 사항을 확인해주세요');

    //             }

    //           }
    //         }
    //       }, {
    //         text: CMD_CANCEL,
    //         handler: function (btn) {
    //           win.close();
    //         }
    //       }]
    //     });
    //     win.show();


    //   }
    // });

    //시리즈 삭제 버튼
    this.removeSeriesBtn = Ext.create('Ext.Action', {
      iconCls: 'af-remove',
      text: gm.getMC('CMD_DELETE', '삭제'),
      tooltip: '삭제하기',
      disabled: true,
      handler: function (widget, event) {
        var rec = gm.me().grid.getSelectionModel().getSelection()[0];

        var unique_id = rec.get('unique_id');
        var series_code = rec.get('series_code');

        gm.me().deleteSeriesProps(series_code, unique_id);

      }
    });

    //시리즈 수정 버튼
    this.editSeriesBtn = Ext.create('Ext.Action', {
      iconCls: 'af-edit',
      text: gm.getMC('CMD_MODIFY', '수정'),
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
      text: gm.getMC('CMD_Enrollment', '등록'),
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
              value: rec.get('oname'),
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
              fieldLabel: '선택 단가',
              xtype: 'numberfield',
              id: gu.id('factor_price'),
              name: 'factor_price',
              value: 0,
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
          height: 400,
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
                      ocode: val['oname'],
                      factor_price : val['factor_price'],
                      factor_desc : val['factor_desc']
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
      text: gm.getMC('CMD_MODIFY', '수정'),
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
      text: gm.getMC('CMD_Enrollment', '등록'),
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
            // {
            //   fieldLabel: '옵션유형',
            //   xtype: 'combobox',
            //   displayField: 'fname',
            //   valueField: 'fcode',
            //   id: gu.id('option_type'),
            //   store: optionTypeStore,
            //   name: 'option_type'
            // },
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
                      ocode: val['oname'],
                      option_price : val['option_price'],
                      option_desc : val['option_desc']
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
      text: gm.getMC('CMD_MODIFY', '수정'),
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
      tbar: OptionbuttonToolbar,

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
        // {
        //   text: '옵션 유형',
        //   width: 100,
        //   style: 'text-align:center',
        //   dataIndex: 'option_type',
        // },
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
          text: '선택 단가',
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

          } else {

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
    this.createCrudTab();

    Ext.apply(this, {
      layout: 'border',
      items: [this.grid, eastPanel/*, this.crudTab*/]
    });




    this.callParent(arguments);

    //디폴트 로드
    gMain.setCenterLoading(false);
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

  labRegistHandler: function () {
    var file_code = gUtil.RandomString(10);

    console_logs('==z', this.columns);

    var docu_items = [];

    Ext.each(this.columns, function (columnObj, index) {
      var dataIndex = columnObj["dataIndex"];
      var text = columnObj["text"];
      var type = columnObj["dataType"];
      var xtype = null;
      var check = dataIndex.substr(0, 2);

      switch (type) {
        case 'string':
          xtype = 'textfield';
          break;
        case 'int':
          xtype = 'numberfield';
          break;
        case 'sdate':
          xtype = 'datefield';
          break;
        default:
          xtype = 'textfield';
          break;
      }

      if (check == 'v0') {
        docu_items.push(
          {
            xtype: xtype,
            id: dataIndex,
            name: dataIndex,
            fieldLabel: text,
            width: 500,
            height: 50
          }
        )
      }
    });

    console_logs('=zasd', docu_items);

    var form = Ext.create('Ext.form.Panel', {
      title: '시리즈 정의',
            xtype: 'form',
            width: '100%',
            bodyPadding: 20,
            viewModel: {},
            layout: {
              type: 'vbox',
              align: 'stretch'
            }, defaults: {
              allowBlank: true,
              msgTarget: 'side',
              labelWidth: 120
            },
      layout: {
                type: 'vbox',
                align: 'stretch'
              },
      defaults: {
                allowBlank: true,
                msgTarget: 'side',
                labelWidth: 120
              },
      items: [

            new Ext.form.Hidden({
              name: 'file_code',
              value: file_code
            }),
            // {
            //   fieldLabel: '분류체계',
            //   xtype: 'combobox',
            //   id: gu.id('class_code'),
            //   name: 'class_code'
            // },
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
            }
            // ,
            // {
            //   xtype: 'filefield',
            //   fieldLabel: '이미지 첨부',
            //   listeners: {
            //     change(field) {
            //       const dom = Ext.getDom(field.fileInputEl);
            //       const container = field.up('container');
            //       const viewModel = container.getViewModel();
            //       const reader = new FileReader();

            //       reader.onload = e => viewModel.set('imgData', e.target.result);

            //       reader.readAsDataURL(dom.files[0]);
            //     }
            //   }
            // },
            // {
            //   xclass: 'Ext.Img',
            //   flex: 5,

            //   height: 126,
            //   bind: {
            //     src: '{imgData}'
            //   }
            // }
          
        
      ]
    });

    var form_docu = Ext.create('Ext.form.Panel', {
			id: gu.id('formPanelDocu'),
			xtype: 'form',
			title: '추가정보',
			frame: false,
			border: false,
			width: 1000,
			height: 400,
			autoScroll:true,
			bodyPadding: '3 3 0',
			region: 'center',
			fieldDefaults: {
				labelAlign: 'right',
				msgTarget: 'side'
			},
			// defaults: {
			// 	anchor: '100%',
			// 	labelWidth: 60,
			// 	margins: 60
			// },
			items: docu_items
			
		});



    var attachFileGrid = Ext.create('Ext.grid.Panel', {
      title: '첨부파일',
      store: this.attachedFileStore,
      layout: 'fit',
      columns: [
        { text: "UID", width: 120, dataIndex: 'unique_id', sortable: true },
        { text: "파일명", flex: 1, dataIndex: 'object_name', sortable: true },
        { text: "날짜", width: 125, dataIndex: 'create_date', sortable: true },
        { text: "크기", width: 125, dataIndex: 'file_size', sortable: true },
        {
          xtype: 'checkcolumn',
          text: '메인이미지',
          dataIndex: 'main_image',
          width:  125 ,
          style: 'text-align:center',
          align: 'center',
          disabled: false,
          id : 'main_image_check',
          listeners: {
              checkchange: {
                  fn: function( obj, rowIndex, checked, eOpts){
                      gm.me().checkTreeNode(obj, rowIndex, checked, 'main_image');

                  }
              }
          },
          stopSelection: true
      }
      ],
      border: false,
      multiSelect: false,
      frame: false,
      dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        cls: 'my-x-toolbar-default1',
        items: [
          {
            xtype: 'button',
            text: '파일 첨부',
            scale: 'small',
            glyph: 'xf0c6@FontAwesome',
            scope: this.attachFileGrid,
            handler: function () {

              var url = CONTEXT_PATH + '/uploader.do?method=multiImg&file_itemcode=' + file_code + '&group_code=' + null;

              var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                uploader: 'Ext.ux.upload.uploader.FormDataUploader',
                uploaderOptions: {
                  url: url
                },
                synchronous: true
              });

              var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                dialogTitle: '파일 첨부',
                panel: uploadPanel
              });

              this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {

                console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                console_logs('this.mon uploadcomplete manager', manager);
                console_logs('this.mon uploadcomplete items', items);
                console_logs('this.mon uploadcomplete errorCount', errorCount);

                gm.me().uploadComplete(items);
                //if (!errorCount) {
                uploadDialog.close();

                //}
              }, this);

              gm.me().attachedFileStore.getProxy().setExtraParam('item_code', file_code);
              gm.me().attachedFileStore.load();

              uploadDialog.show();
            }
          },
        ]
      }]
    });

    var win_form = [];
		if(form_docu.items.length > 0) {
			win_form.push(form);
			win_form.push(form_docu);
			win_form.push(attachFileGrid);
		} else {
			win_form.push(form);
			win_form.push(attachFileGrid);
		}

  
    var prWin = Ext.create('ModalWindow', {
      modal: true,
      title: '등록',
      plain: true,
      width: 1100,
      height: 600,
      items: [
        {
          region: 'center',
          xtype: 'tabpanel',
          items: win_form
        }
      ],
      buttons: [{
        text: CMD_OK,
        handler: function (btn) {
          if (btn == "no") {
            prWin.close();
          } else {
            if (form.isValid()) {
              var val = form.getValues(false);
  

              form.submit({
                url: CONTEXT_PATH + '/admin/Series.do?method=addSeries',
                params: {val, file_code :file_code },
                success: function (result, response) {
                  console_logs('result', result);
                  console_logs('response', response);
                  
                  gm.me().store.load();
                  prWin.close();
                },
                //failure: extjsUtil.failureMessage
                failure: function(result, response){
                  console_logs('result', result);
                  console_logs('response', response);
                  console_logs('잘못된값입니다.');
                },
              })
            }
          }
        }
      }, {
        text: CMD_CANCEL,
        handler: function () {
          if (prWin) {

            prWin.close();

          }
        }
      }]
    });
    prWin.show();
  },

  parentRecursive: function(o, dataIndex) {
    o.set(dataIndex, false);
    var id = o.get('unique_id');
  
    var value = "Y";
  
    gm.editAjax(
        "srccst",
        dataIndex,
        value,
        "unique_id",
        id
    );
    gm.me().attachedFileStore.load();
  
  },


  checkTreeNode: function (obj, rowIndex, checked, dataIndex) {
    this.togToast = false;
    this.recCount = 0;
   
      
                if(obj!=null) {
                    var o = obj.up('grid').getStore().getAt(rowIndex);
                    if(checked==true){

                      
                      Ext.Msg.confirm("title","메인사진으로 설정 하시겠습니까? 확인을 누르시면 수정이 불가능합니다.", function(btn){
                        if(btn=='yes'){
                        
                          gm.me().parentRecursive(o ,dataIndex);
                          console.log('ok');
                          obj.setDisabled(true);
                        }else{
                          obj.setDisabled(false);
                          gm.me().attachedFileStore.load();
                          console.log('why not');
                        }
                      });
                      
                        
                    }
                   
                    
                }


    

},







  items: [],
  attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', { group_code: null }),

  docuStore: Ext.create('Mplm.store.DocuStore'),

  uploadComplete: function (items) {

    console_logs('uploadComplete items', items);

    var output = 'Uploaded files: <br>';
    Ext.Array.each(items, function (item) {
      output += item.getFilename() + ' (' + item.getType() + ', '
        + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
    });

    console_logs('파일업로드 결과', output);

    this.attachedFileStore.load(function (records) {
      if (records != null) {
        var o = gu.getCmp('file_quan');
        if (o != null) {
          o.update('총수량 : ' + records.length);
        }

      }
    });
  }

});



