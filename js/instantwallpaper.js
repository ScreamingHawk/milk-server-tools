// Store URL params for easy access
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null){
       return null;
    } else {
       return results[1] || 0;
    }
}

var img;

function grabImage(){
	var imgSrc = $('#imageLink').val();
	if (imgSrc){
		// URL
		imgOrg = $('#imageImage');
		imgOrg.attr('crossOrigin', 'anonymous');
		imgOrg.attr("src", imgSrc);
		// Unhide sections
		$('#canvasBlock').removeClass('hidden');
		$('#downloadBlock').removeClass('hidden');
		imgOrg.load(function(){
			img = imgOrg.get(0);
			updateCanvas();
		});
		imgOrg.error(function(){
			// Cross Origin Error, hide download
			imgOrg.removeAttr('crossOrigin', '');
			imgOrg.attr("src", imgSrc);
			$('#downloadBlock').addClass('hidden');
		});
	} else {
		//TODO File upload here
	}
}
var iw, ih, cw, ch, xw, xh;

function updateCanvas(){
	var can = $('#imageCanvas');
	var ctx = can[0].getContext('2d');
	
	iw = img.clientWidth;
	ih = img.clientHeight;
	xw = $('#imageWidth').val();
	xh = $('#imageHeight').val();
	
	ctx.canvas.width = xw;
	ctx.canvas.height = xh;
	cw = ctx.canvas.width;
	ch = ctx.canvas.height;
	
	// Calc ratio
	var rw = xw / iw;
	var rh = xh / ih;
	
	if (rw > rh){
		iw = iw * rw;
		ih = ih * rw;
	} else {
		iw = iw * rh;
		ih = ih * rh;
	}
	
	drawImage();
	$('#imageEnhance').removeClass('hidden');
}

function drawImage(){
	var ctx = $('#imageCanvas')[0].getContext('2d');
	ctx.drawImage(img, -(iw-cw)/2, -(ih-ch)/2, iw, ih);
}

function growSlightly(){
	iw++;
	ih++;
	drawImage();
}

function shrinkSlightly(){
	iw--;
	ih--;
	drawImage();
}

var enlarging;
function growSlightlyCont(){
	var b = $('#imageGrowCont');
	if (enlarging){
		clearTimeout(enlarging);
		enlarging = null;
		b.html('Grow Continuously');
		b.removeClass('btn-warning');
		b.addClass('btn-info');
	} else {
		enlarging = setInterval(growSlightly, 50);
		b.html('Stop Grow');
		b.addClass('btn-warning');
		b.removeClass('btn-info');
	}
}

var shrinking;
function shrinkSlightlyCont(){
	var b = $('#imageShrinkCont');
	if (shrinking){
		clearTimeout(shrinking);
		shrinking = null;
		b.html('Shrink Continuously');
		b.removeClass('btn-warning');
		b.addClass('btn-info');
	} else {
		shrinking = setInterval(shrinkSlightly, 50);
		b.html('Stop Shrink');
		b.addClass('btn-warning');
		b.removeClass('btn-info');
	}
}

$(document).ready(function(){
	// Button mappings
	$('#imageButton').click(function(){
		grabImage();
		return false;
	});
	$('#imageDownloadOpen').click(function(){
		window.open($('#imageCanvas').get(0).toDataURL("image/png"));
		return false;
	});
	$('#imageDownloadImage').click(function(){
		// Create the image at the bottom of the page
		$('#imageGenerated').attr('src', $('#imageCanvas').get(0).toDataURL("image/png"));
		$('#downloadImageBlock').removeClass('hidden');
		return false;
	});
	$('#showHelp').click(function(){
		var ihelp = $('#imageHelp');
		ihelp.toggleClass('hidden');
		if (ihelp.hasClass('hidden')){
			$('#showHelp').html('Show help');
		} else {
			$('#showHelp').html('Hide help');
		}
		return false;
	});
	$('#imageSwitchWH').click(function(){
		var w = $('#imageWidth').val();
		$('#imageWidth').val($('#imageHeight').val());
		$('#imageHeight').val(w);
		return false;
	});
	$('#imageGrow').click(function(){
		growSlightly();
		return false;
	});
	$('#imageGrowCont').click(function(){
		growSlightlyCont();
		return false;
	});
	$('#imageShrinkCont').click(function(){
		shrinkSlightlyCont();
		return false;
	});
	// Preset from URL
	if ($.urlParam('w')){
		$('#imageWidth').val($.urlParam('w'));
	}
	if ($.urlParam('h')){
		$('#imageHeight').val($.urlParam('h'));
	}
	if ($.urlParam('img')){
		$('#imageLink').val($.urlParam('img'));
		grabImage();
	}
});