export interface IElectronAPI {
    getTracks: () => Promise<string[]>,
    exit: () => void,
    settings: () => void,
    minimize: () => void,
    saveVolume: (volume: number) => void,
    getSavedVolume: () => Promise<number>,
};

declare global {
    interface Window {
        api: IElectronAPI,
    }
}