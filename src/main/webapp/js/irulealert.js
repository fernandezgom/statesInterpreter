function CustomAlert(){
            this.render = function(dialog){
                var winW = window.innerWidth;
                var winH = window.innerHeight;
                var dialogoverlay = document.getElementById('dialogoverlay');
                var dialogbox = document.getElementById('dialogbox');
                dialogoverlay.style.display = "block";
                dialogoverlay.style.height = winH+"px";
                dialogbox.style.left = (winW/2) - (700 * .5)+"px";
                dialogbox.style.top = "35%";
                dialogbox.style.display = "block";
                document.getElementById('dialogboxhead').innerHTML = '<div id="dialogboxbody"> <table id="tableAlign"><tr><td><span id="verticalSpanLeft"><img src="/FractionsLab/images/frobot.png"></img></span></td><td> <span id="verticalSpanRight">' + dialog + '</span></td></tr></table></div><div style="margin-top: 7px; margin-bottom:2px; display:flex; "> <button style="margin-left:auto; margin-right:auto; " class="it2lbutton" onclick="Alert.ok()">OK</button></div>';
             
            }
            this.ok = function(){
                document.getElementById('dialogbox').style.display = "none";
                document.getElementById('dialogoverlay').style.display = "none";
            }
            window.onresize = function()
            {
                var winW = window.innerWidth;
                var winH = window.innerHeight;
                var dialogoverlay = document.getElementById('dialogoverlay');
                var dialogbox = document.getElementById('dialogbox');
                dialogoverlay.style.display = "none";
                dialogoverlay.style.height = winH+"px";
                dialogbox.style.left = (winW/2) - (550 * .5)+"px";
                dialogbox.style.top = "35%";
                dialogbox.style.display = "none";

            }
        }
    var Alert = new CustomAlert();