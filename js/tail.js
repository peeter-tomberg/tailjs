/**
 * 
 * Enables browser-based file tailing
 * 
 * @param file - the file to be tailed
 * @param options - the options 
 * @returns {Tail}
 * 
 * @event check_for_updates - triggered every 1 second, checks if the file has been changed
 * @event file_size_changed(old_size, new_size) - triggered when a file change is detected
 * @event new_content(content_string) - triggered when new content is read from the file
 */
function Tail(file, options) {
	
	if(!(this instanceof Tail))
		throw "Please create a new object of Tail";

	if(!(file instanceof File))
		throw "File required";
	
	//TODO: Better event system, with name-spaces
	if(typeof(Backbone) === "undefined" || typeof(Backbone.Events) === "undefined") {
		throw "Backbone.Events required";
	}
	_.extend(this, Backbone.Events);
	
	var self = this;
	
	this.file = file;
	this.size = file.size;
	
	this.options = _.defaults(options || {}, {
		polling_speed : 1000
	});
	
	this.bind("check_for_updates", function() {
		
		if(self.file.size > self.size) {
			self.trigger("file_size_changed", self.size, file.size);
			self.size = self.file.size;
		}
		
		setTimeout(function() {
			self.trigger("check_for_updates");
		}, self.options.polling_speed);
	
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



	
	
	
