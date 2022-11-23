import {UiMessageEnum} from "../enums/ui-message.enum";
import {DownloadZipOptions, UiMessageData} from "../types/ui-message-data.type";
import {defineListenerForUi} from "../utils/define-listener-for-ui";
import {SvgBuilder} from "../utils/svg-builder";
import {VueBuilder} from "../utils/vue-builder";
import {ReportBuilder} from "../utils/report-builder";
import {OutputBuilder} from "../utils/output-builder";

document.getElementById('create')!.onclick = () => {
    const rm = document.getElementById('remove-mask') as HTMLInputElement;
    const rcp = document.getElementById('remove-clip-path') as HTMLInputElement;
    const fcc = document.getElementById('fill-current-color') as HTMLInputElement;
    const scc = document.getElementById('stroke-current-color') as HTMLInputElement;

    const data: UiMessageData = { type: UiMessageEnum.GENERATE_SVG, payload: {
        removeMask: rm.checked,
        removeFrameClipPath: rcp.checked,
        replaceGrayscaleFill: fcc.checked,
        replaceGrayscaleStroke: scc.checked,
    }};

    parent.postMessage({ pluginMessage: data }, '*')
}

onmessage = defineListenerForUi(async event => {
    if (!event?.data?.pluginMessage) return;

    const data = event.data.pluginMessage;

    if (data.type === UiMessageEnum.DOWNLOAD_SVG) {
        const { items } = data.payload as DownloadZipOptions;
        const multipleFiles = items.length > 1;
        const output = new OutputBuilder({ multiple: multipleFiles });
        const report = new ReportBuilder();

        for (let { bytes, name, settings } of items) {
            const svg = await new SvgBuilder().init({ bytes });

            if (settings.replaceGrayscaleFill) {
                const isFillReplaced = svg.replaceGrayscaleFill();
                report.addFill(isFillReplaced, name);
            }

            if (settings.replaceGrayscaleStroke) {
                const isStrokeReplaced = svg.replaceGrayscaleStroke();
                report.addStroke(isStrokeReplaced, name);
            }

            if (settings.removeFrameClipPath) {
                svg.removeContentClipPath();
                svg.showOverflow();
            }

            if (settings.removeMask) {
                svg.removeMask();
            }

            const component = new VueBuilder({ name, svg });

            output.addFile(component.getFileName(), component.toString());
        }

        if (multipleFiles) {
            output.addFile('report.txt', report.toString());
        }

        try {
            await output.download();
        } catch (e) {
            console.error(e)
        }
    }
})
