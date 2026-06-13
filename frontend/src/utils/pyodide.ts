let pyodideInstance: any = null;
let isInitialized = false;

export const initPyodide = async (): Promise<any> => {
  if (isInitialized && pyodideInstance) {
    return pyodideInstance;
  }

  try {
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

    // @ts-ignore
    pyodideInstance = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/'
    });

    await pyodideInstance.loadPackage([
      'pandas',
      'numpy',
      'matplotlib',
      'micropip',
      'scipy',
      'scikit-learn'
    ]);

    // 使用 micropip 安装 seaborn
    await pyodideInstance.runPythonAsync(`
import micropip
await micropip.install('seaborn')
    `);

    isInitialized = true;
    console.log('Pyodide initialized successfully with pandas, numpy, matplotlib, scipy, scikit-learn, seaborn');

    return pyodideInstance;
  } catch (error) {
    console.error('Failed to initialize Pyodide:', error);
    throw error;
  }
};

export const isPyodideReady = (): boolean => {
  return isInitialized && pyodideInstance !== null;
};

export const getPyodideInstance = (): any => {
  return pyodideInstance;
};
