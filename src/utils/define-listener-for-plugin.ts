import {UiMessageData} from "../types/ui-message-data.type";

export function defineListenerForPlugin<T>(handler: (data: UiMessageData) => void) {
    return (event) => {
        handler(event)
    };
}