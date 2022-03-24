console.clear();
Ext.application({
  name: 'Fiddle',

  launch: function() {

    var store = Ext.create('Ext.data.Store', {
      storeId: 'employeeStore',
      fields: ['name', 'seniority', 'department', 'isChecked'],
      groupField: 'department',
      data: [{
        "name": "Michael Scott",
        "seniority": 7,
        "department": "Management"
      }, {
        "name": "Dwight Schrute",
        "seniority": 2,
        "department": "Sales"
      }, {
        "name": "Jim Halpert",
        "seniority": 3,
        "department": "Sales"
      }, {
        "name": "Kevin Malone",
        "seniority": 4,
        "department": "Accounting"
      }, {
        "name": "Angela Martin",
        "seniority": 5,
        "department": "Accounting"
      }, {
        "name": "Michael Scott",
        "seniority": 7,
        "department": "Management"
      }, {
        "name": "Dwight Schrute",
        "seniority": 2,
        "department": "Sales"
      }, {
        "name": "Jim Halpert",
        "seniority": 3,
        "department": "Sales"
      }, {
        "name": "Kevin Malone",
        "seniority": 4,
        "department": "Accounting"
      }, {
        "name": "Angela Martin",
        "seniority": 5,
        "department": "Accounting"
      }, {
        "name": "Michael Scott",
        "seniority": 7,
        "department": "Management"
      }, {
        "name": "Dwight Schrute",
        "seniority": 2,
        "department": "Sales"
      }, {
        "name": "Jim Halpert",
        "seniority": 3,
        "department": "Sales"
      }, {
        "name": "Kevin Malone",
        "seniority": 4,
        "department": "Accounting"
      }, {
        "name": "Angela Martin",
        "seniority": 5,
        "department": "Accounting"
      }, {
        "name": "Michael Scott",
        "seniority": 7,
        "department": "Management"
      }, {
        "name": "Dwight Schrute",
        "seniority": 2,
        "department": "Sales"
      }, {
        "name": "Jim Halpert",
        "seniority": 3,
        "department": "Sales"
      }, {
        "name": "Kevin Malone",
        "seniority": 4,
        "department": "Accounting"
      }, {
        "name": "Angela Martin",
        "seniority": 5,
        "department": "Accounting"
      }, {
        "name": "Michael Scott",
        "seniority": 7,
        "department": "Management"
      }, {
        "name": "Dwight Schrute",
        "seniority": 2,
        "department": "Sales"
      }, {
        "name": "Jim Halpert",
        "seniority": 3,
        "department": "Sales"
      }, {
        "name": "Kevin Malone",
        "seniority": 4,
        "department": "Accounting"
      }, {
        "name": "Angela Martin",
        "seniority": 5,
        "department": "Accounting"
      }, {
        "name": "Michael Scott",
        "seniority": 7,
        "department": "Management"
      }, {
        "name": "Dwight Schrute",
        "seniority": 2,
        "department": "Sales"
      }, {
        "name": "Jim Halpert",
        "seniority": 3,
        "department": "Sales"
      }, {
        "name": "Kevin Malone",
        "seniority": 4,
        "department": "Accounting"
      }, {
        "name": "Angela Martin",
        "seniority": 5,
        "department": "Accounting"
      }, {
        "name": "Michael Scott",
        "seniority": 7,
        "department": "Management"
      }, {
        "name": "Dwight Schrute",
        "seniority": 2,
        "department": "Sales"
      }, {
        "name": "Jim Halpert",
        "seniority": 3,
        "department": "Sales"
      }, {
        "name": "Kevin Malone",
        "seniority": 4,
        "department": "Accounting"
      }, {
        "name": "Angela Martin",
        "seniority": 5,
        "department": "Accounting"
      }, {
        "name": "Michael Scott",
        "seniority": 7,
        "department": "Management"
      }, {
        "name": "Dwight Schrute",
        "seniority": 2,
        "department": "Something Else"
      }, {
        "name": "Jim Halpert",
        "seniority": 3,
        "department": "Something Else"
      }, {
        "name": "Kevin Malone",
        "seniority": 4,
        "department": "Something"
      }, {
        "name": "Angela Martin",
        "seniority": 5,
        "department": "Something"
      }],
      proxy: {
        type: 'memory',
        reader: {
          type: 'json',
          rootProperty: 'employees'
        }
      }
    });

    Ext.create('Ext.grid.Panel', {
      title: 'Employees',
      store: store,
      columns: [{
        xtype: 'checkcolumn',
        dataIndex: 'isChecked'
      }, {
        text: 'Name',
        dataIndex: 'name'
      }, {
        text: 'Seniority',
        dataIndex: 'seniority'
      }],
      features: [{
        ftype: 'checkboxGrouping',
        enableGroupingMenu: false,
        hideGroupHeader: true,
        //startCollapsed: true // produces strange bug
      }],
      width: 500,
      height: 600,
      renderTo: Ext.getBody()
    });
  }
});