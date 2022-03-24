requires: [
  'Ext.layout.container.Card'
],




  Ext.define('Rfx.view.salesDelivery.SeriesListView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'series-list-view',
    initComponent: function () {
      this.initDefValue();

      //검색툴바 필드 초기화
      this.initSearchField();

    

      // 검색 툴바 Text Search Fields
      this.addSearchField('mchn_code');
      this.addSearchField('name_ko'); //.J2_CODE에 추가후 적용 예정 

      //검색툴바 생성
      var searchToolbar = this.createSearchToolbar();

      // //명령툴바 생성
      var buttonToolbar = this.createCommandToolbar({
        REMOVE_BUTTONS: ['REMOVE', 'COPY', 'EDIT', 'REGIST'],
      });

      var series_uid = -1;

      // default load store 선언 EquipmentProps.js 
      this.createStore(
        'Rfx.model.SeriesAdd',
        
        [
          {
            autoLoad:false,
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

      this.SeriesStore = Ext.create('Rfx.store.SeriesStore', {autoLoad: true});
      this.SeriesImgStore = Ext.create('Rfx.store.SeriesImgStore', {autoLoad: false});
 
    Ext.define('MyEmployee', {
      extend: 'Ext.data.Model'
    , requires: ['Ext.data.proxy.Rest']
    , idProperty: 'employeeNumber'
    , fields: [
        'employeeNumber', 'displayName'
     ]
     ,    data: [
                {displayName: 'Peter',  employeeNumber: 26},
                {displayName: 'Ray',   employeeNumber: 27},
                {displayName: 'Egon', employeeNumber: 24},
                {displayName: 'Winston', employeeNumber: 25}
            ]
    // , proxy: {
    //       type: 'rest'
    //       , url: '/employee/record/summary'
    // }
    });
    
    Ext.define('MyEmployees', {
      extend: 'Ext.data.Store'
      , model: 'MyEmployee'
    });



  Ext.define('MyEmployeePhotoPanel', {
    extend: 'Ext.view.View'
    , alias: 'widget.employeeSearchResultsPanel'
    , minHeight: 600
    , itemSelector: 'div.employee'
    ,    store: this.SeriesStore
    //, title: 'Search Results'
    , tpl: new Ext.XTemplate(
            '<tpl for=".">'
            , '<div class="employee">'
                , '<img class="imgFit" src="' + vContent_full_path + '/series/'  + '{file_path}' + '">'
                , '<div class="displayLabel">{series_name:ellipsis(20)}</div>'
            , '</div>'
            , '</tpl>'
        )
        //http://localhost/web_content75/company_logo/BIOT01KR.png

        // <img style="height:20px;" src="' + 
				// 	 vContent_full_path + '/company_logo/' + vCompanyReserved4 + '.png">
    , load: function(searchCriteria) {
        this.store.load({
            params: {
                '$filter': searchCriteria
            }
                , scope: this
        })
        },
        listeners: {
          itemclick: function(view, record, item, index, e, eOpts) {
            series_uid = record.get('unique_id');
            console_logs('클릭' ,series_uid );

            //그리드 보여주기
            gm.me().store.getProxy().setExtraParams({
              series_uid : series_uid
           });
            gm.me().store.load();

            //보조 이미지 보여주기
            gm.me().SeriesImgStore.getProxy().setExtraParams({
              series_uid : series_uid
           });
           
           gm.me().SeriesImgStore.load(
             function(records){
               console_logs("상민",records);
             }
           );
          }
        }
        
    }
);

// Ext.define('MyEmployeePhotoPanel2', {
//   extend: 'Ext.view.View'
//   , alias: 'widget.employeeSearchResultsPanel'
//   , minHeight: 600
//   , itemSelector: 'div.employee'
//   ,    store: this.SeriesImgStore
//   //, title: 'Search Results',
//   ,plugins: {
//               'ux-animated-dataview': true
//           }
//   , tpl: new Ext.XTemplate(
//     '<tpl for=".">'
//                           , '<div >'
//                               , '<img  style =" width: 100%;"    src="' + vContent_full_path + '/series/'  + '{file_path}' + '">'
//                           , '</div>'
//                           , '</tpl>'
//       )
//       //http://localhost/web_content75/company_logo/BIOT01KR.png

//       // <img style="height:20px;" src="' + 
//       // 	 vContent_full_path + '/company_logo/' + vCompanyReserved4 + '.png">
//   , load: function(searchCriteria) {
//       this.store.load({
//           params: {
//               '$filter': searchCriteria
//           }
//               , scope: this
//       })
//       },
    
      
//   }
// );

Ext.define('MyEmployeePhotoPanel2', {
  extend: 'Ext.panel.Panel',
  xtype: 'dataview-multisort',


  //title: 'Multi-sort DataView',
  layout: 'fit',
  width: 540,
  height: 620,
 autoScroll: true,

  items: {
      xtype: 'dataview',
      // reference: 'dataview',
      plugins: {
          'ux-animated-dataview': true
      },
      tpl: [
                      '<tpl for=".">'
                      , '<div>'
                          , '<img  style =" width: 95%; height : 400px;"    src="' + vContent_full_path + '/series/'  + '{file_path}' + '">'
                      , '</div>'
                      , '</tpl>'
                  
      ],

      store: this.SeriesImgStore,
  }
});


// Ext.define('MyEmployeePhotoPanel2', {
//   extend: 'Ext.view.View'
//   , alias: 'widget.employeeSearchResultsPanel'
//   , minHeight: 600
//   , itemSelector: 'div.employee'
//   ,    store: this.SeriesStore
//   //, title: 'Search Results'
//   , tpl: new Ext.XTemplate(
//           '<tpl for=".">'
//           , '<div>'
//               , '<img class="imgFit" src="' + vContent_full_path + '/series/'  + '{file_path}' + '">'

//           , '</div>'
//           , '</tpl>'
//       )
//       //http://localhost/web_content75/company_logo/BIOT01KR.png

//       // <img style="height:20px;" src="' + 
//       // 	 vContent_full_path + '/company_logo/' + vCompanyReserved4 + '.png">
//   , load: function(searchCriteria) {
//       this.store.load({
//           params: {
//               '$filter': searchCriteria
//           }
//               , scope: this
//       })
//       },
//       listeners: {
//         itemclick: function(view, record, item, index, e, eOpts) {
//           series_uid = record.get('age');
//           console_logs('클릭' ,vContent_full_path );
//           gm.me().store.getProxy().setExtraParams({
//             series_uid : series_uid
//          });
//           gm.me().store.load();
//         }
//       }
      
//   }
// );


//  Ext.define('MyEmployeePhotoPanel2', {
//     extend: 'Ext.panel.Panel'
//     , alias: 'widget.employeeSearchResultsPanel2'
//     , minHeight: 600
//     , itemSelector: 'div.employee',
//     //, title: 'Search Results'
    
//     items : [
//       {
//       xtype : 'dataview',
//       // Dynamically calculate width here
//       width : 500,
//       store: this.SeriesStore,
//       tpl: new Ext.XTemplate(
//        '<tpl for=".">'
//        , '<div class="employee">'
//            , '<img class="imgFit" src="' + vContent_full_path + '/series/'  + '{file_path}' + '">'
//        , '</div>'
//        , '</tpl>'
//       )
//       }
//     ]
//   //  tpl: new Ext.XTemplate(
//   //           '<tpl for=".">'
//   //           , '<div >'
//   //               , '<img class="imgFit" src="' + vContent_full_path + '/series/'  + '{file_path}' + '">'
//   //           , '</div>'
//   //           , '</tpl>'
//   //       )
//     , 
//     load: function(searchCriteria) {
//         this.store.load({
//             params: {
//                 '$filter': searchCriteria
//             }
//                 , scope: this
//         })
//         },
//         listeners: {
//           itemclick: function(view, record, item, index, e, eOpts) {
//             series_uid = record.get('age');
//             console_logs('클릭' ,vContent_full_path );
//             gm.me().store.getProxy().setExtraParams({
//               series_uid : series_uid
//            });
//             gm.me().store.load();
//           }
//         }
        
//     }
// );







   // var store = Ext.getStore("ciGallery");

    var panel = Ext.create('MyEmployeePhotoPanel', {
      region: 'west',
      width: '40%'
    });



    var panel2 = Ext.create('MyEmployeePhotoPanel2', {
      width: '30%',
      autoScroll : true
  
    });

    var eastPanel = {
      collapsible: false,
      frame: true,
      region: 'east',
      width: '60%',
      layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
      },
      margin: '1 1 1 1',
      flex: 1,
      items: [this.grid,panel2]
    };


      Ext.apply(this, {
        layout: 'border',
        items: [eastPanel, panel/*this.crudTab*/],
      });

      // 신규등록 버튼 선언
      this.addPropsButton = Ext.create('Ext.Action', {
        xtype: 'button',
        iconCls: 'af-plus-circle',
        text: '제품 등록',
        tooltip: '제품코드등록',
        disabled: false,
        handler: function () {
          gm.me().addProps();
        }
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




      buttonToolbar.insert(1, this.addPropsButton);
     
      buttonToolbar.insert(2, this.deletePropsButton);

      this.callParent(arguments);

      // Row 클릭시 수정 및 삭제 버튼 활성화
      this.setGridOnCallback(function (selections) {
        console_logs('>>>>callback', selections);
        if (selections != null && selections.length > 0) {

          this.deletePropsButton.enable();
        } else {
  
          this.deletePropsButton.disable();
        }
      });

      //옵션펙터 그리드 스토어
      this.generaOptionFactorStore = Ext.create('Rfx.store.OptionFactorStore', {});

      //디폴트 로드
      gMain.setCenterLoading(false);
      //this.store.load(function (records) { });
      this.loadStoreAlways = true;

      
    },
    items: [],

    




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


      // this.test = [{
      //   fieldLabel: this.getFieldName('Actuator Size'),
      //   xtype: 'combo',

      //   allowBlank: true,
      //   id: gu.id('actucator_size'),
      //   name: 'actucator_size',

      //   fieldStyle: 'background-image: none;',
      //   store: this.actingSizeStore = Ext.create('Rfx.store.SeriesStore'),
      //   queryMode: 'remote',
      //   displayField: 'unique_id',
      //   valueField: 'unique_id',
      //   editable: false,
      //   typeAhead: false,
      //   minChars: 1,
      //   allowBlank: false,
      //   listConfig: {
      //     loadingText: 'Searching...',
      //     emptyText: 'No matching posts found.',
      //     getInnerTpl: function () {
      //       return '<div data-qtip="{unique_id}">{unique_id}</div>';
      //     }
      //   },
      //   listeners: {

      //     afterrender: function (combo, record) {
      //       gm.me().actingSizeStore.getProxy().setExtraParams({
      //         option_code: '200'
      //       });
      //     },
      //     select: function (combo, record) {
      //       gm.me().selectSeries();

      //     },

      //   },


      //   // pageSize: 25,
      //   triggerAction: 'all',
      //   width: '48%',

      // }];


      this.actingSizeStore = Ext.create('Rfx.store.SeriesStore');
      this.OptionStore = Ext.create('Rfx.store.SeriesOptionStore');

      this.test2 = [];

      this.test3 = [];

      // this.actingSizeStore.load({
      //   callback: function (records, operation, success) {
      //     // console.log(spccolumns); //root프로퍼티에 지정된데이터
      //     // 로드 성공시 메서드 호출
      //     if (success) {
      //       records.forEach(element => {
      //         gm.me().test2.push({
      //           xtype: 'button',
      //           text: element.get('series_name'),
      //           value: element.get('unique_id'),
      //           width: '24%',
      //           scale: 'medium',
      //           margin: '4 4 2 2',
      //           handler: function (btn) {
      //             //옵션스토어불러와 콤보박스 데이터 필드셋에입력
      //             gm.me().OptionStore.load({
      //               params: {
      //                 unique_id: element.get('unique_id')
      //               },
      //               callback: function (records, operation, success) {

      //                 if (success) {
      //                   records.forEach(element => {
      //                     var oname = element.get('oname');
      //                     oname.replace(' ', '_');

      //                     this.callStore = Ext.create('Rfx.store.OptionFactorStore');
      //                     this.callStore.getProxy().setExtraParams({
      //                       option_code: element.get('unique_id')
      //                     });

      //                   optionCard.add({items :
      //                     {
      //                       fieldLabel: element.get('oname'),
      //                       width: '90%',
      //                       xtype: 'combo',
      //                       allowBlank: true,
      //                       id: element.get(oname),
      //                       name: element.get('oname'),
      //                       anchor: '100%',
      //                       fieldStyle: 'background-image: none;',
      //                       store: this.callStore,
      //                       queryMode: 'remote',
      //                       displayField: 'ocode',
      //                       valueField: 'ocode',
      //                       editable: false,
      //                       typeAhead: false,
      //                       minChars: 1,
      //                       allowBlank: false,
      //                       margin: '10 10 10 10',
      //                       listConfig: {
      //                         loadingText: '검색중...',
      //                         emptyText: '등록된 코드가 없습니다.',
      //                         getInnerTpl: function () {
      //                           return '<div data-qtip="{oname}">{ocode}</div>';
      //                         }
      //                       },
      //                       listeners: {



      //                       },
      //                       // pageSize: 25,
      //                       //triggerAction: 'all',
      //                       // width: '50%'

      //                     }}
      //                   );
      //                 });
      //                 //옵션 카드에 데이터 추가
      //               //({ items: gm.me().test3 });
      //                 }
      //               }
      //             });

      //             gm.me().showNext();
      //           },
      //         });
      //       });
      //       // panelHeader.add({ items: gm.me().test2 });
      //     }
      //   }
      // });

      gm.me().OptionStore.load({
        params: {
          unique_id: element.get('unique_id')
        },
        callback: function (records, operation, success) {

          if (success) {
            records.forEach(element => {
              var oname = element.get('oname');
              oname.replace(' ', '_');

              this.callStore = Ext.create('Rfx.store.OptionFactorStore');
              this.callStore.getProxy().setExtraParams({
                option_code: element.get('unique_id')
              });

            optionCard.add({items :
              {
                fieldLabel: element.get('oname'),
                width: '90%',
                xtype: 'combo',
                allowBlank: true,
                id: element.get(oname),
                name: element.get('oname'),
                anchor: '100%',
                fieldStyle: 'background-image: none;',
                store: this.callStore,
                queryMode: 'remote',
                displayField: 'ocode',
                valueField: 'ocode',
                editable: false,
                typeAhead: false,
                minChars: 1,
                allowBlank: false,
                margin: '10 10 10 10',
                listConfig: {
                  loadingText: '검색중...',
                  emptyText: '등록된 코드가 없습니다.',
                  getInnerTpl: function () {
                    return '<div data-qtip="{oname}">{ocode}</div>';
                  }
                },
                listeners: {



                },
                // pageSize: 25,
                //triggerAction: 'all',
                // width: '50%'

              }}
            );
          });
          //옵션 카드에 데이터 추가
        //({ items: gm.me().test3 });
          }
        }
      });


      //옵션 카드
      var optionCard = Ext.create('Ext.form.Panel', {
        title: '옵션선택',
        id: gu.id('card-2'),
        width: '100%',
        overflowY: 'scroll',
        style: 'padding:10px',
        //height: 350,
        layout: 'column',
        // flex: 1,

        defaults: {
          flex: 1,
          layout: 'column',
          columnWidth: 0.5,
          width: '100%',
          //margin: '2 2 2 2',
         // layout: 'fit',
         // width: '100%'
        },
         bbar: ['->',
          {
            itemId: 'card-submit',
            text: '전송',
            handler: function (btn) {


              var val = optionCard.getValues(false);

              //폼데이터의 입력정보로 규격 등록
              var full = '';
              var specType = '';
              for (var name in val) {
                full += val[name];
                specType += val[name] + '_'
              }

              console_logs("끝", full);


              //중복체크
              Ext.Ajax.request({
                url: CONTEXT_PATH + '/admin/Series.do?method=checkSpec',
                params: {
                  specification: full
                },
                success: function (result, request) {
                  var resultText = result.responseText;

                  console_logs("중복 체크 테스트", resultText);
                  if (resultText == '0') {
                    if (optionCard.isValid()) {

                      prWin.setLoading(true);

                      Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=createNew',
                        params: {
                          parent_uid: -1,
                          parent: -1,
                          ac_uid: -1,
                          pl_no: '---',
                          bm_quan: 1,
                          item_name: val['item_name'],
                          comment: specType,
                          specification: full,
                          standard_flag: 'A',
                          pj_code: '',
                          child: -1,
                          sg_code: 'T',
                          class_code: 'RPD',
                          series_uid : series_uid

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
                  }
                },
                failure: extjsUtil.failureMessage
              });
            },
            disabled: true
          },
        ],


      });



      // var panelHeader = Ext.create('Ext.form.FieldSet', {
      //   xtype: 'fieldset',
      //   title: '시리즈선택',
      //   id: gu.id('card-1'),
      //   width: '100%',

      //   style: 'padding:10px',
      //   height: '100%',
      //   flex: 1,
        
      //   defaults: {
      //     margin: '2 2 2 2',
      //     layout: 'column',
      //   },

      // });


      this.form = Ext.create('Ext.form.Panel', {
        id: gu.id('addPropsPanel'),
        xtype: 'layout-Card',
        frame: false,
        border: false,
        width: '100%',
        height: '100%',
        defaultListenerScope: true,
        bodyPadding: '3 3 0',

        layout: 'card',
        activeItem: 0,
        // bbar: ['->',
        //   {
        //     itemId: 'card-prev',
        //     text: '이전',
        //     handler: function (btn) {
        //       optionCard.removeAll()
        //       gm.me().test3 = [];

        //       //optionCard.removeInner('items');

        //       gm.me().showPrevious();
        //     },
        //     disabled: true
        //   },
        // ],
        fieldDefaults: {
          labelAlign: 'right',
          msgTarget: 'side',
        },
        items: [

          //panelHeader,
          optionCard,



        ],



      });



      // var myWidth = 310;
      var myWidth = 1000;
      var myHeight = 350;

      prWin = Ext.create('Ext.Window', {
        xtype  : 'panel',
        //layout: 'border',
         region : 'center',
        modal: true,
        title: '제품코드등록',
        width: myWidth,

        items: this.form,
        listeners : {
          resize : function(){
            prWin.center();
        }
        
      },
      buttons: [{
        text: CMD_OK,
        handler: function(btn) {
            if(btn == "no") {
                prWin.close();
            } else {
                if(form.isValid()) {
                    var val = form.getValues(false);
                    var val2 = form_docu.getValues(false);

                    form.submit({
                        url: CONTEXT_PATH + '/admin/board.do?method=createBoardDocu',
                        params: val2,
                        success: function(result, response) {
                            console_logs('result', result);
                            console_logs('response', response);
                            prWin.close();
                            gm.me().store.load();
                        },
                        failure: extjsUtil.failureMessage
                    })
                }
            }
        }
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



    //제품수정 //Action function
    modifyPrdProps: function () {
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
        flex: 1,
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
            flex: 1,
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
                xtype: 'combo',
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
                value: type2[0] + '_' + type2[1],
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
                      class_code: 'RAP'
                    });
                  }
                },


                pageSize: 25,
                triggerAction: 'all',
                width: '48%',

              },




              {

                fieldLabel: this.getFieldName('Indication Box'),
                xtype: 'combo',
                anchor: '10%',
                allowBlank: true,
                id: gu.id('indication_box'),
                name: 'indication_box',

                fieldStyle: 'background-image: none;',
                store: this.indicationBox = Ext.create('Rfx.store.OptionFactorStore'),

                queryMode: 'remote',
                displayField: 'ocode',
                valueField: 'ocode',
                editable: false,
                typeAhead: false,
                minChars: 1,
                value: type[1],
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
                      option_code: '1300'
                    });
                  }
                },


                pageSize: 25,
                triggerAction: 'all',
                width: '48%',

              },
              {

                fieldLabel: this.getFieldName('Control Block'),
                xtype: 'combo',
                anchor: '10%',
                allowBlank: true,
                id: gu.id('control_block'),
                name: 'control_block',

                fieldStyle: 'background-image: none;',
                store: this.controlBlock = Ext.create('Rfx.store.OptionFactorStore'),

                queryMode: 'remote',
                displayField: 'ocode',
                valueField: 'ocode',
                editable: false,
                typeAhead: false,
                minChars: 1,
                value: type[0],
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
                      option_code: '1200'
                    });
                  }
                },


                pageSize: 25,
                triggerAction: 'all',
                width: '48%',

              },
              {

                fieldLabel: this.getFieldName('Inter. Flange'),
                xtype: 'combo',
                anchor: '10%',
                allowBlank: true,
                id: gu.id('inter_flange'),
                name: 'inter_flange',

                fieldStyle: 'background-image: none;',
                store: this.interFlange = Ext.create('Rfx.store.OptionFactorStore'),
                queryMode: 'remote',
                displayField: 'ocode',
                valueField: 'ocode',
                editable: false,
                typeAhead: false,
                minChars: 1,
                value: type[2],
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
                      option_code: '1400'
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
      var myWidth = 700;
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

            var full = val['specification'] + '_' + val['control_block'] + val['indication_box'] + val['inter_flange'];

            var specType = val['control_block'] + '_' + val['indication_box'] + '_' + val['inter_flange']


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



                      prWin.setLoading(true);

                      Ext.Ajax.request({
                        url: CONTEXT_PATH + '/design/bom.do?method=update',
                        params: {
                          id: val['unique_id'],
                          item_name: val['item_name'],
                          specification: full,
                          comment: specType,
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


    //시리즈 선택시 데이터 콤보 변경
    selectSeries: function () {
      this.test.push({
        fieldLabel: this.getFieldName('Actuator Size1'),
        xtype: 'combo',

        allowBlank: true,
        id: gu.id('actucator_size1'),
        name: 'actucator_size1',

        fieldStyle: 'background-image: none;',
        store: this.actingSizeStore = Ext.create('Rfx.store.SeriesStore'),
        queryMode: 'remote',
        displayField: 'unique_id',
        valueField: 'unique_id',
        editable: false,
        typeAhead: false,
        minChars: 1,
        allowBlank: false,
        listConfig: {
          loadingText: 'Searching...',
          emptyText: 'No matching posts found.',
          getInnerTpl: function () {
            return '<div data-qtip="{unique_id}">{unique_id}</div>';
          }
        },
        listeners: {

          afterrender: function (combo, record) {
            gm.me().actingSizeStore.getProxy().setExtraParams({
              option_code: '200'
            });
          }

        },


        // pageSize: 25,
        triggerAction: 'all',
        width: '48%',

      }
      );
      this.prWin.show();
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
                'item_code': itemCode
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


    showNext: function () {
      this.doCardNavigation(0);
    },

    showPrevious: function (btn) {
      this.doCardNavigation(-2);
    },

    doCardNavigation: function (incr) {
      var me = gm.me().form,
        l = me.getLayout(),
        i = l.activeItem.id.split('card-')[1],
        next = parseInt(i, 10) + incr;
      console_logs(i);
      console_logs(next);
      l.setActiveItem(next);

      me.down('#card-prev').setDisabled(next === 0);
      me.down('#card-submit').setDisabled(next === 2);
      //me.down('#card-next').setDisabled(next === 2);
    }



  });


