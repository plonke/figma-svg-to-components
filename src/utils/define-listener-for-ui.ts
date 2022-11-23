import {UiMessageData} from "../types/ui-message-data.type";

interface IDto { data?: { pluginMessage: UiMessageData }}

export function defineListenerForUi(handler: (event: IDto) => void) {
    return (event) => {
        handler(event)
    };
}