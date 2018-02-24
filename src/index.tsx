import * as React from "react";
import * as ReactDOM from 'react-dom';

interface IFlexVGProps {
    src: string;
    width: number;
    height: number;
    color: string;
}

interface IFlexVGState {
    contents: any;
}

export default class FlexVG extends React.Component<IFlexVGProps, IFlexVGState> {
    constructor(props: any) {
        super(props);

        this.state = {
            contents: '',
        }
    }

    public componentDidMount() {
        const context = this;
        const client: any = new XMLHttpRequest();

        // Get the file context
        client.open('GET', this.props.src);

        // When everything is done
        client.onreadystatechange = function() {

            if (this.readyState == 4) {

                // Get the RAW content
                const rawSVG = client.responseText;

                // Remove all orccurences of the "fill" attribute
                let rawSVGNoFill = rawSVG.replace(/fill="#([0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F])"/gi, '');

                // Remove all XML header tags
                rawSVGNoFill = rawSVGNoFill.replace(/\<(\?xml|(\!DOCTYPE[^\>\[]+(\[[^\]]+)?))+[^>]+\>/g, '');

                // Create a new document parser
                // We will use this to inject styles into it
                const parser = new DOMParser();

                // Creat the document
                const doc = parser.parseFromString(rawSVGNoFill, "text/xml");

                // Create a new style node for our fill colors
                var styleNode = document.createElement('style');

                // Set the type
                styleNode.type = "text/css";

                // Handle browser specific code here
                if(!!(window.attachEvent && !window.opera)) {
                    styleNode.styleSheet.cssText = `* { fill: ${context.props.color} !important; }`;
                } else {
                    const styleText = document.createTextNode(`* { fill: ${context.props.color} !important; }`);
                    styleNode.appendChild(styleText);
                }

                // Insert the style node
                doc.firstChild.firstChild.parentNode.insertBefore(styleNode, doc.firstChild.firstChild);

                // For converting the nodes to plain text
                var serializer = new XMLSerializer();

                // Do it!
                const processedRawSVG = serializer.serializeToString(doc);

                // Convert it now to Base64 to use for our image tag
                const base64SVG = window.btoa(processedRawSVG);

                // Updated the contents of the file
                context.setState({ contents: base64SVG });
            }
        }

        // Make the request
        client.send();
    }

    public render() {
        return (
            <img src={"data:image/svg+xml;base64,"+this.state.contents} width={this.props.width} height={this.props.height}/>
        )
    }
}

ReactDOM.render(<FlexVG src="/demo.svg" width={500} height={500} color="red"/>, document.getElementById('app'));
