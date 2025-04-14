export type TextMessage = {
    type: "text";
    text: string;
};

export type AudioMessage = {
    type: "audio";
    audio: string; // base64
    voice?: string;
};

export type ImageMessage = {
    type: "image";
    format: "jpeg" | "png";
    input?: string;
    data: string[]; // base64[]
};

export interface GPSMessage {
  type: "gps";
  coords: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    altitude?: number | null;
    altitudeAccuracy?: number | null;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
}

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
    extract?: boolean;
    summarize?: number;
};

export type WebSocketMessage =
    | AudioMessage
    | ImageMessage
    | GPSMessage
    | TimeMessage
    | UIActionMessage
    | TextMessage
    | OrchestrateMessage;
