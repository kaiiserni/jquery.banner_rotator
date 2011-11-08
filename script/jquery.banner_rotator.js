/*
 *	Kai De Sutter (kaiiserni@gmail.com)
 *
 * This is a jQuery plugin to rotate banners.
 *
 */

( function($) {

	function random(length, curindex) {
		var rand = curindex;
		while(rand == curindex)
		rand = Math.floor(Math.random() * length);
		return rand;
	}

	function maxindex(i, l) {
		if(i >= l)
			i = 0;
		return i;
	}

	function BannerRotator(_obj, _options) {
		this.rotating = false;
		this.obj = _obj;
		this.options = _options;
		this.b_curindex = 0;
		this.t_curindex = 0;
	}


	BannerRotator.prototype.rotateBanners = function(init) {
		if(this.rotating)
			return false;
		this.rotating = true;

		var b_nextindex = (this.options.random ? random(this.options.banner_urls.length, this.b_curindex) : ( init ? this.b_curindex : maxindex(this.b_curindex + 1, this.options.banner_urls.length)));

		if(this.options.subtitles.length > 0) {
			var t_nextindex = (this.options.random ? random(this.options.subtitles.length, this.t_curindex) : ( init ? this.t_curindex : maxindex(this.t_curindex + 1, this.options.subtitles.length)));
			$("div span:eq(" + b_nextindex + ")", this.obj).css("display", "block").text(this.options.subtitles[t_nextindex]);
			this.t_curindex = t_nextindex;
		}
		if(init != false)
			$("div img:eq(" + this.b_curindex + ")", this.obj).fadeOut(500);
		$("div img:eq(" + b_nextindex + ")", this.obj).hide().fadeIn(2000);
		$("div.cont", this.obj).animate({
			"left" : -(b_nextindex * (this.options.width + this.options.banner_space))
		}, 750);

		this.b_curindex = b_nextindex;		
		this.rotating = false;
	}

	BannerRotator.prototype.init = function() {
		this.obj.css({
			"display" : "block",
			"overflow" : "hidden",
			"position" : "relative",
			"width" : this.options.width,
			"height" : this.options.height
		});
		var container = $("<div>").addClass("cont").appendTo(this.obj).css({
			"width" : (this.options.width + this.options.banner_space) * this.options.banner_urls.length,
			"position" : "absolute",
			"left" : -this.options.banner_space
		});
		for(var i = 0; i < this.options.banner_urls.length; i++) {
			container.append($("<div>").css({
				"float" : "left",
				"width" : this.options.width,
				"display" : "block",
				"padding-left" : this.options.banner_space,
				"height" : this.options.height,
				"position" : "relative"
			}).append($("<span>").css({
				"font-style" : "italic",
				"font-family" : this.options.text_font,
				"font-size" : "24pt",
				"text-indent" : "20px",
				"line-height" : "40px",
				"width" : "100%",
				"display" : "none",
				"height" : 40,
				"position" : "absolute",
				"z-index" : 1,
				"opacity" : 0.5,
				"background-color" : "#FFFFFF",
				"color" : this.options.text_color,
				"bottom" : 0
			})).append($("<img>").attr({
				"src" : this.options.banner_urls[i]
			}).css({
				"width" : "100%"
			}).hide()));
		}
		var self = this;
		setInterval(function() {
			self.rotateBanners();
		}, this.options.timeout);
		self.rotateBanners(true);
	}

	$.fn.bannerRotator = function(_options) {
		var options = {
			"banner_urls" : _options.banner_urls || [],
			"banner_space" : _options.banner_space || 5,
			"width" : _options.width || 560,
			"height" : _options.height || 120,
			"timeout" : _options.timeout || 5000,
			"random" : _options.random || false,
			"subtitles" : _options.subtitles || [],
			"text_color" : _options.text_color || "#000000",
			"text_font" : _options.text_font || "Arial"
		}
		if(options.banner_urls.length <= 0) return false;
		rotator = new BannerRotator($(this), options);
		rotator.init();
		return rotator;
	}
}(jQuery));
