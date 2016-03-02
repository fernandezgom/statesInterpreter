//JLF: This will create special support for each rule
function ExtendedSupport(st, rl) {
	Support.call(this, st);
	this.rule=rl;
}

ExtendedSupport.prototype = Object.create(Support.prototype);

ExtendedSupport.prototype.constructor = ExtendedSupport;