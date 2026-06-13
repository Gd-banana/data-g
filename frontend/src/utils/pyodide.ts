let pyodideInstance: any = null;
let isInitialized = false;
let loadingPromise: Promise<any> | null = null;

type ProgressCallback = (message: string, percent?: number) => void;

const PYODIDE_VERSION = 'v0.26.4';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`;

export const initPyodide = async (onProgress?: ProgressCallback): Promise<any> => {
  if (isInitialized && pyodideInstance) {
    onProgress?.('Python环境已就绪！', 100);
    return pyodideInstance;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      onProgress?.('正在加载 Pyodide 核心运行时...', 5);

      if (!document.getElementById('pyodide-script')) {
        const script = document.createElement('script');
        script.id = 'pyodide-script';
        script.src = `${PYODIDE_CDN}pyodide.js`;
        script.async = true;
        document.head.appendChild(script);

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Pyodide脚本加载失败，请检查网络'));
        });
      }

      // @ts-ignore
      if (typeof window.loadPyodide === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      onProgress?.('正在初始化 Python 运行时 (约10秒)...', 15);

      // @ts-ignore
      pyodideInstance = await window.loadPyodide({
        indexURL: PYODIDE_CDN,
      });

      onProgress?.('正在加载 pandas / numpy 基础库...', 35);

      await pyodideInstance.loadPackage(['pandas', 'numpy', 'micropip']);

      onProgress?.('正在加载 matplotlib 可视化库...', 55);

      await pyodideInstance.loadPackage(['matplotlib']);

      onProgress?.('正在加载 scipy / scikit-learn 科学计算库...', 75);

      try {
        await pyodideInstance.loadPackage(['scipy', 'scikit-learn']);
      } catch (e) {
        console.warn('scipy/scikit-learn 加载失败，部分高级功能不可用:', e);
      }

      onProgress?.('正在加载 seaborn 美化库...', 90);

      try {
        await pyodideInstance.runPythonAsync(`
import micropip
await micropip.install(['seaborn'])
`);
      } catch (e) {
        console.warn('seaborn 安装失败，可用 matplotlib 代替:', e);
      }

      isInitialized = true;
      onProgress?.('✅ 环境准备就绪！开始分析你的代码吧', 100);
      console.log('Pyodide initialized successfully');

      return pyodideInstance;
    } catch (error) {
      console.error('Failed to initialize Pyodide:', error);
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
};

export const preloadPyodide = () => {
  if (!isInitialized && !loadingPromise) {
    console.log('[Pyodide] 开始后台预加载...');
    initPyodide();
  }
};

export const isPyodideReady = (): boolean => {
  return isInitialized && pyodideInstance !== null;
};

export const getPyodideInstance = (): any => {
  return pyodideInstance;
};
