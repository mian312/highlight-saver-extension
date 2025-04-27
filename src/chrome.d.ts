// Type definitions for Chrome extension API
// This helps TypeScript understand the Chrome API

interface Chrome {
  storage: {
    local: {
      get: (keys: object | string | string[], callback: (items: any) => void) => void;
      set: (items: object, callback?: () => void) => void;
    };
  };
  runtime: {
    lastError?: {
      message: string;
    };
    onMessage: {
      addListener: (
        callback: (
          message: any,
          sender: any,
          sendResponse: (response?: any) => void
        ) => boolean | void
      ) => void;
    };
    onInstalled: {
      addListener: (callback: () => void) => void;
    };
    sendMessage: (
      message: any,
      responseCallback?: (response: any) => void
    ) => void;
  };
}

declare var chrome: Chrome;