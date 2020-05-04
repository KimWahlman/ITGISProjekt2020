var map;
var markers = new Array(4);
var positions = new Array(4);
var showJSONData;
var flushMap;

require(["esri/map", "esri/layers/GraphicsLayer", "esri/graphic",
         "esri/InfoTemplate", "esri/geometry/Point", "esri/symbols/PictureMarkerSymbol",
         "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/geometry/Polyline", "esri/symbols/SimpleFillSymbol", "esri/Color", "esri/geometry/Polygon", "dojo/domReady!"],

    function(Map, GraphicLayer, Graphic,
                InfoTemplate, Point, PictureMarkerSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Polyline, SimpleFillSymbol, Color, Polygon)
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

        var graphics = new GraphicLayer();
        map.addLayer(graphics);

        showJSONData = function(dataSource) {
            var color = new Array();
            color[0] = Math.floor(Math.random() * 256);
            color[1] = Math.floor(Math.random() * 256);
            color[2] = Math.floor(Math.random() * 256);

            var layers = new GraphicLayer();
            map.addLayer(layers);
            var pointArray = new Array();

            dojo.forEach(dataSource.posts, function(marker) {
                    var lng = marker.longitude;
                    var lat = marker.latitude;
                    pointArray.push([lng, lat]);
            });

            for(var x = 0; x < pointArray.length; x++) {
                var pictureSymbol = new PictureMarkerSymbol("resources/hiking.png", 16, 16);
                
                if(x == 0 || x == pointArray.length - 1) {
                    if(x == 0) {
                        pictureSymbol = new PictureMarkerSymbol("resources/start.png", 16, 16);
                    }
                    if(x == pointArray.length - 1) {
                        pictureSymbol = new PictureMarkerSymbol("resources/stop.png", 16, 16);
                    }
                    var info = new InfoTemplate();
                    info.setTitle("Position:");
                    info.setContent("x: " + pointArray[x][0] + "\ny: " + pointArray[x][1] + "\n");

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
        }    

        flushMap = function() {
            graphics.clear();
            map.graphics.clear();
        }
    }
);

function getJSONData(activity, filename, POI){ 
    if(POI) {
        // Not implemented yet
    } else {
       
        var data = { url: "data/" + activity + "/" + filename + ".json", handleAs: "json", content: {}, load: showJSONData};
    }
    dojo.xhrGet(data, "location");
}

function showData(dataToShow) {
    
    /* Clear anything that has been drawn on the map. */
    var flush = { url: "", content: {}, load: flushMap };
    dojo.xhrGet(flush);
    /**************************************************/

    if(dataToShow === "hiking") {
        var x = 11;
        //setTimeout(function() {
            for(;x < 23; x++)
                getJSONData("BikingWalkingNoElevation", "Etapp_"+x+"_wgs84", false);
        //}, 50);
    }
    // rename files for biking?
    if(dataToShow === "biking") {
        getJSONData("BikingWalkingNoElevation", "test", false);
    }
}