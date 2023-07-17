import {
  CHAR_MAP,
  KNOWN_CHARS,
  KNOWN_UNKNOWN_CHARS,
  LCD_CHAR_BIT_POSITIONS,
  LCD_DECIMAL_POINT_BIT_POSITIONS,
  LCD_SYMBOL_BIT_POSITION_MAP,
  XOR_KEYS,
} from "./constants";
import { getBit, getBitAsBoolean, zeroPad } from "./utils";

export function parseDMMBuffer(bufferAsNumberArray: number[]) {
  const partsXOR = bufferAsNumberArray.map(
    (rawVal, index) => rawVal ^ XOR_KEYS[index],
  );

  const partsBin = partsXOR.map((val) => val.toString(2));
  const partsBinPadded = partsBin.map((t) => zeroPad(t, 8));

  const parsedBooleanString = partsBinPadded.join("");

  return {
    parsedBooleanString,
    getBitAsBoolean(binIndex: number) {
      return getBitAsBoolean(this.parsedBooleanString, binIndex);
    },
    char0: readCharacter(parsedBooleanString, 0),
    char1: readCharacter(parsedBooleanString, 1),
    char2: readCharacter(parsedBooleanString, 2),
    char3: readCharacter(parsedBooleanString, 3),
    decimalPointIndex: getDecimalPointIndex(parsedBooleanString),
    isMinus: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Minus,
    ),
    isBuzz: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Buzz,
    ),
    isRelative: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Relative,
    ),
    isBatteryLow: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.BatteryLow,
    ),
    isDiode: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Diode,
    ),
    isHold: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Hold,
    ),
    isAuto: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Auto,
    ),
    isMin: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Min,
    ),
    isMax: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Max,
    ),
    isAC: getBitAsBoolean(parsedBooleanString, LCD_SYMBOL_BIT_POSITION_MAP.AC),
    isDC: getBitAsBoolean(parsedBooleanString, LCD_SYMBOL_BIT_POSITION_MAP.DC),
    isCelsius: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Celsius,
    ),
    isFahrenheit: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Fahrenheit,
    ),
    isNanoFarad: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.NanoFarad,
    ),
    isMicroFarad: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.MicroFarad,
    ),
    isMilliFarad: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.MilliFarad,
    ),
    isFarad: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Farad,
    ),
    isPercentage: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Percentage,
    ),
    isHertz: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Hertz,
    ),
    isMilliVolt: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.MilliVolt,
    ),
    isVolt: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Volt,
    ),
    isMegaOhm: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.MegaOhm,
    ),
    isKiloOhm: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.KiloOhm,
    ),
    isOhm: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Ohm,
    ),
    isMilliAmp: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.MilliAmp,
    ),
    isMicroAmp: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.MicroAmp,
    ),
    isAmpere: getBitAsBoolean(
      parsedBooleanString,
      LCD_SYMBOL_BIT_POSITION_MAP.Ampere,
    ),
    get isFullAuto() {
      return (
        this.char0 === "A" &&
        this.char1 === "U" &&
        this.char2 === "T" &&
        this.char3 === "O"
      );
    },
    get unit() {
      if (this.isCelsius) {
        return "Celsius";
      } else if (this.isFahrenheit) {
        return "Fahrenheit";
      } else if (this.isNanoFarad) {
        return "NanoFarad";
      } else if (this.isMicroFarad) {
        return "MicroFarad";
      } else if (this.isMilliFarad) {
        return "MilliFarad";
      } else if (this.isFarad) {
        return "Farad";
      } else if (this.isPercentage) {
        return "Percentage";
      } else if (this.isHertz) {
        return "Hertz";
      } else if (this.isMilliVolt) {
        return "MilliVolt";
      } else if (this.isVolt) {
        return "Volt";
      } else if (this.isMegaOhm) {
        return "MegaOhm";
      } else if (this.isKiloOhm) {
        return "KiloOhm";
      } else if (this.isOhm) {
        return "Ohm";
      } else if (this.isMilliAmp) {
        return "MilliAmp";
      } else if (this.isMicroAmp) {
        return "MicroAmp";
      } else if (this.isAmpere) {
        return "Ampere";
      }
    },
    get value() {
      const parsedChars = [
        this.char0 && parseInt(this.char0),
        this.char1 && parseInt(this.char1),
        this.char2 && parseInt(this.char2),
        this.char3 && parseInt(this.char3),
      ];
      let value: number | undefined = undefined;
      if (
        parsedChars.every(
          (tmpChar) => typeof tmpChar === "number" && !isNaN(tmpChar),
        )
      ) {
        value =
          (parsedChars[0] as number) * 1000 +
          (parsedChars[1] as number) * 100 +
          (parsedChars[2] as number) * 10 +
          (parsedChars[3] as number) * 1;

        if (this.decimalPointIndex !== undefined) {
          value = value / 10 ** (3 - this.decimalPointIndex);
        }

        if (this.isMinus) {
          value = -value;
        }
      }
      return value;
    },
    get isOutOfLimit() {
      return this.char1 == "0" && this.char2 == "L";
    },
    toString() {
      if (this.value !== undefined && this.unit !== undefined) {
        return `${this.value} ${this.unit} ${this.isAC ? "(AC)" : ""}${
          this.isDC ? "(DC)" : ""
        }`;
      } else if (this.isOutOfLimit) {
        return `Out of Limit (${this.unit})`;
      }
    },
  };
}

export type TParsedDMMResponse = ReturnType<typeof parseDMMBuffer>;

export function readCharacter(
  binString: string,
  charIndex: number,
): KNOWN_UNKNOWN_CHARS {
  if (charIndex >= LCD_CHAR_BIT_POSITIONS.length) {
    throw new Error("Character index is invalid");
  }
  const charBitPositions = LCD_CHAR_BIT_POSITIONS[charIndex];
  const receivedCharValueString = charBitPositions
    .map((tmpBitPosition) => getBit(binString, tmpBitPosition))
    .join("");

  const foundKeyValue: [KNOWN_CHARS, string] | undefined = (
    Object.entries(CHAR_MAP) as Array<[KNOWN_CHARS, string]>
  ).find(([_, matchingCharValue]) => {
    if (matchingCharValue == receivedCharValueString) {
      return true;
    }
  });

  if (foundKeyValue == undefined) {
    return undefined;
  }
  return foundKeyValue[0];
}

export function getDecimalPointIndex(binString: string): number | undefined {
  const maybeDecimalPointIndex = LCD_DECIMAL_POINT_BIT_POSITIONS.findIndex(
    (tmpBitPosition) => getBitAsBoolean(binString, tmpBitPosition),
  );
  if (maybeDecimalPointIndex === -1) {
    return undefined;
  }
  return maybeDecimalPointIndex;
}
