/**
 * DefineCalendar  Store
 */
Ext.define("Mplm.store.DefineCalendarsStore", {
  extend: "Ext.data.Store",
  initComponent: function (params) {
    // !! here may be some calculations and params alteration !!
    Ext.apply(this, {
      unique_id: params.unique_id,
      name: params.name,
    });
    console.log('## store Init Complete ~ ');
  },
  fields: [
    { name: "unique_id", type: "string" },
    { name: "name", type: "string" },
  ],
  sorters: [
    // {
    //   property: "unique_id",
    //   direction: "DESC",
    // },
  ],
  hasNull: false,
  proxy: {
    type: "ajax",
    url: CONTEXT_PATH + "/admin/calendar.do?method=calendarListRead",
    reader: {
      type: "json",
      root: "datas",
      totalProperty: "count",
      successProperty: "success",
    },
    autoLoad: true,
  },
  listeners: {
    load: function (store, records, successful, operation, options) {
      console_logs(">>>>> Aaa asd", store);
    }, //endofload
    beforeload: function () {
      console.log(">>>>>>>>>>>>> qweqweqweqweqwe");
      // console_logs('>>>>>>>>> user beforeload', gUtil.getDeptCode);
      if (this.unique_id != null) {
        // this.getProxy().setExtraParam('dept_code', this.wh_code);
        this.getProxy().setExtraParam("unique_id", this.unique_id);
      }
      // if(this.dept_code_list!=null) {
      //     this.getProxy().setExtraParam('dept_code_list', this.dept_code_list);
      //     this.getProxy().setExtraParam('unique_id', this.unique_id);
      // }
    },
  }, //endoflistner
});
