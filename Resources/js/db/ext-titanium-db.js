/*!
 * Ext JS Library 3.2.0
 * Copyright(c) 2006-2010 Ext JS, Inc.
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.data.TitaniumDB = Ext.extend(Ext.data.SqlDB, {
	// abstract methods
    open : function(db, cb, scope){
        this.conn = Titanium.Database.openFile(db);
        //this.conn.open(db);
        this.openState = true;
		Ext.callback(cb, scope, [this]);
		this.fireEvent('open', this);
    },

	close : function(){
        this.conn.close();
        this.fireEvent('close', this);
    },

    exec : function(sql, cb, scope){
        this.conn.execute(sql).close();
        Ext.callback(cb, scope, [true]);
    },

	execBy : function(sql, args, cb, scope){
	    this.conn.execute(sql, args).close();
        Ext.callback(cb, scope, [true]);
    },

	query : function(sql, cb, scope){
	    var rs = this.conn.execute(sql);
        var r = this.readResults(rs);
	    Ext.callback(cb, scope, [r]);
	    return r;
    },

	queryBy : function(sql, args, cb, scope){
        var rs = this.conn.execute(sql, args);
        var r = this.readResults(rs);
        Ext.callback(cb, scope, [r]);
        return r;
    },

    readResults : function(rs){
        return rs;
    },

    // protected/inherited method
    isOpen : function(){
		return this.openState;
	},

	getTable : function(name, keyName){
		return new Ext.data.SqlDB.Table(this, name, keyName);
	}
});