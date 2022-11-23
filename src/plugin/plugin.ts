import {UiMessageEnum} from "../enums/ui-message.enum";
import {UiMessageHandler} from "../types/ui-message-handler.type";
import {DownloadZipItem, GenerateSvgOptions, UiMessageData} from "../types/ui-message-data.type";
import {defineListenerForPlugin} from "../utils/define-listener-for-plugin";

function closePlugin() {
  figma.closePlugin()
}

const prepareNodesToBytes: UiMessageHandler = async (data) => {
  const payload = data.payload as GenerateSvgOptions;
  const { selection: nodes } = figma.currentPage
  const items: DownloadZipItem[] = [];
  const names: string[] = [];

  for (let node of nodes) {
    const { name, clipsContent } = node as FrameNode;

    if (names.includes(name)) {
      figma.notify(`Selected frames has same name: "${name}"`);
      return;
    }

    names.push(name);

    const bytes = await node.exportAsync({ format: 'SVG' })
    items.push({
      name,
      bytes,
      settings: {
        removeMask: payload.removeMask,
        removeFrameClipPath: payload.removeFrameClipPath,
        replaceGrayscaleFill: payload.replaceGrayscaleFill,
        replaceGrayscaleStroke: payload.replaceGrayscaleStroke,
      }
    })
  }

  const message: UiMessageData = {
    type: UiMessageEnum.DOWNLOAD_SVG,
    payload: { items }
  };

  figma.ui.postMessage(message);
}

const map: Partial<Record<UiMessageEnum, UiMessageHandler>> = {
  [UiMessageEnum.GENERATE_SVG]: prepareNodesToBytes,
  [UiMessageEnum.CLOSE]: closePlugin,
};

figma.showUI(__html__, {width: 460, height: 250 });

figma.ui.onmessage = defineListenerForPlugin(data => {
  const { type } = data;

  if (!type || !map[type]) return;

  map[type]?.(data);
});
