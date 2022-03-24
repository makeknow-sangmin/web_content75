Ext.define("Rfx.view.criterionInfo.DefineCalendarView", {
  extend: "Rfx.base.BaseView",
  xtype: "define-calendar-view",
  initComponent: function () {
    this.initDefValue();

    //검색툴바 필드 초기화
    this.initSearchField();
    //검색툴바 추가
    this.addSearchField({
      // type: 'combo',
      field_id: "cal_id",
      emptyText: "캘린더 선택",
      store: "DefineCalendarsStore",
      displayField: "name",
      valueField: "unique_id",
      // ,value: 'unique_id'
      innerTpl: '<div data-qtip="{unique_id}">{name}</div>',
    });

    // this.addSearchField("present_year");
    this.addSearchField({
      type: 'dateRange',
      field_id: 'present_year',
      text: '날짜',
      sdate: new Date(),
      edate: Ext.Date.add(new Date(), Ext.Date.YEAR, +1)
    });
    
    //검색툴바 생성
    var searchToolbar = this.createSearchToolbar();
    //명령툴바 생성
    var buttonToolbar = this.createCommandToolbar2({
      REMOVE_BUTTONS: ["REMOVE", "COPY", "INITIAL", "UTYPE"],
    });

    //console_logs('this.fields', this.fields);

    this.createStore(
      "Rfx.model.DefineCalendar",
      [
        {
          property: "date_id",
          direction: "ASC",
          sorter: [
            {
              property: "date_id",
              direction: "ASC",
            },
          ],
        },
      ],
      500,
      // 10000/*pageSize*/
      {},
      ["defineCalendar"]
    );

    //        for(var i=0; i< this.columns.length; i++) {
    //        	var o = this.columns[i];
    //            	o['field'] = {
    //		    			xtype:  'textfield'
    //		            };
    //        }

    //        var option = {
    //        		plugins: [Ext.create('Ext.grid.plugin.CellEditing')]
    //        };
    this.createGrid(searchToolbar, buttonToolbar);

    //this.createGridCore([searchToolbar, buttonToolbar], option);
    this.createCrudTab();

    Ext.apply(this, {
      layout: "border",
      items: [this.grid, this.crudTab],
    });

    // this.addUserButton = Ext.create('Ext.Action', {
    //     xtype : 'button',
    //     iconCls: 'mfglabs-retweet_14_0_5395c4_none',
    //     text: '신규등록',
    //     tooltip: '신규등록',
    //     disabled: false,
    //     handler: function() {
    //         gm.me().addUserView();
    //     }
    // });

    this.modifyCalendarButton = Ext.create("Ext.Action", {
      xtype: "button",
      iconCls: "af-edit",
      text: "수정",
      tooltip: "캘린더 수정",
      disabled: true,
        hidden: gu.setCustomBtnHiddenProp('modifyCalendarButton'),
        handler: function () {
        gm.me().modifyDefineCalendar();
      },
    });

    buttonToolbar.items.each(function (item, index, length) {
      if (index == 1 || index == 2) {
        buttonToolbar.items.remove(item);
      }
    });

    // buttonToolbar.insert(1, this.addUserButton);
    buttonToolbar.insert(1, this.modifyCalendarButton);

    function getFormatDate(date, type, num) {
      if(date) {
        var nowDate = new Date();
        var prYear = nowDate.getFullYear();
        var prMonth = (1+nowDate.getMonth());
        prMonth = prMonth >= 10 ? prMonth : '0' + prMonth;
        var prDay = nowDate.getDate();
        prDay = prDay >= 10 ? prDay : '0' + prDay;
    
        if(type == 'year') {
          prYear += num;
        }else if(type == 'month') {
          prMonth += num;
        }else {
          prDay += num;
        }

        var prDate = `${prYear}-${prMonth}-${prDay}`;
      
        return prDate;
      }
    }

    this.callParent(arguments);
    this.store.getProxy().setExtraParam("delete_flag", "N");
    // this.store.getProxy().setExtraParam("present_year", new Date());
    this.store.getProxy().setExtraParam('present_year', `%${getFormatDate(new Date(),'year',0)}:${getFormatDate(new Date(),'year',1)}%`);
    this.store.getProxy().setExtraParam("cal_id", 10);

    console.log('##########################################');
    console.log(`%${getFormatDate(new Date(),'year',0)}:${getFormatDate(new Date(),'year',1)}%`);

    this.setGridOnCallback(function (selections) {
      console_logs(">>>>callback", selections);
      if (selections != null && selections.length > 0) {
        this.modifyCalendarButton.enable();
      } else {
        this.modifyCalendarButton.disable();
      }
    });

    //디폴트 로드
    gMain.setCenterLoading(false);
    this.store.load(function (records) {});
  },
  items: [],

  modifyDefineCalendar: function () {
    var rec = gm.me().grid.getSelectionModel().getSelection()[0];
    console_logs(">>>>> rec", rec);

    // Ext.MessageBox.alert('rec', rec['data']['date_id']);

    var form = Ext.create("Ext.form.Panel", {
      id: gu.id("formPanelModify"),
      xtype: "form",
      frame: false,
      border: false,
      width: "100%",
      height: "100%",
      bodyPadding: "3 3 0",
      region: "center",
      layout: "column",
      fieldDefaults: {
        labelAlign: "right",
        msgTarget: "side",
      },
      items: [
        {
          xtype: "fieldset",
          id: gu.id("modification"),
          title: "캘린더 수정",
          frame: true,
          width: "100%",
          height: "100%",
          layout: "fit",
          defaults: {
            margin: "2 2 2 2",
          },
          items: [
            new Ext.form.Hidden({
              name: "calendar_id",
              id: "calendar_id",
              value: rec.get("cal_id"),
            }),
            {
              fieldLabel: "캘린더 이름",
              xtype: "textfield",
              anchor: "100%",
              readOnly: true,
              fieldStyle: "background-color: #FBF8E6; background-image: none;",
              id: "cname",
              name: "cname",
              value: rec.get("cname"),
            },
            {
              fieldLabel: "날짜",
              xtype: "textfield",
              anchor: "100%",
              readOnly: true,
              fieldStyle: "background-color: #FBF8E6; background-image: none;",
              id: "date_id",
              name: "date_id",
              value: rec.get("date_id"),
            },
            {
              fieldLabel: "요일",
              xtype: "textfield",
              anchor: "100%",
              readOnly: true,
              fieldStyle: "background-color: #FBF8E6; background-image: none;",
              id: "weekday_string",
              name: "weekday_string",
              value: rec.get("weekday_string"),
            },
            {
              fieldLabel: "지정 근무시간",
              xtype: "textfield",
              anchor: "100%",
              readOnly: false,
              fieldStyle: "background-color: #FFFFFF; background-image: none;",
              id: "workhour",
              name: "workhour",
              value: rec.get("wh_workhour"),
            },
            //wh_workhour
            {
              fieldLabel: "비고",
              xtype: "textfield",
              anchor: "100%",
              readOnly: false,
              fieldStyle: "background-color: #FFFFFF; background-image: none;",
              id: "desc",
              name: "desc",
              value: rec.get("wh_desc"),
            },
          ],
        },
      ],
    });

    var myWidth = 310;
    var myHeight = 420;

    var prWin = Ext.create("Ext.Window", {
      modal: true,
      title: "수정",
      width: myWidth,
      height: myHeight,
      plain: true,
      items: form,
      buttons: [
        {
          text: CMD_OK,
          handler: function (btn) {
            if (btn == "no") {
              prWin.close();
            } else {
              if (form.isValid()) {
                var val = form.getValues(false);
                prWin.setLoading(true);

                Ext.Ajax.request({
                  url:
                    CONTEXT_PATH +
                    "/admin/defineCalendar.do?method=updateDefineCalendar",
                  params: val,
                  success: function (result, request) {
                    if (prWin) {
                      console.log(`prWin : ${prWin}`);
                      prWin.setLoading(false);
                      Ext.MessageBox.alert("알림", "등록처리 되었습니다.");
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

});
