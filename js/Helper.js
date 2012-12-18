helper = {
	
	vard : function(obj){
		
		var out = '';
		for (var i in obj) {
			out += i + ": " + obj[i] + "\n";
		}
		
		
		var pre = document.createElement('pre');
		pre.innerHTML = out;
		document.body.appendChild(pre)

		
	}
	
	
}