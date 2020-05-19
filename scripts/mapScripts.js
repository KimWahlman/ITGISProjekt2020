var map;
var markers = new Array(4);
var positions = new Array(4);
var showJSONData;
var flushMap;
var createPOI;
var canCreatePOI = false;
var jsonFiles = new Array();
var elevations = false;
var desc = new Array();
var textDesc = new String();
var containsDescription = false;
var newPOIs = new Array();
// ... kod


function runAfterPageLoad(resource) {
    return new Promise(resolve => {
        setTimeout(() => {
            fetch("data/" + resource + ".json").then(function(resp) {
                return resp.json();
            }).then(function(data) {
                jsonFiles = data;
            });
            resolve('resolved');
        }, 500);
    });
}

async function loadArray(resource) {
    jsonFiles = await runAfterPageLoad(resource);
}


require(["esri/map", "esri/layers/GraphicsLayer", "esri/graphic",
         "esri/InfoTemplate", "esri/geometry/Point", "esri/symbols/PictureMarkerSymbol",
         "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/geometry/Polyline", 
         "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/geometry/Polygon", 
         "dojo/on", "esri/toolbars/draw", "esri/geometry/webMercatorUtils", 
         "dojo/dom", "dojo/domReady!"],

    function(Map, GraphicLayer, Graphic,
             InfoTemplate, Point, PictureMarkerSymbol, 
             SimpleLineSymbol, SimpleMarkerSymbol, Polyline, 
             SimpleFillSymbol, Color, Polygon,
             On, Draw, webMercatorUtils, dom)
    {
        map = new Map("mapDiv",
            {
                basemap: "osm",
                //center: [17.151189, 60.676245],
                //center: [17.923597924, 60.208251505],
                center: [17.422794156, 60.307942170],
                zoom: 9
            }
        );

        map.on("load", function() {     //LADDAR X/Y PÅ MUSKOORDINATER
            map.on("mouse-move", showCoordinates);
            map.on("mouse-drag", showCoordinates);
        });


        var baseLayer = new GraphicLayer();
        var restLayer = new GraphicLayer();
        var sleepLayer = new GraphicLayer();
        map.addLayer(restLayer);
        map.addLayer(baseLayer);
        map.addLayer(sleepLayer);
        getPoiData();
        initButtons();

        loadArray("data");
        initButtons();


        var newPOI = new PictureMarkerSymbol("resources/POIicon.png",30,30);
        ///////////////////////////////////////////////////////////////////

        var graphics = new GraphicLayer();
        var trails = new GraphicLayer();

        map.addLayer(graphics);
        map.addLayer(trails);
        
        showJSONData = function(dataSource) {
            var color = new Array();
            color[0] = Math.floor(Math.random() * 256);
            color[1] = Math.floor(Math.random() * 256);
            color[2] = Math.floor(Math.random() * 256);

            var layers = new GraphicLayer();
            
            map.addLayer(layers);
            var pointArray = new Array();
            var elevationArray = new Array();

            dojo.forEach(dataSource.posts, function(marker) {
                    var lng = marker.longitude;
                    var lat = marker.latitude;
                    pointArray.push([lng, lat]);

                    if(typeof marker.elevation !== 'undefined') {
                        var e = marker.elevation;
                        elevationArray.push(e);
                        elevations = true;
                    }
            });

            if(typeof dataSource.desc !== 'undefined') {
                textDesc = dataSource.desc;
            }
               
            for(var x = 0; x < pointArray.length; x++) {
                var pictureSymbol = new PictureMarkerSymbol("resources/hiking.png", 16, 16);
                
                if(x == 0 || x == pointArray.length - 1) {
                    if(x == 0) {
                        pictureSymbol = new PictureMarkerSymbol("resources/start.png", 16, 16);
                    }
                    if(x == pointArray.length - 1) {
                        pictureSymbol = new PictureMarkerSymbol("resources/stop.png", 16, 16);
                    }
                    
                    var point = new Point({"x": pointArray[x][0], "y": pointArray[x][1], "spatialReference": {"wkid": 4326}});
                    var graphic = new Graphic(point, pictureSymbol);

                    if(typeof textDesc !== 'undefined' && x == 0) {
                        pictureSymbol = new PictureMarkerSymbol("resources/poi.png", 16, 16);
                        var info = new InfoTemplate();
                        info.setTitle("About " + dataSource.name + ":");
                        info.setContent(textDesc);
                        graphic.setInfoTemplate(info);
                    }
                    map.graphics.add(graphic);
                }

                if(elevations && x % 10 == 0 && x != 0 ) {
                    pictureSymbol = new PictureMarkerSymbol("resources/elevationBall.png", 7, 7);
                    var info = new InfoTemplate();
                    info.setTitle("Elevation: " + x );
                    info.setContent(elevationArray[x] + " meter över havet?");
                    var point = new Point({"x": pointArray[x][0], "y": pointArray[x][1], "spatialReference": {"wkid": 4326}});
                    var graphic = new Graphic(point, pictureSymbol);
                    graphic.setInfoTemplate(info);
                    map.graphics.add(graphic);
                }
            }

            var symbol = new SimpleLineSymbol().setColor(new Color([color[0], color[1], color[2]]));
            symbol.setWidth(3);

            var outline = new SimpleLineSymbol().setColor(new Color([0, 0, 0]));
            outline.setWidth(6);

            var polyline = new Polyline([pointArray]);

            var polyGraphic = new Graphic(polyline, symbol);
            var outlineGraphic = new Graphic(polyline, outline);

            graphics.add(outlineGraphic);
            graphics.add(polyGraphic);

            elevations = false;
            containsDescription = false;
            desc = 0;
            descSet = false;
        }    

        flushMap = function() {
            graphics.clear();
            map.graphics.clear();
            dojo.forEach(newPOIs, function(p) {
                graphics.add(p);
            });
            //flushPOIs();
        }

        function flushPOIs() {
            console.log("tömmer...");
            newPOIs = new Array();
        }

        // Kod från Swaginator
        createPOI = function() {
            On(map, "click", function(evt){
                var mapPoint = esri.geometry.webMercatorToGeographic(evt.mapPoint);
                var lat = mapPoint.x;
                var lon= mapPoint.y;
                var point = new Graphic(new Point(lat, lon), newPOI);
                var newPOIType = prompt("Vad är det här för typ av POI?");
                var newPOIInfo = prompt("Skriv information om platsen");
                point.setInfoTemplate(new esri.InfoTemplate(newPOIType, newPOIInfo));
                graphics.add(point);   
                newPOIs.push(point);
            });
        }

        var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([255,0,0]),3);

        function initToolbar() {
            toolbar = new Draw(map, { showTooltips: true });
            toolbar.activate(Draw.POLYLINE);
            toolbar.on("draw-end", addToMap);
        }
    
        function addToMap(evt) {
            toolbar.deactivate();
            var symbol = sls;
            var graphic = new Graphic(evt.geometry, symbol);
            map.graphics.add(graphic);
        }
        ////////////////////////////////////////////////////////////////////////////
    

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Petters kod
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
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
        // Swaginators kod
        require(["dojo/on"], function(on){
            dojo.query("#skapa").forEach(function(entry, i){
                entry.addEventListener("click", function() {
                });
            });
    
            dojo.query("#skapapolyline").forEach(function(entry, i){
                entry.addEventListener("click", function() {
                    initToolbar();
                });
            });
        });

        dojo.query("#taBort").forEach(function(entry, i){
            entry.addEventListener("click", function() {
                removePoi();
            });
        }); 

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

function getJSONData(filename, POI){ 
    if(POI) {
        // Not implemented yet
    } else {
        var data = { url: filename, handleAs: "json", content: {}, load: showJSONData};
    }
    dojo.xhrGet(data);
}

function showData(dataToShow, elevation) {
    
    /* Clear anything that has been drawn on the map. */
    var flush = { url: "", content: {}, load: flushMap };
    dojo.xhrGet(flush);
    /**************************************************/

    if(dataToShow === "hiking") {
        if(elevation) {
            for(x = 0; x < jsonFiles['Hiking']['WithElevation']['files'].length; x++)
                getJSONData(jsonFiles['Hiking']['WithElevation']['fileLocation'] + jsonFiles['Hiking']['WithElevation']['files'][x]['name'] + ".json");
            console.log("Loaded hiking with elevation..."); 
        }
        else {
            for(x = 0; x < jsonFiles['Hiking']['NoElevation']['files'].length; x++)
                getJSONData(jsonFiles['Hiking']['NoElevation']['fileLocation'] + jsonFiles['Hiking']['NoElevation']['files'][x]['name'] + ".json");
            console.log("Loaded hiking without elevation..."); 
        }
           
    }
    if(dataToShow === "biking") {
        if(elevation) {
            for(x = 0; x < jsonFiles['Biking']['WithElevation']['files'].length; x++)
                getJSONData(jsonFiles['Biking']['WithElevation']['fileLocation'] + jsonFiles['Biking']['WithElevation']['files'][x]['name'] + ".json");
            console.log("Loaded biking with elevation..."); 
        }
        else {
            for(x = 0; x < jsonFiles['Biking']['NoElevation']['files'].length; x++)
                getJSONData(jsonFiles['Biking']['NoElevation']['fileLocation'] + jsonFiles['Biking']['NoElevation']['files'][x]['name'] + ".json");
            console.log("Loaded biking without elevation...");
        }  
    }

    if(dataToShow === "canoeing") {
        for(x = 0; x < jsonFiles['Canoeing']['files'].length; x++)
            getJSONData(jsonFiles['Canoeing']['fileLocation'] + jsonFiles['Canoeing']['files'][x]['name'] + ".json");
        console.log("Loaded canoeing..." + jsonFiles['Canoeing']['fileLocation'] + jsonFiles['Canoeing']['files'][x]['name'] + ".json");
    }
}
