// 최종검사 결과
Ext.define('Rfx2.view.qualManage.DeliveryInspectionRSView', {
  extend: 'Rfx2.base.BaseView',
  xtype: 'delivery-inspection-result-view',
  initComponent: function () {

    //검색툴바 필드 초기화
    this.initSearchField();
    //검색툴바 추가
    // this.addSearchField('item_type');
    this.addSearchField('po_no');
    // this.addSearchField('item_code');
    this.addSearchField('item_name');

    // var sDateYear = 0;
    // var sDateMonth = 0;

    // if (new Date().getMonth() < 12) {
    //   sDateYear = new Date().getFullYear() - 1;
    //   sDateMonth = new Date().getMonth() + 1;
    // } else {
    //   sDateYear = new Date().getFullYear();
    //   sDateMonth = 0;
    // }

    // var sDateDay = new Date(sDateYear, sDateMonth + 1, 1).getDate();

    // var sDate = new Date(new Date(sDateYear, sDateMonth, sDateDay));
    // // var eDate = Ext.Date.add(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay()));
    // var eDate = new Date();

    // this.addSearchField({
    //   type: 'dateRange',
    //   field_id: 'monthYear',
    //   // text: this.getMC('mes_sro5_pln_sbar_period', '기간'),
    //   text: '검사일',
    //   sdate: sDate,
    //   edate: eDate,
    // });
    this.addSearchField({
      type: 'dateRange',
      field_id: 'search_date',
      text: "생산일",
      sdate: Ext.Date.add(new Date(), Ext.Date.YEAR, -1),
      edate: new Date()
    });

    //검색툴바 생성
    var searchToolbar = this.createSearchToolbar();

    // 툴바 버튼 옵션 설정
    // {key: 'SEARCH', text: CMD_SEARCH/*'검색'*/},
    // {key: 'REGIST', text: CMD_REGIST/*'신규등록'*/},
    // {key: 'EDIT', 	text: CMD_MODIFY/*'수정'*/},
    // {key: 'COPY', 	text: CMD_COPY_CREATE/*'복사등록'*/},
    // {key: 'REMOVE', text: CMD_DELETE/*'삭제'*/},
    // {key: 'VIEW', 	text: CMD_VIEW},
    // {key: 'INITIAL', 	text: '비밀번호 초기화'},
    // {key: 'UTYPE', text: '권한 설정'},
    // {key: 'EXCEL', 	text: 'Excel'},
    var removeButtons = ['REGIST', 'EDIT', 'COPY', 'REMOVE'];
    // var renameButtons = [{'REGIST': '코드등록'}];
    var toolbarOptions = { 'REMOVE_BUTTONS': removeButtons };

    //명령툴바 생성
    var buttonToolbar = this.createCommandToolbar(toolbarOptions);


    // mabuffer / spccolumn 조인 해야?

    //모델을 통한 스토어 생성
    this.createStore('Rfx2.model.company.bioprotech.DeliveryInspection', [{
      property: 'create_date',
      direction: 'ASC'
    }],
      /*pageSize*/
      gm.pageSize
      , {
        // process_type_kr: 'spcchart.process_type',
        // measuring_type_kr: 'measuring_type',
        // item_type_kr: 'item_type'
      }
      , ['']
    );

    this.uploadFileAction = Ext.create('Ext.Action', {
      iconCls: 'af-upload-white',
      disabled: true,
      text: '파일업로드',
      tooltip: this.getMC('성적서 등 필요문서를 업로드 합니다.'),
      hidden: gu.setCustomBtnHiddenProp('uploadFileAction'),
      handler: function () {
        var gridContent = Ext.create('Ext.panel.Panel', {
          cls: 'rfx-panel',
          id: gu.id('gridContent2'),
          collapsible: false,
          region: 'east',
          multiSelect: false,
          //autoScroll: true,
          autoHeight: true,
          frame: false,
          layout: 'vbox',
          forceFit: true,
          flex: 1,
          items: [gm.me().createMsTab('SIZE', 'SI')]
        });
        var prWin = Ext.create('Ext.Window', {
          modal: true,
          title: gm.me().getMC('CMD_FILE_UPLOAD','파일 업로드'),
          id: gu.id('uploadPrWin'),
          width: 500,
          height: 500,
          items: {
            collapsible: false,
            frame: false,
            region: 'center',
            layout: {
              type: 'vbox',
              align: 'stretch'
            },
            margin: '0 0 5 0',
            flex: 1,
            items: [gridContent]
          }
        });

        prWin.show();
      }
    });

    this.downloadFileAction = Ext.create('Ext.Action', {
      iconCls: 'af-download',
      itemId: 'fileattachAction',
      disabled: true,
      hidden: gu.setCustomBtnHiddenProp('downloadFileAction'),
      text: this.getMC('mes_order_file_btn', '파일다운로드'),
      handler: function (widget, event) {
        gm.me().attachFile();
      }
    });

    buttonToolbar.insert(1, this.uploadFileAction);
    buttonToolbar.insert(2, this.downloadFileAction);

    // 서브그리드 스토어

    // 서브그리드 버튼
    this.showChartBtn = Ext.create('Ext.Action', {
      xtype: 'button',
      iconCls: 'af-search',
      text: '관리도 보기',
      tooltip: '관리도 보기',
      disabled: true,
      handler: function () {
        // Ext.MessageBox.show({
        //     title: '하위 코드 삭제',
        //     msg: '선택한 코드 정보를 삭제하시겠습니까?',
        //     buttons: Ext.MessageBox.YESNO,
        //     fn: function(btn) {
        //         if(btn=='yes') {

        //             var selectionFromChild = gm.me().gridGeneralCodeChilds.getSelectionModel().getSelection()[0];

        //             Ext.Ajax.request({
        //                 url: CONTEXT_PATH + '/gencode.do?method=destroy',
        //                 params:{
        //                     unique_id: selectionFromChild.get('unique_id_long')
        //                 },
        //                 success : function(result, request) {
        //                     var resultText = result.responseText;
        //                     console_log('result:' + resultText);
        //                     gm.me().store.load();
        //                     gm.me().gridGeneralCodeChilds.load();
        //                 },
        //                 failure : extjsUtil.failureMessage
        //             });

        //         }
        //     },
        //     icon: Ext.MessageBox.QUESTION
        // });
      }
    });

    // subgrid 등록 버튼
    this.addResultBtn = Ext.create('Ext.Action', {
      xtype: 'button',
      iconCls: 'af-save',
      text: '저장',
      tooltip: this.getMC('msg_btn_prd_add', '출하검사결과 저장'),
      // 비활성화
      disabled: true,
      // disabled: false,
      handler: function () {
        Ext.MessageBox.show({
          title: '저장',
          msg: '저장하시겠습니까?',
          buttons: Ext.MessageBox.YESNO,
          fn: function (btn) {
            if (btn == 'yes') {
              var selections = gm.me().grid.getSelectionModel().getSelection();
              var rec = selections[0];
              // var target_uid = rec.get('assymap_uid');
              var target_uid = rec.get('unique_id_long');
              var objs = [];
              var columns = [];
              var obj = {};
              var store = gridDetail.getStore();
              var cnt = store.getCount();
              // console_logs('cnt', cnt);
              for (var i = 0; i < cnt; i++) {
                var record = store.getAt(i);
                // console.log('저장', record.data);
                var objv = {};
                // objv['unique_id'] = record.get('unique_id_long');
                // objv['target_uid'] = record.get('target_uid');
                // objv['sample_val'] = record.get('v000');
                // objv['measure_val'] = record.get('v001');
                // columns.push(objv);

                // objv['row' + (i+1)] = {'isPass' : record.data.isPass};
                objv['row' + (i + 1)] = { 'isPass': record.get(spccolumn_uid_result) };
                // columns.push(objv);
                objs.push(objv);
              }
              obj['result'] = { 'isPass': gu.getCmp('inspectionRS').value };
              objs.push(obj);
              // obj['datas'] = columns;
              // objs.push(obj);

              var jsonData = Ext.util.JSON.encode(objs);

              Ext.Ajax.request({
                url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=createImportInspection',
                params: {
                  // 수입검사 : 'I',
                  type: 'D',
                  target_uid: target_uid,
                  jsonData: jsonData
                },
                success: function (result, request) {
                  var resultText = result.responseText;
                  // console_log('result:' + resultText);
                  gm.me().store.load();
                  // gm.me().inspectionListStore.load();
                  inspectionResultStore.load();
                },
                failure: extjsUtil.failureMessage
              });

              console.log('저장!!!!!:', jsonData);

            }
          },
          icon: Ext.MessageBox.QUESTION
        });
      }
    });

    // 서브 그리드 위 헤더 패널
    // var panelHeader = Ext.create('Ext.panel.Panel', {
    var panelHeader = {
      // title: '상세정보',
      flex: 0.1,
      // xtype: 'fieldset',
      layout: {
        type: 'hbox',
        // padding: 10
      },
      defaults: {
        anchor: '100%',
        labelWidth: '50%',
        labelAlign: 'right',
        // margin: 10,
        padding: 10,
        fieldStyle: 'background-color: #EAEAEA;',
        // readOnly: true,
      },
      items: [

        {
          fieldLabel: '출하검사결과',
          // value: rec.item_name,
          // flex: 1,
          id: gu.id('inspectionRS'),
          width: '50%',
          xtype: 'combo',
          name: 'isPass',
          displayField: 'isOK',
          valueField: 'value',
          fields: ['isOK', 'value'],
          triggerAction: 'all',
          emptyText: 'OK/NG',
          queryMode: 'local',
          store: {
            data: [
              { 'isOK': "OK", "value": "OK" },
              { 'isOK': "NG", "value": "NG" },
            ]
          },
          listConfig: {
            loadingText: '검색중...',
            emptyText: '일치하는 항목 없음.',
            getInnerTpl: function () {
              return '<div data-qtip="{isOK}">{isOK}</div>';
            }
          }
        },
        // {
        //   xtype: 'button',
        //   text: '버튼'
        // }
      ]
    };

    // 서브그리드
    // var gridDetail = Ext.create('Ext.grid.Panel', {});
    var gridDetail = Ext.create('Ext.grid.Panel', {
      // cls: 'rfx-panel',
      id: gu.id('gridDetail'),
      store: null,
      viewConfig: {
        markDirty: false
      },
      collapsible: false,
      multiSelect: false,
      region: 'center',
      autoScroll: true,
      autoHeight: true,
      flex: 0.5,
      frame: true,
      bbar: getPageToolbar(inspectionResultStore),
      border: true,
      layout: 'fit',
      forceFit: false,
      plugins: [
        {
          ptype: 'cellediting',
          clicksToEdit: 1,
        },
      ],
      // selModel: Ext.create("Ext.selection.CheckboxModel", {}),
      margin: '0 0 0 0',
      dockedItems: [
        // BaseView 기본 툴바
        // this.createCommandToolbar(toolbarOptions),
        {
          dock: 'top',
          xtype: 'toolbar',
          items: [
            // this.showChartBtn,
            // this.addResultBtn
          ]
        },
        {
          dock: 'top',
          // xtype: 'toolbar',
          items: [
            // panelHeader,
          ]
        }
      ],
      columns: gridColumns,
      title: '항목별 검사 결과',
      name: 'po',
      autoScroll: true
    });


    // 기존 검사결과 조회할 스토어
    var inspectionResultStore = Ext.create('Rfx2.store.company.bioprotech.InspectionResultStore', { autoLoad: false });

    // 검사항목 스토어
    var spccolumnStore = Ext.create('Mplm.store.SpcColumnByItemCode', { autoLoad: false });

    // 그리드에 표시할 컬럼 목록 담을 변수 생성
    var gridColumns = [];

    // 그리드 선택시 콜백
    this.setGridOnCallback(function (selections) {

      if (selections.length) {
        // 오른쪽 그리드 버튼 활성화
        // this.addResultBtn.enable();
        // 로트 종합 결과 오른쪽 그리드에 표시
        // var inspectionRS = selections[0].get('v028');
        // gu.getCmp('inspectionRS').setValue(inspectionRS);

        // 기존 검사 결과 조회
        var rec = selections[0].data;

        // var target_uid = rec.assymap_uid;
        var target_uid = rec.unique_id_long;
        inspectionResultStore.getProxy().setExtraParams(
          {
            target_uid: target_uid,
            type: 'D',
          }
        );
        inspectionResultStore.load();

        // 매핑된 검사항목 조회
        spccolumnStore.item_code = rec.item_code;
        spccolumnStore.process_type = 3;
        // console.log('================', target_uid, '================', rec.item_code);
        spccolumnStore.load({
          // 콜백 지옥...?
          callback: function (records, operation, success) {
            // console.log(spccolumns); //root프로퍼티에 지정된데이터
            // 로드 성공시 메서드 호출
            if (success) {
              recreateGrid(records);

              // 매핑한 컬럼, 로드한 검사결과 서브그리드에 적용
              gridDetail.reconfigure(inspectionResultStore, gridColumns);
            }
          }
        });
        this.uploadFileAction.enable();
        this.downloadFileAction.enable();
      } else {
        this.addResultBtn.disable();
        this.uploadFileAction.disable();
        this.downloadFileAction.disable();
      }

      // var rec = gm.me().grid.getSelectionModel().getSelection()[0].data;


      // var options = gm.me().setChartOptions(selections);

      // // 차트 새로 그리기
      // gm.me().drawChart(chartPanel1.getId(), options[0]);
      // gm.me().drawChart(chartPanel2.getId(), options[1]);
    })


    // 기존 result 가 없을경우 isPass 로 대체, 저장시 활용위해 전역변수로
    var spccolumn_uid_result = 'isPass';

    // 검사항목 스토어 로드시 콜백 메서드
    function recreateGrid(spccolumns) {
      gridColumns = [];
      // 샘플번호 표시할 컬럼 추가
      // gridColumns.push({
      //   text: 'SAMPLE_NO',
      //   width: 70,
      //   style: 'text-align:center',
      //   align: 'left',
      //   // tpl: inspectionResultStore.indexOf(this),
      //   // data: '1',
      //   name: 'inspection_date_grid'
      // });
      gridColumns.push({
        xtype: 'rownumberer'
      })

      var isThereResult = false;
      // 매핑된 검사항목들 컬럼목록에 추가
      for (let index = 0; index < spccolumns.length; index++) {
        const el = spccolumns[index];
        var measuring_type = el.get('measuring_type');
        var columnName = el.get('legend_code_kr');
        var spccolumn_uid = el.get('unique_id');

        // index를 문자열로 활용하기 위해 자리수 맞추기
        // var indexSample = index + '';
        // while (indexSample.length < 2) {
        //     indexSample = '0' + indexSample;
        // }
        // indexSample =  indexSample.length == 2 ? indexSample : '0' + indexSample;

        // 수치측정인 경우
        if (measuring_type === '2') {
          gridColumns.push({
            text: columnName,
            // dataIndex: 'v0' + indexSample,
            name: spccolumn_uid,
            width: 100,
            align: 'center',
            style: 'text-align:center',
            dataIndex: spccolumn_uid,
          });
        }
        // OK/NG인 경우
        else if (measuring_type === '1' && columnName != '결과') {
          gridColumns.push(
            {
              text: columnName,
              dataIndex: spccolumn_uid,
              width: 100,
              align: 'center',
              style: 'text-align:center',
            }
          );
        }
        else if (measuring_type === '1' && columnName == '결과') {
          spccolumn_uid_result = spccolumn_uid;
          isThereResult = true;
        }
      }

      // 항상 표시할 컬럼 추가
      gridColumns.push({
        text: '샘플별결과',
        width: 100,
        align: 'left',
        style: 'text-align:center',
        dataIndex: spccolumn_uid_result,
        name: 'isPass',
        align: 'center',
        style: 'text-align:center',
        editor: {
          xtype: 'combo',
          name: 'isPass',
          displayField: 'isOK',
          valueField: 'value',
          fields: ['isOK', 'value'],
          triggerAction: 'all',
          emptyText: 'OK/NG',
          queryMode: 'local',
          store: {
            data: [
              { 'isOK': "OK", "value": "OK" },
              { 'isOK': "NG", "value": "NG" },
            ]
          },
          listConfig: {
            loadingText: '검색중...',
            emptyText: '일치하는 항목 없음.',
            getInnerTpl: function () {
              return '<div data-qtip="{isOK}">{isOK}</div>';
            }
          },
          editable: true
        }
      });

      gridColumns.push({
        text: '검사일',
        width: 130,
        style: 'text-align:center',
        align: 'left',
        dataIndex: 'inspection_date',
        name: 'inspection_date_grid'
      });

      gridColumns.push({
        text: '검사원',
        width: 120,
        align: 'left',
        style: 'text-align:center',
        dataIndex: 'worker',
        name: 'worker_grid'
      });


      // gridColumns.push({ 
      //     text: 'uid_for_modify', 
      //     width: 120, 
      //     align: 'left', 
      //     style: 'text-align:center', 
      //     dataIndex: 'unique_id_long',
      //     // 숨김
      //     hidden: true,
      // });

    };// end of callback fn

    gridDetail.getSelectionModel().on({
      selectionchange: function (sm, selections) {
        if (selections) {
          console_logs('----------selection : ', selections[0]);
          console_logs('----------selection : ', inspectionResultStore.indexOf(selections[0]));


        }
      }
    });

    //그리드 생성
    var arr = [];
    arr.push(buttonToolbar);
    arr.push(searchToolbar);
    this.createGrid(arr);

    // var mainColumns = this.grid.getColumns();

    // mainColumns.push({
    //   text: 'OK/NG',
    //   width: 100,
    //   align: 'left',
    //   style: 'text-align:center',
    //   dataIndex: 'item_name',
    //   name: 'isPass',
    //   align: 'center',
    //   style: 'text-align:center',
    //   editor: {
    //     xtype: 'combo',
    //     name: 'isPass',
    //     displayField: 'isOK',
    //     valueField: 'value',
    //     fields: ['isOK', 'value'],
    //     triggerAction: 'all',
    //     emptyText: 'OK/NG',
    //     queryMode: 'local',
    //     store: {
    //       data: [
    //         { 'isOK': "OK", "value": "OK" },
    //         { 'isOK': "NG", "value": "NG" },
    //       ]
    //     },
    //     listConfig: {
    //       loadingText: '검색중...',
    //       emptyText: '일치하는 항목 없음.',
    //       getInnerTpl: function () {
    //         return '<div data-qtip="{isOK}">{isOK}</div>';
    //       }
    //     },
    //     editable: true
    //   }
    // });
    // this.grid.reconfigure(this.store, mainColumns);
    // this.grid.setColumns(mainColumns);

    //입력/상세 창 생성.
    this.createCrudTab();

    // 차트에 표시할 데이터 불러오는 스토어(테스트)
    // var chart1store = Ext.create('Ext.data.Store', {
    //   proxy: {
    //     type: 'ajax',
    //     url: CONTEXT_PATH + '/quality/pcsQuality.do?method=read',
    //     reader: {
    //       type: 'json',
    //       root: 'datas',
    //       totalProperty: 'count',
    //       successProperty: 'success'
    //     },
    //     autoLoad: false
    //   },
    //   pageSize: 10000
    // });

    // chart panel 1
    var chartPanel1 = Ext.create('Ext.container.Container', {
      region: 'center',
      border: true,
      flex: 1,
    });

    // chart panel 2
    var chartPanel2 = Ext.create('Ext.panel.Panel', {
      region: 'east',
      flex: 1,
      border: true,
    });

    Ext.apply(this, {
      layout: 'border',
      items: [
        {
          collapsible: false,
          frame: false,
          region: 'west',
          layout: {
            type: 'hbox',
            pack: 'start',
            align: 'stretch'
          },
          margin: '5 0 0 0',
          width: '55%',
          items: [{
            region: 'west',
            layout: 'fit',
            margin: '0 0 0 0',
            width: '100%',
            items: [this.grid]
          }]
        },
        this.crudTab, gridDetail
      ]
    });

    this.callParent(arguments);

    //디폴트 로드
    gMain.setCenterLoading(false);
    

    
    this.store.on('beforeload', function(store, operation, eOpts) {
      var dateRangeId = gm.me().link + '-' + gMain.getSearchField('search_date');
      var sDateField = Ext.getCmp(dateRangeId + '-s');
      var eDateField = Ext.getCmp(dateRangeId + '-e');
      var sDate = Ext.Date.format(sDateField.getValue(), 'Y-m-d');
      var eDate = Ext.Date.format(eDateField.getValue(), 'Y-m-d');
      store.getProxy().setExtraParam('search_date', sDate + ':' + eDate);
      
      store.getProxy().setExtraParam('isResult', 'Y');
      store.getProxy().setExtraParam('isFinish', true);
      // store.getProxy().setExtraParams({
      //   'isResult': 'Y',
      //   isFinish: true,
      // });
    })
    this.store.load(function (records) { });

    // this.loadStoreAlways = true;

  }, // end of initcompo
  items: [],


  // 그리드에서 선택한 제품-항목 기준으로 차트에 표시할 데이터 저장
  setChartOptions: function (selections) {
    // 선택한 자재, 품목 + 검사항목에 대한 데이터 불러오기

    // 수입검사 data INSERT 때 spccolumn_uid -> J8_MABUFFER.target_uid 에 넣어야..?

    //  > 1. SPC 관리선 정보 가져오기 (From spcchart By spccolumn_uid)
    var rec = selections[0];
    var spccolumn_uid = rec.get('target_uid');
    // SpcChartLineStore.proxy.extraparams = {spccolumn_uid: spccolumn_uid};
    // SpcChartLineStore.load();

    var title1 = rec.get('item_name');
    title1 += ' | ';
    title1 += rec.get('legend_code_kr');

    var title2 = title1 + ' | R - Bar /// test-datas';

    title1 += ' | X - Bar /// test-datas';

    var ucl = rec.get('ucl') * 1;
    var lcl = rec.get('lcl') * 1;
    var air = ((ucl - lcl) * 0.1).toFixed(2) * 1;
    var max1 = (ucl + air).toFixed(2);
    var min1 = (lcl - air).toFixed(2);


    var yDatas1 = [];
    var xAxis = [];
    // /xdview/spcMgmt.do?method=readMabufferForSpc
    // Ext.Ajax.request({
    //   url: CONTEXT_PATH + '/xdview/spcMgmt.do?method=readMabufferForSpc',
    //   params: [],
    //   success: function(result, request) {
    //     result.array.forEach(el => {
    //       consol.log(el.get('v000'));
    //     });
    //   },
    //   failure: extjsUtil.failureMesssage
    // });
    //  > 2. 해당 자재.품목 + 검사항목 측정값 가져오기
    // var dataParams = {
    //   target_uid: spccolumn_uid,
    //   // minDate: minDate,
    //   // maxDate: maxDate
    // };
    // SpcChartDataStore.proxy.extraparams = dataParams;
    // SpcChartDataStore.load();



    yDatas1 = [3.275, 3.28, 3.282, 3.26, 3.27, 3.272, 3.272, 3.272];
    xAxis = ['06/01', '06/02', '06/03', '06/04', '06/05', '06/06', '06/07', '06/08'];
    var yDatas2 = [];
    yDatas1.forEach(el => {
      var data = (el - 3.270) * 2;
      if (data < 0) {
        data *= -1
      }
      yDatas2.push(data.toFixed(2));
    });

    var optionChart1 = {
      title: {
        text: title1,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      color: ['#0B0B61'],
      xAxis: {
        type: 'category',
        data: xAxis
      },
      yAxis: {
        type: 'value',
        scale: true,
        max: max1,
        min: min1,
      },
      series: [{
        data: yDatas1,
        type: 'line',
        label: {
          show: true,
          position: 'inside'
        },
        markLine: {
          data: [
            {
              yAxis: lcl, name: 'LCL'

            },
            {
              type: 'average', name: '평균',
            },
            {
              yAxis: ucl, name: 'UCL'
            }
          ],
          color: ['#0B0B61']
        }
      }],
    };

    var optionChart2 = {
      title: {
        text: title2,
      },
      // color: ['#0B0B61'],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: xAxis
      },
      yAxis: {
        type: 'value',
        scale: true,
        max: 0.10,
        min: 0.00
      },
      series: [{
        data: yDatas2,
        type: 'line',
        label: {
          show: true,
          position: 'inside'
        },
        markLine: {
          data: [
            {
              yAxis: 0,
            },
            {
              yAxis: 0.05
            }
          ],
          color: ['#0B0B61']
        }
      }],
    };

    return [optionChart1, optionChart2];
  },

  drawChart: function (divId, option) {
    console.log(`============== drawChart Func ==============`);

    // divId = '';
    var me = this;
    var main = document.getElementById(divId);
    if (main == null) {
      Ext.Msg.alert('load failded', divId + ' div를 찾을 수 없습니다.');
      return;
    } else {
      console.log('main', main);
    }

    var myChart = echarts.init(main);
    console.log('myChart', myChart);

    myChart.showLoading({
      text: '잠시만 기다려주세요.....',
    });

    var optionParam = option;

    var option = option;

    myChart.hideLoading();
    myChart.setOption(option);

    return myChart;

  },
  // 테스트용
  getJson: function (store) {
    store.load(function (record) {
      // console.log('json length : ', record.length);
      var i = 0;
      record.forEach(el => {
        if (el.get('defect_total_qty') > 0) {
          console.log('json data > defect_total_qty', i++, ' : ', el.get('defect_total_qty'));
        }
      });
    })
  },
  // 정렬 툴바 사용 여부
  useValueCopyCombo: false, //값복사 사용
  useDivisionCombo: false,  //사업부 콤보 시용
  selectedSortComboCount: 0, //정렬 콤보 갯수

  createMsTab: function (title, tabname) {
    var record = gm.me().grid.getSelectionModel().getSelection()[0];
    if (this.stores.length < 1) {
      this.stores.push(Ext.create('Ext.data.Store', {
        fields: ['name', 'size', 'file', 'status']
      }));
    }
    var sc = this.storecount/*++*/;
    var tabDataUpload = Ext.create('Ext.panel.Panel', {
      //title: title,
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

  postDocument: function (url, store, i, tabname) {

    var xhr = new XMLHttpRequest();
    xhr.timeout = 30000; // time in milliseconds
    var fd = new FormData();
    fd.append("serverTimeDiff", 0);
    xhr.open("POST", url, true);
    fd.append('index', i);
    fd.append('file', store.getData().getAt(i).data.file);
    fd.append('upload_type', /*gu.getCmp('measureType').lastValue.radio1*/'SALES_PLAN');
    //fd.append('product_type', 'BW');

    xhr.setRequestHeader("serverTimeDiff", 0);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        if (xhr.responseText.length > 1) {
          if (store.getData().getAt(i) !== undefined) {
            store.getData().getAt(i).data.status = gm.me().getMC('sro1_completeAction', '완료');
          }
          for (var j = 0; j < store.data.items.length; j++) {
            var record = store.getData().getAt(j);
            if ((record.data.status === gm.me().getMC('sro1_completeAction', '완료'))) {
              store.remove(record);
              j--;
            }
          }
        } else {
          store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
        }
        //store.getData().getAt(i).commit();
        var data = Ext.util.JSON.decode(xhr.responseText).datas;
      } else if (xhr.readyState == 4 && (xhr.status == 404 || xhr.status == 500)) {
        store.getData().getAt(i).data.status = gm.me().getMC('error_msg_prompt', '오류');
        store.getData().getAt(i).commit();
      } else {
        for (var j = 0; j < store.data.items.length; j++) {
          var record = store.getData().getAt(j);
          store.remove(record);
          j--;
        }
        if (store.data.items.length == 0 && gu.getCmp('uploadPrWin') != undefined) {
          gu.getCmp('uploadPrWin').close();
          gm.me().showToast(gm.me().getMC('mes_sro5_pln_header_reflection', '반영중'),
            gm.me().getMC('mes_sro5_pln_msg_reflection', '데이터를 반영 중입니다. 잠시 후 새로고침 하시기 바랍니다.'));
        }
      }
    };
    xhr.send(fd);
  },
  attachedFileStore: Ext.create('Mplm.store.AttachedFileStore', { group_code: null }),
  attachFile: function () {
    var record = gm.me().grid.getSelectionModel().getSelection()[0];
    this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('unique_id_long'));
    // this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('top_srcahd_uid'));
    this.attachedFileStore.load(function (records) {
      if (records != null) {
        var o = gu.getCmp('file_quan');
        if (o != null) {
          o.update('파일 수 : ' + records.length);
        }

      }
    });
    // var selFilegrid = Ext.create("Ext.selection.CheckboxModel", {});
    this.fileGrid = Ext.create('Ext.grid.Panel', {
      title: '첨부된 파일 리스트',
      store: this.attachedFileStore,
      collapsible: false,
      multiSelect: true,
      // hidden : ! this.useDocument,
      // selModel: selFilegrid,
      stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
      dockedItems: [{
        dock: 'top',
        xtype: 'toolbar',
        cls: 'my-x-toolbar-default2',
        items: [
          // {
          //     xtype: 'button',
          //     text: '파일업로드',
          //     scale: 'small',
          //     iconCls: 'af-upload-white',
          //     scope: this.fileGrid,
          //     handler: function () {
          //         console_logs('=====aaa', record);
          //         var url = CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('unique_id_long');
          //         var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
          //             uploader: 'Ext.ux.upload.uploader.FormDataUploader',
          //             uploaderOptions: {
          //                 url: url
          //             },
          //             synchronous: true
          //         });
          //         var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
          //             dialogTitle: '파일첨부',
          //             panel: uploadPanel
          //         });
          //         this.mon(uploadDialog, 'uploadcomplete', function (uploadPanel, manager, items, errorCount) {
          //             console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
          //             console_logs('this.mon uploadcomplete manager', manager);
          //             console_logs('this.mon uploadcomplete items', items);
          //             console_logs('this.mon uploadcomplete errorCount', errorCount);
          //             gm.me().uploadComplete(items);
          //             uploadDialog.close();
          //         }, this);
          //         uploadDialog.show();
          //     }
          // },
          {
            xtype: 'button',
            text: '파일삭제',
            scale: 'small',
            iconCls: 'af-remove',
            scope: this.fileGrid,
            handler: function () {
              console_logs('파일 UID ?????? ', gm.me().fileGrid.getSelectionModel().getSelected().items[0]);
              if (gm.me().fileGrid.getSelectionModel().getSelected().items[0] != null) {
                var unique_id = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('unique_id_long');
                var file_path = gm.me().fileGrid.getSelectionModel().getSelected().items[0].get('file_path');
                if (unique_id != null) {
                  Ext.Ajax.request({
                    url: CONTEXT_PATH + '/sales/delivery.do?method=deleteFile',
                    params: {
                      file_path: file_path,
                      unique_id: unique_id
                    },
                    success: function (result, request) {
                      Ext.MessageBox.alert('확인', '삭제 되었습니다.');
                      gm.me().attachedFileStore.load(function (records) {
                        if (records != null) {
                          var o = gu.getCmp('file_quan');
                          if (o != null) {
                            o.update('파일 수 : ' + records.length);
                          }
                        }
                      });
                    }
                  });
                }
              } else {
                Ext.MessageBox.alert('알림', '삭제할 파일이 선택되지 않았습니다.');
              }
            }
          },
          this.removeActionFile,
          '-',
          this.sendFileAction,
          '->',
          {
            xtype: 'component',
            id: gu.id('file_quan'),
            style: 'margin-right:5px;width:100px;text-align:right',
            html: '파일 수 : 0'
          },
        ]
      }

      ],
      columns: [
        {
          text: '파일 일련번호',
          width: 100,
          style: 'text-align:center',
          sortable: true,
          dataIndex: 'id'
        },
        {
          text: '파일명',
          style: 'text-align:center',
          flex: 0.7,
          sortable: true,
          dataIndex: 'object_name'
        },
        {
          text: '파일유형',
          style: 'text-align:center',
          width: 70,
          sortable: true,
          dataIndex: 'file_ext'
        },
        {
          text: '업로드 날짜',
          style: 'text-align:center',
          width: 160,
          sortable: true,
          dataIndex: 'create_date'
        },
        {
          text: 'size',
          width: 100,
          sortable: true,
          xtype: 'numbercolumn',
          format: '0,000',
          style: 'text-align:center',
          align: 'right',
          dataIndex: 'file_size'
        },
        {
          text: '등록자',
          style: 'text-align:center',
          width: 70,
          sortable: true,
          dataIndex: 'creator'
        },
      ]
    });

    var win = Ext.create('ModalWindow', {
      title: '첨부파일',
      width: 1300,
      height: 600,
      minWidth: 250,
      minHeight: 180,
      autoScroll: true,
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      xtype: 'container',
      plain: true,
      items: [
        this.fileGrid
      ],
      buttons: [{
        text: CMD_OK,
        handler: function () {
          if (win) {
            win.close();
          }
        }
      }, {
        text: CMD_CANCEL,
        handler: function () {
          if (win) {
            win.close();
          }
        }
      }]

    });
    win.show();
  },

  uploadComplete: function (items) {
    console_logs('uploadComplete items', items);
    var output = 'Uploaded files: <br>';
    Ext.Array.each(items, function (item) {
      output += item.getFilename() + ' (' + item.getType() + ', '
        + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
    });
    console_logs('파일업로드 결과', output);
    Ext.MessageBox.show({
      title: '파일업로드 완료',
      icon: Ext.MessageBox['INFO'],
      msg: '파일첨부가 완료되었습니다.',
      buttons: Ext.MessageBox.OK,
      width: 450
    });
    this.attachedFileStore.load(function (records) {
      if (records != null) {
        var o = gu.getCmp('file_quan');
        if (o != null) {
          o.update('파일 수 : ' + records.length);
        }
      }
    });
  },
  stores: [],
  ingredientList: [],
  storecount: 0,
  fields: []
}); // end of define
