function UnityProgress (dom) {
	this.progress = 0.0;
	this.message = "";
	this.dom = dom;

	var parent = dom.parentNode;

	var background = document.createElement("div");
	background.style.backgroundImage = "url('TemplateData/splash.png')";
	background.style.backgroundSize= "contain";
	background.style.position = "absolute";
	parent.appendChild(background);
	this.background = background;

	var logoImage = document.createElement("img");
	//logoImage.src = "TemplateData/progresslogo.png"; 
	logoImage.style.position = "absolute";
	parent.appendChild(logoImage);
	this.logoImage = logoImage;

	var progressFrame = document.createElement("img");
	progressFrame.src = "TemplateData/loadingbar.png"; 
	progressFrame.style.position = "absolute";
	parent.appendChild(progressFrame);
	this.progressFrame = progressFrame;
	this.progressFrame.style.display = "none";

	var progressBar = document.createElement("img");
	progressBar.src = "TemplateData/fullbar.png"; 
	progressBar.style.position = "absolute";
	parent.appendChild(progressBar);
	this.progressBar = progressBar;
	this.progressBar.style.display = "none";

	var messageArea = document.createElement("p");
	messageArea.style.position = "absolute";
	parent.appendChild(messageArea);
	this.messageArea = messageArea;


	this.SetProgress = function (progress) { 
	}

	this.SetMessage = function (message) { 
		this.message = message; 
		this.background.style.display = "inline";
		this.logoImage.style.display = "none";
		this.progressFrame.style.display = "none";
		this.progressBar.style.display = "none";			
		this.Update();
	}

	this.Clear = function() {
		this.background.style.display = "none";
		this.logoImage.style.display = "none";
		this.progressFrame.style.display = "none";
		this.progressBar.style.display = "none";
	}

	this.Update = function() {
		console.log ("UPDATE");
		this.background.style.top = this.dom.offsetTop + 'px';
		this.background.style.left = this.dom.offsetLeft + 'px';
		this.background.style.width = this.dom.offsetWidth + 'px';
		this.background.style.height = this.dom.offsetHeight + 'px';

		var logoImg = new Image();
		logoImg.src = this.logoImage.src;

		this.logoImage.style.top = this.dom.offsetTop + (this.dom.offsetHeight * 0.5 - logoImg.height * 0.5) + 'px';
		this.logoImage.style.left = this.dom.offsetLeft + (this.dom.offsetWidth * 0.5 - logoImg.width * 0.5) + 'px';
		this.logoImage.style.width = logoImg.width+'px';
		this.logoImage.style.height = logoImg.height+'px';

		this.messageArea.style.top = this.progressFrame.style.top;
		this.messageArea.style.left = 0;
		this.messageArea.style.width = '100%';
		this.messageArea.style.textAlign = 'center';
		this.messageArea.innerHTML = this.message;
	}

	this.Update ();
}