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
        sortInfo:{field: 'name', direction: "ASC"},
        groupField:'name',
        kidFilter: 'all',
        reader: new Ext.data.JsonReader({
            idProperty: 'kidId'
        }, Kid)
    });

    this.proxy = new Ext.data.SqlDB.Proxy(conn, 'kid', 'kidId', this);

    if(true){ // google needs the table created
        this.proxy.on('beforeload', this.prepareTable, conn);
    }

    this.addEvents({newcategory: true});
};

Ext.extend(KidStore, Ext.data.GroupingStore, {
    applyFilter : function(filter){
    	if(filter !== undefined){
    		this.kidFilter = filter;
    	}
        var value = this.kidFilter;
        if(value == 'all'){
            return this.clearFilter();
        }
        return this.filterBy(function(item){
            return item.data.completed === value;
        });
    },

    addKid : function(data){
        this.suspendEvents();
        this.clearFilter();
        this.resumeEvents();
        this.loadData([data], true);
        this.suspendEvents();
        this.applyFilter();
        this.applyGrouping(true);
        this.resumeEvents();
        this.fireEvent('datachanged', this);
        this.fireEvent('newcategory', data.category);
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