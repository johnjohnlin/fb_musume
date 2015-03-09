var Character = {
	Init: function Init(path) {
		  this.div = document.createElement("div");
		  this.img = document.createElement("img");
		  this.div.appendChild(this.img);
		  document.body.appendChild(this.div);

		  this.div.className = "fbm-character";
		  this.img.setAttribute("src", path);
	}
};

Character.Init("assets/Atago/pannpakapann.jpg");
