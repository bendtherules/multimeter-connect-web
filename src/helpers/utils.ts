/**
 * Pads number/string with zeros and returns string of required length.
 * @example `zeroPad('101', 8)` - converts boolean (string) to 8-sized byte (string)
 * @param num Number to pad
 * @param length Total length after padding
 * @returns zeropadded string
 */
export function zeroPad(num: number | string, length: number): string {
  return String(num).padStart(length, "0");
}

/**
 * Gets bit value from binary string
 * @param str Binary string
 * @param bitIndex Index of bit to get
 * @returns bit value
 */
export function getBit(str: string, bitIndex: number): number {
  const value = str[bitIndex];
  if (value == undefined) {
    throw new RangeError(`Index:${bitIndex} not found in ${str}`);
  }
  return Number(value);
}

/**
 * Gets bit value as boolean from binary string
 * @param str Binary string
 * @param bitIndex Index of bit to get
 * @returns bit value as boolean
 */
export function getBitAsBoolean(str: string, bitIndex: number): boolean {
  return !!getBit(str, bitIndex);
}

export function hexStringToNumberArray(rawString: string) {
  return rawString.split("-").map((val) => parseInt(val, 16));
}

export function hexArrayToNumberArray(rawStrings: string[]) {
  return rawStrings.map((val) => parseInt(val, 16));
}
