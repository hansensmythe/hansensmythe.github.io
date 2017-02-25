// Used by widget.html to open a separate window for SoundClick

// Google Analytics

(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] ||
  function() {
    (i[r].q = i[r].q || []).push(arguments);
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
  m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); 

ga('create', 'UA-1619574-4', 'auto');
ga('send', 'pageview');

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