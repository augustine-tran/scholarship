/*!
 * Ext JS Library 3.2.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Kid = Ext.data.Record.create([
    {name: 'kidId', type:'string'},
    {name: 'name', type:'string'},
    {name: 'address', type:'string'},
    {name: 'code', type:'string'},
    {name: 'birth', type:'date', dateFormat: 'Y-m-d H:i:s'},
    {name: 'place_of_birth', type:'string'}
]);

Kid.nextId = function(){
	// if the time isn't unique enough, the addition 
	// of random chars should be
	var t = String(new Date().getTime()).substr(4);
	var s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	for(var i = 0; i < 4; i++){
		t += s.charAt(Math.floor(Math.random()*26));
	}
	return t;
}

// The main grid's store
KidStore = function(conn){
	KidStore.superclass.constructor.call(this, {
        reader: new Ext.data.JsonReader({
            idProperty: 'kidId'
        }, Kid)
    });

    this.proxy = new Ext.data.SqlDB.Proxy(conn, 'kid', 'kidId', this);

    if(true){ // google needs the table created
        //this.proxy.on('beforeload', this.prepareTable, conn);
    }

};

Ext.extend(KidStore, Ext.data.Store, {
    addKid : function(data){
        this.loadData([data], true);
    },

    prepareTable : function(){
        try{
	        this.createTable({
	            name: 'kid',
	            key: 'kidId',
	            fields: Kid.prototype.fields
	        });
        }catch(e){console.log(e)}
    }
});

// The store for Categories
CategoryStore = function(){
    CategoryStore.superclass.constructor.call(this, {
        expandData: true,
        data: [],
        fields:[{name: 'text', type:'string'}],
        sortInfo:{field:'text', direction:'ASC'},
        id: 0
    });
}

Ext.extend(CategoryStore, Ext.data.ArrayStore, {
    init : function(store){
        var cats = store.collect('category', false, true);
        this.loadData(cats);
    },

    addCategory : function(cat){
        if(cat && this.indexOfId(cat) === -1){
            this.clearFilter(true);
            this.loadData([cat], true);
            this.applySort();
        }
    }
});