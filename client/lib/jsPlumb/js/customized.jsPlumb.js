/*
  this contains extra functionalities
  added to jsPlumb to suit our needs
*/

if (Meteor.isClient) {
  var instanceSetting = {
    Endpoint: ["Dot", {radius: 2}],
    HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
    ConnectionOverlays: [
      [ "Arrow", {
        location: 1,
        id: "arrow",
        length: 14,
        foldback: 0.8
      } ],
      [ "Label", {
        // label: "FOO",
        id: "label",
        cssClass: "aLabel"
      }]
    ],
    Container: "frame-items-container"
  };
  var commonAnchor = "Continuous";
  var commonStrokeStyle = {
    strokeStyle: "#5c96bc",
    lineWidth: 2,
    outlineColor: "transparent",
    outlineWidth: 4
  };
  var commonConnectorStyle = [ "StateMachine", { curviness: 20 } ];
  var commonSrcSettings = {
    filter: ".ep",
    anchor: "Continuous",
    connector: commonConnectorStyle,
    connectorStyle: commonStrokeStyle,
    maxConnections: 10,
    onMaxConnections: function (info, e) {
      alert("Maximum connections (" + info.maxConnections + ") reached");
    }
  };

  var commonTargetSettings = {
    dropOptions: { hoverClass: "dragHover" },
    anchor: "Continuous",
    allowLoopback: true
  }

  // expose it to global scope
  jsPlumbSettings = {
    instanceSetting: instanceSetting,
    commonStrokeStyle: commonStrokeStyle,
    commonAnchor: "Continuous",
    commonConnectorStyle: commonConnectorStyle,
    commonSrcSettings: commonSrcSettings,
    commonTargetSettings: commonTargetSettings
  }
}
