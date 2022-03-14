export = Rainbow;
declare function Rainbow(): void;
declare class Rainbow {
    setSpectrum: (...args: string[]) => Rainbow;
    setSpectrumByArray: (array: string[]) => Rainbow;
    colourAt: (number: number) => string;
    colorAt: (number: number) => string;
    setNumberRange: (minNumber: number, maxNumber: number) => Rainbow;
}
