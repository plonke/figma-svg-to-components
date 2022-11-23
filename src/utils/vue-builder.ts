import {SvgBuilder} from "./svg-builder";
import {toKebabCase} from "./to-kebab-case";
import toPascalCase from "./to-pascal-case";
import format from '../../node_modules/vue-formatter';

export class VueBuilder {
    public name;
    public svgBuilder: SvgBuilder;

    constructor(props: { name: string, svg: SvgBuilder }) {
        this.name = props.name;
        this.svgBuilder = props.svg;
    }

    public getFileName(): string {
        const groups = this.name.split('/');

        const path = groups.slice(0, -1).join('/');
        const name = (path ? path + '/' : '') + this.name.replace(/\//g, '-');

        return toKebabCase(name) + '.vue'
    }

    public getComponentName(): string {
        return toPascalCase(this.name.replace(/\//g, '-'));
    }

    public toString(): string {
        const string = this.getTemplateString().replace(/\n/g, '') + this.getScriptString();
        return format(string);
    }

    private getTemplateString(): string {
        return `<template>${this.svgBuilder.toString()}</template>`
    }

    private getScriptString(): string {
        const defaultSize = this.svgBuilder.defaultSize;

        return `<scriptTag> 
                export default { 
                    name: '${this.getComponentName()}', 
                    
                    props: { 
                        width: { 
                            type: String,
                            required: false
                        },
                        
                        height: {
                            type: String,
                            required: false
                        },
                        
                        size: {
                            type: String,
                            required: false
                        }
                    },
                    
                    computed: {
                        widthAttr() {
                            if (this.height) return undefined;
                            if (this.size) return this.size;
                            return this.width || "${defaultSize.width}";
                        },
                        
                        heightAttr() {
                            if (this.width) return undefined;
                            if (this.size) return this.size;
                            return this.height || "${defaultSize.height}";
                        }
                    }
                }
            </scriptTag>`
            .replace(/scriptTag/g, 'script')
    }
}