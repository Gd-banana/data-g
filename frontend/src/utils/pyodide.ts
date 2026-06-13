let pyodideInstance: any = null;
let isInitialized = false;
let loadingPromise: Promise<any> | null = null;

type ProgressCallback = (message: string) => void;

export const initPyodide = async (onProgress?: ProgressCallback): Promise<any> => {
  if (isInitialized && pyodideInstance) {
    onProgress?.('Python环境已就绪！');
    return pyodideInstance;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      onProgress?.('正在加载 Pyodide 核心...');

      if (!document.getElementById('pyodide-script')) {
        const script = document.createElement('script');
        script.id = 'pyodide-script';
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js';
        document.head.appendChild(script);

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide'));
        });
      }

      // @ts-ignore
      if (typeof window.loadPyodide === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      onProgress?.('正在初始化 Python 运行时...');

      // @ts-ignore
      pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/'
      });

      onProgress?.('正在安装数据分析库 (pandas, numpy)...');

      await pyodideInstance.loadPackage([
        'pandas',
        'numpy',
        'matplotlib',
        'micropip',
      ]);

      onProgress?.('正在安装科学计算库 (scipy, scikit-learn)...');

      await pyodideInstance.loadPackage([
        'scipy',
        'scikit-learn'
      ]);

      onProgress?.('正在安装可视化库 (seaborn)...');

      // 使用 micropip 安装 seaborn
      try {
        await pyodideInstance.runPythonAsync(`
import micropip
await micropip.install(['seaborn'])
        `);
      } catch (e) {
        console.warn('Seaborn installation failed:', e);
      }

      isInitialized = true;
      onProgress?.('环境准备就绪！');
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

export const isPyodideReady = (): boolean => {
  return isInitialized && pyodideInstance !== null;
};

export const getPyodideInstance = (): any => {
  return pyodideInstance;
};
