"use strict";
paper.install(window);

// const
var border_center = new Point(30, 30);
var border_radius = 25.5;
var bg_from = new Point(0, 0);
var bg_to = new Point(60, 60);
var img_max_height = 19.5;
var img_max_width = 19.5;
var font_size = 1.95;
var background_color = '#d1d6da';
var background_line_color = 'white';
var border_color = '#0da5dc';
var cutmark_color = 'red';
var logo_color = '#00b48d'; // TODO Settings
var text_background_color = '#ea5297';
var text_color = '#FFFFFF';
var badge_text = 'JUGEND HACKT\nEVENT';
var lineheight = 0.8;
var text_padding_top = 1.33;
var text_padding_bottom = 1.33;
var text_padding_left = 2.66;
var text_padding_right = 2.66;
var image_offset = 23;

window.onload = function() {
	paper.setup('paperCanvas');
	renderBadge();
}
function renderBadge() {
	project.clear();
	paper.view.zoom = 13;
	paper.view.center = (30,30);


	// Hintergrund (this is gonna be fun)
	var bg = new Group();
	var path = new Path.Rectangle(bg_from, bg_to);
	path.fillColor = background_color;
	bg.addChild(path);

	// Hintergrund / Kästchen
	var center = bg_from.add(new Point(0,1.7));
	var radius = 2.5;
	var ol = true;
	while (center.y <= bg_to.y) {
	    while (center.x <= bg_to.x) {
	    	var sq = new Path.RegularPolygon(center, 4, radius);
	    	bg.addChild(sq);
	    	sq.strokeColor = background_line_color;
	    	sq.strokeWidth = .1;
	    	sq.rotation = 45;
	    	center.x += 2*radius;
	    	var ln = new Path.Line(center.subtract(new Point(radius, -radius)), center.subtract(new Point(radius, radius)));
	    	bg.addChild(ln);
	    	ln.strokeColor = background_line_color;
	    	ln.strokeWidth = .1;
	    }
	    if (ol) {
	        center.x = radius;
	        center.y += 2*radius;
	    } else {
	        center.x = 0;
	        center.y += 2*radius;
	    }
	    ol = !ol;
	}
	// Hintergrund auf Sechseck begrenzen
	var bg_mask = new Path.RegularPolygon(border_center, 6, border_radius);
	bg.addChild(bg_mask);
	bg_mask.clipMask = true;

	// Rand
	var hex = new Path.RegularPolygon(border_center, 6, border_radius);
	hex.strokeColor = border_color;
	hex.strokeWidth = 4;
	// Roter rand (schnittmarke)
	var hex_cut = new Path.RegularPolygon(border_center, 6, border_radius);
	hex_cut.strokeColor = cutmark_color;
	hex_cut.strokeWidth = .1;


	function onLogoLoad(logo) {
	    var logoGroup = new Group();
	    var image_top = border_center.y - image_offset;
	    var image_btm = border_center.y + image_offset/2;
	    var image_center = (image_top+image_btm)/2;

	    logo.position = new Point(border_center.x, image_center);
	    var x_scale = img_max_width / logo.bounds.width;
	    var y_scale = img_max_height / logo.bounds.height;
	    logo.scale(Math.min(x_scale, y_scale));
	    while (hex.intersects(logo)) {
	        logo.scale(0.9);
	    }
	    // TODO: make configurable
	    logo.children['fg'].fillColor = logo_color;
	}
	var logo = paper.project.importSVG("jh.svg", {onLoad: onLogoLoad});

	// function origLoad(logo) {
	//     logo.position = border_center;
	// }
	// var orig = paper.project.importSVG("jh_orig.svg", {onLoad: origLoad});

	var boxTriangle = new Path(new Point(39.66, 35.33), new Point(39.66, 37.33), new Point(41.66,37.33));
	boxTriangle.fillColor = text_background_color;

	addText(badge_text, border_center)
}

function addText(text, center) {
	opentype.load("modern_led_board-7.ttf", function(err, font) {
		var textGroup = new Group();
		var baseline = 0;
		var lines = text.split("\n");
		for (var j=0; j<lines.length; j++) {
			var lineGroup = new Group();
			var line = lines[j];
			var textwidth = font.getAdvanceWidth(line, font_size);
			var fontpaths = font.getPaths(line,0,baseline,font_size);

			for(var i = 0; i<fontpaths.length; i++){

				if(fontpaths[i].commands == 0) continue;
				var boundingboxData = fontpaths[i].getBoundingBox();
				var paperpath = paper.project.importSVG(fontpaths[i].toSVG());
				paperpath.fillColor = text_color;
				lineGroup.addChild(paperpath);
			}
			baseline += lineGroup.bounds.height + lineheight;
			if (textGroup.bounds.width != 0) {
				lineGroup.position.x = textGroup.position.x;
			}
			textGroup.addChild(lineGroup);
		}
		textGroup.position.x = center.x;
		textGroup.position.y = 35.33 + textGroup.bounds.height;

		var textRect = new Path.Rectangle(new Point(textGroup.bounds.x - text_padding_left, 37.33), new Point(textGroup.bounds.x + textGroup.bounds.width + text_padding_right, textGroup.bounds.y + textGroup.bounds.height + text_padding_bottom));
		textRect.fillColor = text_background_color;
		textGroup.bringToFront();
	});
}

function updateTextAndColor(){
	var text = document.getElementById("eventtext").value;
	console.log(text);

	if(text.length>0){
		badge_text = "JUGEND HACKT\n"+text;
	}

	var text = document.getElementById("colorText").value;
	console.log(text);

	if(text.length>0){
		if (text.length == 3 || text.length == 6) {
			text_background_color = "#" + text
		} else {
			text_background_color = text
		}
		renderBadge();
	}
}

function downloadSVG(){
	paper.view.update();
    var svg = project.exportSVG({ asString: true, bounds: 'content' });
    var svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = badge_text+".svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
