(function(config,window){
			emojiArea = {
				range : '',
				selection : '',
				insertedNode : [],
				emojiCount : 0,
				childCount : document.getElementById('userInput').children.length,
				init : function(){
            		this.initiateKeyUp();
            		this.initiatePress();
            		//this.initiateDOMInsertion();
        		},
				createIcon : function(emoji,count) {
					var filename = config.icons[emoji];
					var path = config.path || '';
					if (path.length && path.charAt(path.length - 1) !== '/') {
						path += '/';
					}
					return '<span id=emoji'+count+'><img src="' + path + filename + '" alt=""></span>&#8203;';
				},
				reEscape : function(s) {
		        	return s.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		    	},
		    	setEndOfContenteditable : function(contentEditableElement){
		    		var that = emojiArea;
				    if(document.createRange){
				        that.savedRange = document.createRange();
				        that.savedRange.selectNodeContents(contentEditableElement);
				        that.savedRange.collapse(false);
				        that.selection = window.getSelection();
				        that.selection.removeAllRanges();
				        that.selection.addRange(that.savedRange);
				    }
				    else if(document.selection){ 
				        that.range = document.body.createTextRange();
				        that.range.moveToElementText(contentEditableElement);
				        that.range.collapse(false);
				        that.range.select();
				    }
				},
				initiateKeyUp : function(){
					document.getElementById('userInput').addEventListener("keyup",function(e) {
						console.log(e.keyCode);
						var that = emojiArea;
				    	var self = this;
				    	//var that = emojiArea;
				    	var html = this.innerHTML;
				    	var previousHTML = html;
				    	var emojis = config.icons;
				    	if(e.keyCode !== 13){
							for (var key in emojis) {
								if (emojis.hasOwnProperty(key) && html.indexOf(key) != -1) {
									html = html.replace(new RegExp(that.reEscape(key), 'g'),that.createIcon(key,that.emojiCount));
									that.emojiCount++;
								}
							}
							if(previousHTML != html){
								this.innerHTML = html;
							}
							if(that.emojiCount !== 0){
								var selectChild = that.emojiCount-1;
				    			selectChild = 'emoji'+selectChild;
				    			var currentSpan = document.getElementById(selectChild);
				    			var selectParentId = that.emojiCount-2;
				    			selectParentId = 'emoji'+selectParentId;
				    			if(currentSpan.parentElement.tagName === "SPAN" && currentSpan.parentElement.id == selectParentId){
				    				var referenceNode = currentSpan.parentNode;
				    				for(var i=0; i<currentSpan.parentElement.childNodes.length-1; i++){
				    					if(currentSpan.parentElement.childNodes[i].tagName == "SPAN"){
				    						currentSpan.parentElement.removeChild(currentSpan.parentElement.childNodes[i]);
				    						referenceNode.parentNode.insertBefore(currentSpan, referenceNode.nextSibling);
				    						break;
				    					}
				    				}
				    			}
							}
				    		var newChildCount  = this.children.length;
				    		if(that.childCount != that.emojiCount){
				    			var selectChild = that.emojiCount-1;
				    			selectChild = 'emoji'+selectChild;
				    			// if(document.getElementById(selectChild))
				    			that.setEndOfContenteditable(document.getElementById(selectChild));
				    			that.childCount = that.emojiCount;
				    		}
						}else if(e.keyCode == '13'){
				    		var iDiv = document.createElement('div');
							iDiv.id = 'block';
							iDiv.className = 'com-o-s';
							iDiv.innerHTML = html;
							document.getElementById('append').appendChild(iDiv);
							this.innerHTML = '';
				    	}
	
		 		 	});
				},
				initiatePress : function(){
					document.getElementById('userInput').addEventListener("keypress",function(e) {
						console.log('keypress');
						var style,fontSize,image,height,width;
						if(e.metaKey && (e.keyCode == '97' || e.keyCode == '65')){
							document.execCommand('insertHTML', false);
							e.preventDefault();
							style = window.getComputedStyle(this, null).getPropertyValue('font-size');
							fontSize = parseFloat(style); // now you have a proper float for the font size (yes, it can be a float, not just an integer)
							this.style.fontSize = (fontSize + 1) + 'px';
							if(this.getElementsByTagName('img').length > 0){
								image = this.getElementsByTagName('img')[0];
								height = parseFloat(window.getComputedStyle(image, null).getPropertyValue('height'));
								width = parseFloat(window.getComputedStyle(image, null).getPropertyValue('width'));
								image.style.height = (height + 1) + 'px';
								image.style.width = (width + 1) + 'px';
							}
						}
						else if(e.metaKey && (e.keyCode == '78' || e.keyCode == '110')){
							document.execCommand('insertHTML', false);
							e.preventDefault();
							style = window.getComputedStyle(this, null).getPropertyValue('font-size');
							fontSize = parseFloat(style); // now you have a proper float for the font size (yes, it can be a float, not just an integer)
							this.style.fontSize = (fontSize - 1) + 'px';
							if(this.getElementsByTagName('img').length > 0){
								image = this.getElementsByTagName('img')[0];
								height = parseFloat(window.getComputedStyle(image, null).getPropertyValue('height'));
								width = parseFloat(window.getComputedStyle(image, null).getPropertyValue('width'));
								image.style.height = (height - 1) + 'px';
								image.style.width = (width - 1) + 'px';
							}
						}
					});
				},
				initiateDOMInsertion : function(){
					document.getElementById('userInput').addEventListener("DOMNodeInserted", function(e) {
						console.log(e.target);
						if(e.target.tagName == "SPAN")
					    emojiArea.insertedNode.push(e.target);
					},true);
				}
			};
		emojiArea.init();
		})(emojiConfig,window);
