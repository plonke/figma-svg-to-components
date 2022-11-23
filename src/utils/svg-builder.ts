import tinycolor from "@ctrl/tinycolor";

export class SvgBuilder {
    public elem: Document;
    public defaultSize: { width: string, height: string }

    async init(props: { bytes: Uint8Array }) {
        const blob = new Blob([ props.bytes ], { type: 'image/svg+xml' });

        const parser = new DOMParser();
        this.elem = parser.parseFromString(await blob.text(), "image/svg+xml");

        this.initDefaultSize();
        this.setDynamicAttributes();

        return this;
    }

    private initDefaultSize() {
        const attrs = this.svg.attributes;

        let width = attrs.getNamedItem('width')?.value || '0';
        let height = attrs.getNamedItem('height')?.value || '0';

        width = ('' + width).trim() + 'px';
        height = ('' + height).trim() + 'px';

        this.defaultSize = { width, height };
    }

    public replaceGrayscaleFill(): boolean {
        const nodes = Array.from(this.elem.querySelectorAll('[fill]'));
        const nodesForReplace: Element[] = [];

        const isEveryGrayscaleOrNone = nodes.every(node => {
            const fill = node.attributes.getNamedItem('fill')?.value;
            const colorInstance = tinycolor(fill);

            if (!colorInstance.isValid) {
                return true;
            }

            if (colorInstance.toHsl().s === 0) {
                nodesForReplace.push(node);
                return true;
            }

            return false;
        })

        if (!isEveryGrayscaleOrNone || nodes.length === 0) return false;

        nodesForReplace.forEach(node => {
            node.classList.add('fill-current-color');
            node.removeAttribute('fill');
        })

        return true;
    }

    public replaceGrayscaleStroke(): boolean {
        const nodes = Array.from(this.elem.querySelectorAll('[stroke]'));
        const nodesForReplace: Element[] = [];

        const isEveryGrayscaleOrNone = nodes.every(node => {
            const stroke = node.attributes.getNamedItem('stroke')?.value;
            const colorInstance = tinycolor(stroke);

            if (!colorInstance.isValid) {
                return true;
            }

            if (colorInstance.toHsl().s === 0) {
                nodesForReplace.push(node);
                return true;
            }

            return false;
        })

        if (!isEveryGrayscaleOrNone || nodes.length === 0) return false;

        nodesForReplace.forEach(node => {
            node.classList.add('stroke-current-color');
            node.removeAttribute('stroke');
        })

        return true;
    }

    public removeContentClipPath() {
        const g = this.elem.querySelector('svg > g');
        if (!g) return;

        const clipPath = g.attributes.getNamedItem('clip-path');
        if (!clipPath) return;

        const clipPathId = clipPath.value.slice(5, -1);
        this.svg.querySelectorAll(`#${clipPathId}`).forEach(node => {
            node.parentNode?.removeChild(node);
        });

        g.removeAttribute('clip-path');
    }

    public showOverflow() {
        this.svg.setAttribute('overflow', 'visible');
    }

    public removeMask() {
        this.elem.querySelectorAll('mask').forEach(node => {
            node.parentNode?.removeChild(node);
        });

        this.elem.querySelectorAll('[mask]').forEach(node => {
            node.parentNode?.removeChild(node);
        });
    }

    public setDynamicAttributes() {
        this.svg.removeAttribute('width');
        this.svg.removeAttribute('height');

        this.svg.setAttribute(':width', 'widthAttr')
        this.svg.setAttribute(':height', 'heightAttr')

        return this;
    }

    public toString(): string {
        return this.elem.documentElement.outerHTML;
    }

    private get svg(): SVGElement {
        return this.elem.querySelector('svg') as SVGElement;
    }
}