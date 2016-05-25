var content = function Content() {
	this.data = "";
	this.objectionableWord = ['watch'];
	this.score = 0;
	this.absoluteLinks = [];
	this.relativeLinks = [];
}

content.prototype.isAdult = function() {
	if(this.findObjectionableWord() == true){
		this.getSuspiciousContentLinks();
		console.log(this.relativeLinks);
	} else {
		return false;
	}
}

content.prototype.findObjectionableWord = function() {
	var hasSuspiciousContent = false;
	var strBody = this.data('html > body').text();
	this.objectionableWord.forEach(function(o){
		if(strBody.toLowerCase().indexOf(o.toLowerCase()) !== -1) {
			hasSuspiciousContent = true;
			return false;
		}
	});
	return hasSuspiciousContent;
}


content.prototype.getSuspiciousContentLinks = function() {
	console.log("unsafe");
	var that = this;

	var link = this.data("a[href^='/']");
	this.relativeLinks = link.map(function(o) {
		return that.data(this).attr('href');
	});

	link = this.data("a[href^='/']");
	this.absoluteLinks = link.map(function(o) {
		return that.data(this).attr('href');
	});
}

module.exports = content