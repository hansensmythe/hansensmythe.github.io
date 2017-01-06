// Used by widget.html to open a separate window for SoundClick

// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-1619574-2']);
_gaq.push(['_trackPageview']);
(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

function writeFlashvars() {
	var songid = gup('sid');
	if (!songid) {
		alert("Sorry: couldn't find song identifier in URL");
		window.location = "../musicList.html";
	} else {
		document.write("<param name=\"flashvars\" value=\"playType=single&songid=" + songid + "&scid=" + songid + "&q=hi&ext=1\" />");
	}
}

function gup(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.href);
	if (results == null)
		return "";
	else
		return results[1];
}