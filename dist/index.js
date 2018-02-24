var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from "react";
var FlexVG = /** @class */ (function (_super) {
    __extends(FlexVG, _super);
    function FlexVG(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            contents: '',
        };
        return _this;
    }
    FlexVG.prototype.componentDidMount = function () {
        var context = this;
        var client = new XMLHttpRequest();
        // Get the file context
        client.open('GET', this.props.src);
        // When everything is done
        client.onreadystatechange = function () {
            if (this.readyState == 4) {
                // Get the RAW content
                var rawSVG = client.responseText;
                // Remove all orccurences of the "fill" attribute
                var rawSVGNoFill = rawSVG.replace(/fill="#([0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F])"/gi, '');
                // Remove all XML header tags
                rawSVGNoFill = rawSVGNoFill.replace(/\<(\?xml|(\!DOCTYPE[^\>\[]+(\[[^\]]+)?))+[^>]+\>/g, '');
                // Create a new document parser
                // We will use this to inject styles into it
                var parser = new DOMParser();
                // Create the document
                var doc = parser.parseFromString(rawSVGNoFill, "text/xml");
                // Create a new style node for our fill colors
                var styleNode = document.createElement('style');
                // Set the type
                styleNode.type = "text/css";
                // Handle browser specific code here
                if (!!(window.attachEvent && !window.opera)) {
                    styleNode.styleSheet.cssText = "* { fill: " + context.props.color + " !important; }";
                }
                else {
                    var styleText = document.createTextNode("* { fill: " + context.props.color + " !important; }");
                    styleNode.appendChild(styleText);
                }
                // Insert the style node
                doc.firstChild.firstChild.parentNode.insertBefore(styleNode, doc.firstChild.firstChild);
                // For converting the nodes to plain text
                var serializer = new XMLSerializer();
                // Do it!
                var processedRawSVG = serializer.serializeToString(doc);
                // Convert it now to Base64 to use for our image tag
                var base64SVG = window.btoa(processedRawSVG);
                // Updated the contents of the file
                context.setState({ contents: base64SVG });
            }
        };
        // Make the request
        client.send();
    };
    FlexVG.prototype.render = function () {
        return React.createElement("img", { src: "data:image/svg+xml;base64," + this.state.contents, width: this.props.width, height: this.props.height });
    };
    return FlexVG;
}(React.Component));
export { FlexVG };
// ReactDOM.render(<FlexVG src="/demo.svg" width={500} height={500} color="red"/>, document.getElementById('app'));
