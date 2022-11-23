import { UiMessageEnum } from "../enums/ui-message.enum";

export type UiMessageData = {
    type: UiMessageEnum;
    payload: GenerateSvgOptions | DownloadZipOptions
}

export type GenerateSvgOptions = {
    removeFrameClipPath: Boolean,
    removeMask: Boolean,
    replaceGrayscaleFill: Boolean,
    replaceGrayscaleStroke: Boolean,
}

export type DownloadZipOptions = {
    items: DownloadZipItem[]
};

export type DownloadZipItem = {
    name: string;
    bytes: Uint8Array;
    settings: {
        removeMask: Boolean,
        removeFrameClipPath: Boolean,
        replaceGrayscaleFill: Boolean,
        replaceGrayscaleStroke: Boolean,
    }
}