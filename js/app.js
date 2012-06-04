
$(document).ready(function() {
		
	/**
	* JQuery UI tabs
	**/
	var $tabs = $('#tabs').tabs();
	/**
	* Array of files we're tailing
	**/
	var files = {};
	/**
	* Height of the tail window
	**/
	var height = $(window).height() - 200;
	/**
	* The fileinput we'll be using as our drop area
	**/
	var fileInput = document.getElementById("file");
	
	
	/**
	* Bunch of callbacks
	**/
	var callbacks = {
			
		tabSelect : function(event, ui) {
			
			var $header = $(ui.tab);
			var $textarea = $(ui.panel).find(".textarea");
			
			$header.removeClass("ui-state-highlight");
			
			_.delay(function() {
				$textarea.niceScroll().checkContentSize();
				$textarea.niceScroll().scrollTop($textarea.prop("scrollHeight")); 		
			}, 50);

		},
		
		dragStart : function() {
			$("#file").css("height", $(window).height()*0.95).css("width", $(window).width()*0.95).css("display", "block");
		},
		dragEnd : function() {
			$("#file").css("height", 1).css("width", 1).css("display", "none");
		},
		windowResize : function() {
			
			height = $(window).height() - 200;
			
			if($(".textarea").length > 0)
				$(".textarea").css("height", height).niceScroll().checkContentSize();
			
		},
		fileChange : function() {
			
			_.each(fileInput.files, function(file) {
				
				if(files[file.name] === undefined) {

					var tail = new Tail(file);
					var index = _.size(files);
					var id = "#tabs_" + index;
					
					files[file.name] = id;
					$tabs.tabs("add", id, file.name, index);
					
					var $tab = $(id);
					var $textarea = $("<div/>", { "class" :  "textarea", "style" : "height:"+height+"px;" });
					
					$tab.append($textarea);
					$textarea.niceScroll({autohidemode : false}).init();
					
					tail.bind("new_content", function(content) {
						
						//Should we scroll?
						var scroll = ($textarea.prop("scrollHeight") - $textarea.prop("scrollTop") - height == 0); 
						
						//Append the text / replace new lines with br/
						$textarea.append(content.replace(/\n/g, '<br/>'));
						
						
						//Current focus is on another tab, lets highlight this tab
						if($tabs.tabs("option", "selected") != index) {
							$tabs.find('[href="#' + $tab.attr("id") + '"]').addClass("ui-state-highlight");
						}
						
						//Handle scrolling if we were at the bottom
						if(scroll) 
							$textarea.niceScroll().scrollTop($textarea.prop("scrollHeight")); 
						
						$textarea.niceScroll().checkContentSize();
						
					});
					
					
					
				}
			});
		}
		
	};
	
	/**
	* Clicking on a tab binding
	**/
	$tabs.bind( "tabsselect", callbacks.tabSelect);
	
	/**
	* Drag n drop related bindings
	**/
	$("html").bind("dragover", callbacks.dragStart);
	$("html").bind("drop", callbacks.dragEnd);
	$(fileInput).bind("dragleave", callbacks.dragEnd);
	
	/**
	* Window resize binding
	*/
	$(window).resize(callbacks.windowResize);

	/**
	* Detect any new files being dropped 
	**/
	fileInput.addEventListener("change", callbacks.fileChange);

});