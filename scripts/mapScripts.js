var map;
var showStops;
var setBusPositions;
var makeBusMarkers;
var markers = new Array(4);
var positions = new Array(4);
var busInterval = 0;
var current = 0;

var showJSonData; // Read the function declaration!

require(["esri/map", "esri/layers/GraphicsLayer", "esri/graphic",
         "esri/InfoTemplate", "esri/geometry/Point", "esri/symbols/PictureMarkerSymbol",
            "dojo/domReady!", "esri/symbols/SimpleLineSymbol"],

    function(Map, GraphicLayer,
                Graphic,
                InfoTemplate, Point, PictureMarkerSymbol, SimpleLineSymbol)
    {
        map = new Map("mapDiv",
            {
                basemap: "streets",
                center: [17.151189, 60.676245],
                zoom: 6
            }
        );

        var graphics = new GraphicLayer();
        map.addLayer(graphics);

        showStops = function(stopsData) {
            var stopsLayer = new GraphicLayer();
            map.addLayer(stopsLayer);
            var pictureMarkerSymbol = new PictureMarkerSymbol("resources/stop.png", 8, 8);

            dojo.forEach(stopsData.stations, function(station) {
                var lng = station.x;
                var lat = station.y;

                var name = station.name.toString();
                var point = new Point({"x": lng, "y": lat, "spatialReference": {"wkid": 4326}});
                var graphic = new Graphic(point, pictureMarkerSymbol);

                var info = new InfoTemplate();
                info.setTitle("BusshÃ¥llplats");
                info.setContent(name);

                graphic.setInfoTemplate(info);
                map.graphics.add(graphic);
            });
        }


        showJSonData = function(dataSource, type, location, resolution) {
            console.log("2:1");
            var layer = new GraphicLayer();
            map.addLayer(layer);
            //var pictureMarkerSymbol = new PictureMarkerSymbol("resources/" + type + ".png", resolution, resolution);
            
            dojo.forEach(dataSource.posts, function(post) {
                console.log("2:X");
                var lng = post.longitude;
                var lat = post.latitude;
                var elevation = post.elevation;
                
                //var point = new Point({"x": lng, "y": lat});
                var line = {
                    type: "simple-line",
                    color: [120, 57, 49],
                    width: 20
                };

                var pointArray = [[16.897317, 60.288507], [16.897147, 60.288499], [16.89, 60.28]];

                var polyline = {
                    type: "polyline",
                    paths: [[16.897317, 60.288507], [16.897147, 60.288499], [16.89, 60.28]]
                    //paths: [pointArray]
                };
                console.log("polyline: " + polyline);

                var polylineGraphic = new Graphic({
                    geometry: polyline,
                    symbol: line
                });

                map.graphics.add(polylineGraphic);
                console.log("2:END");
            });
        }

        setTimeout(function() {
            console.log("1:1");
            getJSONData("BikingWalkingNoElevation", "", "Etapp_11_wgs84", false);
            console.log("1:2");
        }, 250);
        initButtons();
    }
);

// function getStopsData() {
//     var stopsData = { url: "data/points.json", handleAs: "json", content: {}, load: showStops};
//     dojo.xhrGet(stopsData);
// }

// "activity", the activity we want to take a look at, i.e. "Canoe". Start with capitalized letter, no spaces and each new word start with a capitalized letter.
// "location", the location we want to look at, i.e. "Gysinge". Same rule applie here as for activity
// "filename", the filename of the file we want to load, i.e. "PaddlaCafeUdden.gpx"
// function getPOIData(activity, location, filename, ext) {
//    var data = { url: "data/POI/"+ activity + "/" + location + "/" + filename}
// }

function getJSONData(activity, location, filename, POI){ 
    console.log("getJSONData:Start");
    if(POI) {

    } else {
        if(location == "")
            var data = { url: "data/" + activity + "/" + filename + ".json", handleAs: "json", content: {}, load: showJSonData};
    }
    dojo.xhrGet(data);
    console.log("getJSONData:End\n");
}

function initButtons() {
    require(["dojo/on"], function(on) {
        dojo.query(".panelButton").forEach(function(entry, i) {
            entry.addEventListener("click", function() {
                clearInterval(busInterval);
                //showBus(i);
            });
        });
    });
}

// function showBus(lineIndex) {
//     var linje = lineIndex;
//     for(var i = 0; i < 4; i++) {
//         if(i != linje) {
//             markers[i].hide();
//         } else {
//             markers[i].show();
//         }
//     }

//     current = positions[linje].length - 1;
//     busInterval = setInterval(function() {
//         if(current >= 0) {
//             markers[linje].setGeometry(
//                 new esri.geometry.Point(
//                     positions[linje][current][0],
//                     positions[linje][current][1]
//                 )
//             );
//             current--;
//             console.log(current);
//         }
//         if(current < 0) {
//             clearInterval(busInterval);
//         }
//     }, 250);
// }
