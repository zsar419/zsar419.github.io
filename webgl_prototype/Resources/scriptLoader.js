

var scripts = ["./data.js", "./controls.js", "./main.js", "./gui.js"];
var loadScripts = function(scripts){
    for(var sc in scripts){
        var script = document.createElement('script');
        script.src = sc;
        script.onload = function () {
            console.log("Loaded: ");
        };
        document.head.appendChild(script); //or something of the likes
    }
}
