/// <reference types="react" />
import * as React from "react";
export interface IFlexVGProps {
    src: string;
    width: number;
    height: number;
    color: string;
}
export interface IFlexVGState {
    contents: any;
}
export declare class FlexVG extends React.Component<IFlexVGProps, IFlexVGState> {
    constructor(props: any);
    componentDidMount(): void;
    render(): JSX.Element;
}
