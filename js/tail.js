/**
 * 
 * @param file
 * @returns {Tail}
 * 
 * @event check_for_updates 					- triggered every 1 second, checks if the file has been changed
 * @event file_size_changed(old_size, new_size) - triggered when a file change is detected
 * @event new_content(content_string)			- triggered when new contnet is read from the file
 */
function Tail(file) {
	
	if(!(this instanceof Tail))
		throw "Please create a new object to Tail";

	if(file === undefined)
		throw "File required";
	
	//Lets have some events
	_.extend(this, Backbone.Events);
	
	var self = this;
	
	this.file = file;
	this.size = file.size;
	
	this.bind("check_for_updates", function() {
		
		if(self.file.size > self.size) {
			self.trigger("file_size_changed", self.size, file.size);
			self.size = self.file.size;
		}
		
		setTimeout(function() {
			self.trigger("check_for_updates");
		}, 1000);
	
	});

	this.bind("file_size_changed", function(old_size, new_size) {

	    var self = this;
	    var fileReader = new FileReader();
	    var blob = self.file.webkitSlice(old_size, new_size);

	    fileReader.onerror = function() {
	        throw fileReader.error;
	    };
	    fileReader.onload = function() {      
	        self.trigger("new_content", fileReader.result);
	    };
	    fileReader.readAsText(blob);


	});
	
	
	//Lets start the tail
	this.trigger("check_for_updates");
	
};



	
	
	
