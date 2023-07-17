export const DEFAULT_SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb";
export const DEFAULT_CHARACTERISTIC_UUID =
  "0000fff4-0000-1000-8000-00805f9b34fb";

// eslint-disable-next-line max-len
export const XOR_KEYS = [
  parseInt("41", 16),
  parseInt("21", 16),
  parseInt("73", 16),
  parseInt("55", 16),
  parseInt("a2", 16),
  parseInt("c1", 16),
  parseInt("32", 16),
  parseInt("71", 16),
  parseInt("66", 16),
  parseInt("aa", 16),
  parseInt("3b", 16),
];

export const CHAR_MAP = {
  "0": [1, 1, 1, 0, 1, 1, 1].join(""),
  "1": [0, 0, 1, 0, 0, 1, 0].join(""),
  "2": [1, 0, 1, 1, 1, 0, 1].join(""),
  "3": [1, 0, 1, 1, 0, 1, 1].join(""),
  "4": [0, 1, 1, 1, 0, 1, 0].join(""),
  "5": [1, 1, 0, 1, 0, 1, 1].join(""),
  "6": [1, 1, 0, 1, 1, 1, 1].join(""),
  "7": [1, 0, 1, 0, 0, 1, 0].join(""),
  "8": [1, 1, 1, 1, 1, 1, 1].join(""),
  "9": [1, 1, 1, 1, 0, 1, 1].join(""),
  A: [1, 1, 1, 1, 1, 1, 0].join(""),
  U: [0, 0, 0, 0, 1, 1, 1].join(""),
  T: [0, 1, 0, 1, 1, 0, 1].join(""),
  O: [0, 0, 0, 1, 1, 1, 1].join(""),
  L: [0, 1, 0, 0, 1, 0, 1].join(""), // Part of "OL" text
};

export type KNOWN_CHARS = keyof typeof CHAR_MAP;
export type KNOWN_UNKNOWN_CHARS = KNOWN_CHARS | undefined;

export const LCD_CHAR_BIT_POSITIONS = [
  [24, 25, 36, 37, 26, 38, 39], // 0
  [32, 33, 44, 45, 34, 46, 47], // 1
  [40, 41, 52, 53, 42, 54, 55], // 2
  [48, 49, 60, 61, 50, 62, 63], // 3
];

export const LCD_DECIMAL_POINT_BIT_POSITIONS = [35, 43, 51];

export const LCD_SYMBOL_BIT_POSITION_MAP = {
  Minus: 27,
  Buzz: 28,
  Relative: 30,
  BatteryLow: 31,
  Diode: 56,
  Celsius: 57,
  Fahrenheit: 58,
  Hold: 59,
  NanoFarad: 64,
  MicroFarad: 65,
  MilliFarad: 66,
  Farad: 67,
  AC: 68,
  Percentage: 69,
  Min: 70,
  Max: 71,
  Ampere: 72,
  DC: 73,
  MilliVolt: 74,
  Volt: 75,
  MegaOhm: 76,
  KiloOhm: 77,
  Ohm: 78,
  Hertz: 79,
  MilliAmp: 84,
  MicroAmp: 85,
  Auto: 87,
};

export type KNOWN_SYMBOLS = keyof typeof LCD_SYMBOL_BIT_POSITION_MAP;

export const AUTO_RECONNECT_INTERVAL_MS = 5000;
