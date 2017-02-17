// NOTE - the sandbox_functions.js file has to be loaded prior to this one

// Script goes here
console.log("Hello from sandbox.js")
sayHello()

// This is the function that gets called by the template, set the arguments to cover all of the things that need to be passed

var jsPlumbsetup = function (nodes, links,linklabels) {
	console.log(nodes)
	console.log(links)

    // setup some defaults for jsPlumb.
    // instance is the jsPlumb base object
    var instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        Connector:[ "Flowchart", { stub: [0, 0], midpoint: 0.25 } ],//"Straight",
        Container: "#sandbox_container"
    });

    // set up the various types of links

    instance.registerConnectionType("basic", {
      anchor:"Continuous",
      paintStyle: { strokeStyle: "#777", lineWidth: 1, outlineColor: "transparent", outlineWidth: 14 },
      detachable : false,
      hoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 1 },
      overlays: [
          [ "Arrow", {
              location: 1,
              id: "arrow",
              length: 7.5,
              width:7.5,
              foldback: 0.8
          } ],
          //["Custom", { label: "Hello", id:"type" }]
      ],
      //Connector:"Straight ",
    });

    instance.registerConnectionType("input", {
      paintStyle: { strokeStyle: "#2e6f9a", lineWidth: 1, outlineColor: "transparent", outlineWidth: 14 },
      //hoverPaintStyle: {strokeStyle: "blue", lineWidth: 1 },
    });

    instance.registerConnectionType("output", {
      paintStyle: { strokeStyle: "#484c51", lineWidth: 1, outlineColor: "transparent", outlineWidth: 14 },
      //hoverPaintStyle: {strokeStyle: "blue", lineWidth: 1 },
    });

    instance.registerConnectionType("intermediate", {
      paintStyle: { strokeStyle: "#aaa", lineWidth: 1, outlineColor: "transparent", outlineWidth: 14 },
      overlays: [
      	[ "Label", { label: "Establish connection", id: "label", cssClass: "aLabel" }],
      ]
      //hoverPaintStyle: {strokeStyle: "blue", lineWidth: 1 },
    });

	// This function deals with connection events
	instance.bind("connection", function (info) {
	    
	    var sID = info.sourceId + "_" + info.targetId;
	    console.log('Dealing with a connection event (' + sID +')')

	    source = $('#' + info.sourceId)
	    target = $('#' + info.targetId)

	    var labelText = linklabels[sID];

	    //console.log(linklabels);
	    console.log(labelText);
	    if(typeof labelText == 'undefined'){
	      console.log('doesnt have a label already');
	      labelText = 'No Label'
	  	}

	    info.connection.getOverlay("label").setLabel(labelText);

	    //uncomment when labelShow and lableHide have been rewritten
	    //info.connection.getOverlay("label").hide();
	    info.connection.bind("mouseover", function(conn){
	      labelShow(conn);
	    });

	    info.connection.bind("mouseout", function(conn){
	      labelHide(conn);
	    });
	});




    // This function displays the existing nodes in the flowsheet
    // name = name
    // type = transformation/input/output
    // id = uuid
    // initX = integer (initial x value)
    // initY = integer (initial y value)
    

    for(i=0;i<nodes.length;i++){
        initNode(newNodeExternal(nodes[i]['name'],nodes[i]['type'],nodes[i]['id'],nodes[i]['initX'],nodes[i]['initY'], instance), instance);
    };


    console.log(links)
    // This function creates all of the links
    for (i=0;i<links.length;i++){

              var connection = instance.connect({
                 source: links[i]['sourceID'].split(' ').join('_'),
                 target: links[i]['targetID'].split(' ').join('_'),
                 type:"basic " +links[i]['type'],
                 data:{'connection_type':links[i]['type'], 'connection_amount':links[i]['amount']},

               });

               //console.log(connection);

              connection.unbind("mouseover", function(conn){

                labelShow(conn);
              });
              connection.unbind("mouseout", function(conn){
                labelHide(conn);
              });
            };


    //Time to set up the buttons
    //First the saveModel button
    $('#saveModel').click(function(e){
    	console.log('saving the model');
    	saveModel();
    });

    //This one is the add process button
    $('#addProcess').click(function(e){
	  console.log("Add a new process");
	  addProcess(instance);
	})

	$('#echoButton').click(function(e){
		console.log('the server says...');
		echo()
	})
	
} // end of jsPlumbSetup





