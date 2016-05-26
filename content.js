var content = function Content() {
	this.data = "";
	this.objectionableWord = require('./objectionableWordsDB.json').words;
	this.score = 0;
	this.level = 0; //level of how suspicous we are about the content
	this.wordCount = 0;
	this.absoluteLinks = [];
	this.relativeLinks = [];
}

content.prototype.isAdult = function() {
	if(this.findObjectionableWord() == true){
		this.level++;
		this.getSuspiciousContentLinks();
	} else {
		return false;
	}
}

content.prototype.findObjectionableWord = function() {
	var hasSuspiciousContent = false;
	var strBody = this.data('html > body').text();
	var that = this;
	this.objectionableWord.forEach(function(o){
		if(strBody.toLowerCase().indexOf(o.toLowerCase()) !== -1) {
			that.wordCount++;
			hasSuspiciousContent = true;
		}
	});
	return hasSuspiciousContent;
}


content.prototype.getSuspiciousContentLinks = function() {
	var that = this;
	for(var i=0; i<this.data("img").length; i++){
		if(this.data("img")[i].attribs.src != undefined) {
			if(this.data("img")[i].attribs.src.substring(0,1) == '/'){
				this.relativeLinks.push(this.data("img")[i].attribs.src);
			} else {
				this.absoluteLinks.push(this.data("img")[i].attribs.src);
			}
		}
	}
}

module.exports = content