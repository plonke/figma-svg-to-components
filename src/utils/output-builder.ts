import JSZip from '../../node_modules/jszip/dist/jszip.min.js';

export class OutputBuilder {
    zip: JSZip | undefined;
    file: Blob | undefined;
    fileName: string | undefined;

    multiple: boolean;

    constructor(props: { multiple: boolean }) {
        this.multiple = props.multiple;
        this.zip = new JSZip();
    }

    addFile(name: string, content: string) {
        if (this.multiple && this.zip) {
            this.zip.file(name, content);
        }

        if (!this.multiple) {
            this.file = new Blob([content], { type: 'text/plain' });
            this.fileName = name.split('/').pop();
        }
    }

    async download() {
        const content = await this.getBlob();

        const blobURL = window.URL.createObjectURL(content);
        const link = document.createElement('a');

        link.hidden = true;
        link.href = blobURL;
        link.download = this.multiple ? "assets.zip" : this.fileName as string;

        link.click()
    }

    async getBlob(): Promise<Blob> {
        if (this.multiple && this.zip) {
            return this.zip.generateAsync({ type: 'blob' })
        }

        if (!this.multiple && this.file) {
            return this.file;
        }

        return new Blob([''], { type: 'text/plain' })
    }
}