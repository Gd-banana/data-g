declare module '*.worker?worker' {
  const worker: { new (): Worker };
  export default worker;
}

declare module 'monaco-editor/esm/vs/editor/editor.worker?worker' {
  const worker: { new (): Worker };
  export default worker;
}

/// <reference types="vite/client" />
