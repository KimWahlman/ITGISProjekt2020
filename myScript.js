var imageArray = new Array();


var map;
require(["esri/map",
"esri/layers/GraphicsLayer",
"esri/graphic",
"esri/InfoTemplate",
"esri/geometry/Point",
"esri/symbols/PictureMarkerSymbol",
"esri/symbols/SimpleMarkerSymbol",
"esri/Color",
"esri/geometry/webMercatorUtils", 
"dojo/dom", 
"dojo/domReady!",
"esri/geometry/Circle",
"esri/symbols/SimpleFillSymbol",
"dojo/dom-attr",
"esri/symbols/SimpleLineSymbol",
"esri/units"
], 
        function(Map, 
            GraphicLayer, 
            Graphic, 
            InfoTemplate, 
            Point, 
            PictureMarkerSymbol, 
            SimpleMarkerSymbol,
            Color,
            webMercatorUtils, 
            dom,
            Circle,
            SimpleFillSymbol,
            domAttr,
            SimpleLineSymbol,
            units) {
            map = new Map ("mapDiv", {
                basemap: "osm",
                center: [16.884522, 60.289158],
                zoom: "11",
            });
        var baseLayer = new GraphicLayer();
        var restLayer = new GraphicLayer();
        var sleepLayer = new GraphicLayer();
        map.addLayer(restLayer);
        map.addLayer(baseLayer);
        map.addLayer(sleepLayer);
        getPoiData();
        initButtons();
        //test();
        
        
    map.on("load", function() {     //LADDAR X/Y PÅ MUSKOORDINATER
    map.on("mouse-move", showCoordinates);
    map.on("mouse-drag", showCoordinates);
        });


         
         
function getPoiData() {
    var poiData = { url: "POI.json", handleAs: "json", content:{}, load: showPoints, initButtons};
    dojo.xhrGet(poiData);
    }
function showPoints(poiData){
    dojo.forEach(poiData.pointsOfInterests, function(points) {

        if(points.type == 1) //Matställe
        {  
            var poiSymbol = new PictureMarkerSymbol({
            url: "resources/restaurant.png",
            width: 20,
            height: 20,
            Attr: 2
        });
        var lng = points.x;
        var lat = points.y;
        var pointMarker = new Point(lng, lat);
        var graphic = new Graphic(pointMarker, poiSymbol);

        var jsonObj = Object.keys(points.images); //Matches the "image"-key in json-file.
        var pointName = points.name;

        var desc = "<b> Information: </b>"+"\n"+ points.description+ "<br><br>" ;

        var infoTemp = new InfoTemplate();
        var imagesCombined ="";

        for(i=0; i < jsonObj.length; i++) {
            imagesCombined += "\n<hr><img src='" + points['images'][i]['file']+ "'><br>";
        }
        imagesCombined += "<hr>";
        infoTemp.setContent(desc + imagesCombined);
        infoTemp.setTitle(pointName);
        graphic.setInfoTemplate(infoTemp);
        baseLayer.add(graphic);
        }

        if(points.type == 2) //Rastplats
        {
            var poiSymbol = new PictureMarkerSymbol({
                url: "resources/picnic.png",
                width: 20,
                height: 20,
            });
            var lng = points.x;
        var lat = points.y;
        var pointMarker = new Point(lng, lat);
        var graphic = new Graphic(pointMarker, poiSymbol);

        var jsonObj = Object.keys(points.images); //Matches the "image"-key in json-file.
        var pointName = points.name;

        var desc = "<b> Information: </b>"+"\n"+ points.description+ "<br><br>" ;

        var infoTemp = new InfoTemplate();
        var imagesCombined ="";

        for(i=0; i < jsonObj.length; i++) {
            imagesCombined += "\n<hr><img src='" + points['images'][i]['file']+ "'><br>";
        }
        imagesCombined += "<hr>";
        infoTemp.setContent(desc + imagesCombined);
        infoTemp.setTitle(pointName);
        graphic.setInfoTemplate(infoTemp);
        restLayer.add(graphic);
        }

        if(points.type == 3) //Kanotväg
        {
            var poiSymbol = new PictureMarkerSymbol({
                url: "resources/kanot.png",
                width: 20,
                height: 20
            });
            var lng = points.x;
        var lat = points.y;
        var pointMarker = new Point(lng, lat);
        var graphic = new Graphic(pointMarker, poiSymbol);

        var jsonObj = Object.keys(points.images); //Matches the "image"-key in json-file.
        var pointName = points.name;

        var desc = "<b> Information: </b>"+"\n"+ points.description+ "<br><br>" ;

        var infoTemp = new InfoTemplate();
        var imagesCombined ="";

        for(i=0; i < jsonObj.length; i++) {
            imagesCombined += "\n<hr><img src='" + points['images'][i]['file']+ "'><br>";
        }
        imagesCombined += "<hr>";
        infoTemp.setContent(desc + imagesCombined);
        infoTemp.setTitle(pointName);
        graphic.setInfoTemplate(infoTemp);
        baseLayer.add(graphic);
        }

        if(points.type == 4) //Övernattning
        {
            var poiSymbol = new PictureMarkerSymbol({
                url: "resources/overnattning.png",
                width: 20,
                height: 20
            });
            var lng = points.x;
        var lat = points.y;
        var pointMarker = new Point(lng, lat);
        var graphic = new Graphic(pointMarker, poiSymbol);

        var jsonObj = Object.keys(points.images); //Matches the "image"-key in json-file.
        var pointName = points.name;

        var desc = "<b> Information: </b>"+"\n"+ points.description+ "<br><br>" ;

        var infoTemp = new InfoTemplate();
        var imagesCombined ="";

        for(i=0; i < jsonObj.length; i++) {
            imagesCombined += "\n<hr><img src='" + points['images'][i]['file']+ "'><br>";
        }
        imagesCombined += "<hr>";
        infoTemp.setContent(desc + imagesCombined);
        infoTemp.setTitle(pointName);
        graphic.setInfoTemplate(infoTemp);
        sleepLayer.add(graphic);
        }

       if(points.type == 5) //Intressant/Övrigt
       {
        var poiSymbol = new PictureMarkerSymbol({
            url: "resources/overnattning.png",
            width: 20,
            height: 20
        });
        var lng = points.x;
        var lat = points.y;
        var pointMarker = new Point(lng, lat);
        var graphic = new Graphic(pointMarker, poiSymbol);

        var jsonObj = Object.keys(points.images); //Matches the "image"-key in json-file.
        var pointName = points.name;

        var desc = "<b> Information: </b>"+"\n"+ points.description+ "<br><br>" ;

        var infoTemp = new InfoTemplate();
        var imagesCombined ="";

        for(i=0; i < jsonObj.length; i++) {
            imagesCombined += "\n<hr><img src='" + points['images'][i]['file']+ "'><br>";
        }
        imagesCombined += "<hr>";
        infoTemp.setContent(desc + imagesCombined);
        infoTemp.setTitle(pointName);
        graphic.setInfoTemplate(infoTemp);
        baseLayer.add(graphic);
       }       
    });
}

function initButtons(){
    require(["dojo/on"], function(on){
        console.log("Hej");
        dojo.query("#gångväg").forEach(function(entry, i){
            entry.addEventListener("change", function() {
                    if(entry.checked == true) {
                        alert("Gångväg PÅ");
                    }
                    if(entry.checked == false) {
                        alert("Gångväg AV");
                    }
                });
            });
        dojo.query("#kanotled").forEach(function(entry, i){
            entry.addEventListener("change", function() {
                    if(entry.checked == true) {
                        alert("kanotled PÅ");
                    }
                    if(entry.checked == false) {
                        alert("kanotled AV");
                    }
                });
            });
        dojo.query("#cykelled").forEach(function(entry, i){
            entry.addEventListener("change", function() {
                    if(entry.checked == true) {
                        alert("cykelled PÅ");
                    }
                    if(entry.checked == false) {
                            alert("cykelled AV");
                    }
                });
            });
        dojo.query("#rastplats").forEach(function(entry, i){
            entry.addEventListener("change", function() {
                    if(entry.checked == true) {
                        restLayer.hide();
                    }
                        
                    if(entry.checked == false) {
                        restLayer.show();
                    }
                });
            });
        dojo.query("#sovplatser").forEach(function(entry, i){
            entry.addEventListener("change", function() {
                    if(entry.checked == true) {
                        sleepLayer.hide();
                    }
                        
                    if(entry.checked == false) {
                        sleepLayer.show();
                    }
                });
            });
     });   
   }



 function showCoordinates(evt) {
        var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
        dom.byId("info").innerHTML = mp.x.toFixed(3) + ", " + mp.y.toFixed(3);
    }
});
