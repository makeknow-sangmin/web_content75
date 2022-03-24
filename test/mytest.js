var o1 = {
        xtype: 'combobox',
        store: 'categoryStore',
        displayField: 'CategoryName',
        valueField: 'CategoryID'
    };
var o =  {
        header: 'Category',
        dataIndex: 'CategoryName',
        editor: o1
    };
var arr = [
      o     
   ];

/*

 var arr = [
            {
                        header: 'Category',
                        dataIndex: 'CategoryName',
                        editor:
                            {
                                xtype: 'combobox',
                                store: 'categoryStore',
                                displayField: 'CategoryName',
                                valueField: 'CategoryID'
                            }
                    }
   ];




[] array => java, javascript
{} object => javascript



classs A {
int i;
String s;
};
A a = new A();

var a = {
i: 3
};

a.i =3;

//순수 javascript
a['i'] =3;

//Extjs 저의된 object
a.set('i', 3);



*/