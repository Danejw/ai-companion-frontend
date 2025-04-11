export type TextMessage = {
    type: "text";
    text: string;
    extract?: boolean;
    summarize?: number;
};

export type AudioMessage = {
    type: "audio";
    audio: string; // base64
    voice?: string;
    extract?: boolean;
    summarize?: number;
};

export type ImageMessage = {
    type: "image";
    format: "jpeg" | "png";
    data: string; // base64
};

export type GPSMessage = {
    type: "gps";
    latitude: number;
    longitude: number;
    accuracy?: number;
};

export type TimeMessage = {
    type: "time";
    timestamp: string;
    timezone: string;
};

export type UIActionMessage = {
    type: "ui_action";
    action: string;
    target: string;
    params?: Record<string, string>;
};

export type OrchestrateMessage = {
    type: "orchestrate";
    user_input: string;
};

export type WebSocketMessage =
    | AudioMessage
    | ImageMessage
    | GPSMessage
    | TimeMessage
    | UIActionMessage
    | TextMessage
    | OrchestrateMessage;
