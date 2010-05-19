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
], 'kidId');

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

Sponsor = Ext.data.Record.create([
    {name: 'sponsorId', type:'string'},
    {name: 'name', type:'string'},
    {name: 'address', type:'string'},
    {name: 'title', type:'string'},
    {name: 'phone', type:'string'},
    {name: 'email', type:'string'},
    {name: 'note', type:'string'},
], 'sponsorId');

Sponsor.nextId = function(){
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
SponsorStore = function(conn){
	SponsorStore.superclass.constructor.call(this, {
        reader: new Ext.data.JsonReader({
            idProperty: 'sponsorId'
        }, Sponsor)
    });

    this.proxy = new Ext.data.SqlDB.Proxy(conn, 'sponsor', 'sponsorId', this);

    if(true){ // google needs the table created
        //this.proxy.on('beforeload', this.prepareTable, conn);
    }

};

Ext.extend(SponsorStore, Ext.data.Store, {
    addSponsor : function(data){
        this.loadData([data], true);
    },

    prepareTable : function(){
        try{
	        this.createTable({
	            name: 'sponsor',
	            key: 'sponsorId',
	            fields: Sponsor.prototype.fields
	        });
        }catch(e){console.log(e)}
    }
});

Payment = Ext.data.Record.create([
    {name: 'paymentId', type:'string'},
    {name: 'kidId', type:'string'},
    {name: 'sponsorId', type:'string'},
    {name: 'extra_support', type:'string'},
    {name: 'note', type:'string'},
    {name: 'amount', type:'integer'},
    {name: 'date_start', type:'date', dateFormat: 'Y-m-d H:i:s'},
    {name: 'date_end', type:'date', dateFormat: 'Y-m-d H:i:s'},
    {name: 'date_in', type:'date', dateFormat: 'Y-m-d H:i:s'}
], 'paymentId');

Payment.nextId = function(){
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
PaymentStore = function(conn){
	PaymentStore.superclass.constructor.call(this, {
        reader: new Ext.data.JsonReader({
            idProperty: 'paymentId'
        }, Payment)
    });

    this.proxy = new Ext.data.SqlDB.Proxy(conn, 'payment', 'paymentId', this);

    if(true){ // google needs the table created
        //this.proxy.on('beforeload', this.prepareTable, conn);
    }

};

Ext.extend(PaymentStore, Ext.data.Store, {
    addPayment : function(data){
        this.loadData([data], true);
    },

    prepareTable : function(){
        try{
	        this.createTable({
	            name: 'payment',
	            key: 'paymentId',
	            fields: Payment.prototype.fields
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