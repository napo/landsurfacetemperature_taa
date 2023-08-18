  function toggleInfo() {
    var x = document.getElementById("info");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
  function toggleIntro() {
    var x = document.getElementById("intro");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
  function toggleLegend() {
	var x = document.getElementById("legend-window");
	if (x.style.display === "block") {
		x.style.display = "none";
	} else {
		x.style.display = "block";
		document.getElementById("info").style.display = "none";
	}
   }

