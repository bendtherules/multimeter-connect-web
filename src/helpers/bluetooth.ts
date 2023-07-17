import {
  DEFAULT_CHARACTERISTIC_UUID,
  DEFAULT_SERVICE_UUID,
  AUTO_RECONNECT_INTERVAL_MS,
} from "./constants";
import { MultimeterError } from "./custom-error";

export class BluetoothConnection {
  multimeterBluetoothDevice: BluetoothDevice | null = null;
  serviceUUID: string;
  characteristicUUID: string;
  gatt?: BluetoothRemoteGATTServer = undefined;
  service?: BluetoothRemoteGATTService = undefined;
  characteristic?: BluetoothRemoteGATTCharacteristic = undefined;
  onNotifyExternal?: (bufferAsArray: number[]) => void = undefined;
  onConnectExternal?: () => void = undefined;
  onDisconnectExternal?: () => void = undefined;
  autoReconnectTimer?: ReturnType<typeof setTimeout>;
  shouldAutoReconnect = true;

  constructor({
    serviceUUID = DEFAULT_SERVICE_UUID,
    characteristicUUID = DEFAULT_CHARACTERISTIC_UUID,
  } = {}) {
    this.serviceUUID = serviceUUID;
    this.characteristicUUID = characteristicUUID;

    // Bind methods
    this.startConnection = this.startConnection.bind(this);
    this.startAutoReconnect = this.startAutoReconnect.bind(this);
    this.addConnectHandler = this.addConnectHandler.bind(this);
    this.addDisconnectHandler = this.addDisconnectHandler.bind(this);
    this.addNotifyHandler = this.addNotifyHandler.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.enableShouldAutoReconnect = this.enableShouldAutoReconnect.bind(this);
    this.disableShouldAutoReconnect =
      this.disableShouldAutoReconnect.bind(this);
    this._onConnect = this._onConnect.bind(this);
    this._onNotify = this._onNotify.bind(this);
    this._onDisconnect = this._onDisconnect.bind(this);
  }

  async startConnection() {
    this.multimeterBluetoothDevice = await this.requestBluetoothDevice();
    this.multimeterBluetoothDevice.removeEventListener(
      "gattserverdisconnected",
      this._onDisconnect,
    );
    this.multimeterBluetoothDevice.addEventListener(
      "gattserverdisconnected",
      this._onDisconnect,
    );
    this.connectGatt();
  }

  async autoReconnect() {
    await this.connectGatt();
  }

  async requestBluetoothDevice() {
    const tmpBluetoothDevice = await navigator.bluetooth.requestDevice({
      filters: [
        {
          services: [this.serviceUUID],
        },
      ],
    });
    if (tmpBluetoothDevice === undefined) {
      throw new MultimeterError("Multimeter not selected");
    }
    return tmpBluetoothDevice;
  }

  async connectGatt() {
    if (this.multimeterBluetoothDevice == null) {
      throw new MultimeterError("multimeterBluetoothDevice is not populated");
    }
    if (this.multimeterBluetoothDevice.gatt === undefined) {
      throw new MultimeterError("BLE: Gatt is not available");
    }

    this.gatt = await this.multimeterBluetoothDevice.gatt.connect();
    this.service = await this.gatt.getPrimaryService(this.serviceUUID);
    this.characteristic = await this.service.getCharacteristic(
      this.characteristicUUID,
    );
    if (this.characteristic.properties.notify) {
      this.characteristic.removeEventListener(
        "characteristicvaluechanged",
        this._onNotify,
      );
      this.characteristic.addEventListener(
        "characteristicvaluechanged",
        this._onNotify,
      );
      await this.characteristic.startNotifications();
    }

    this._onConnect();
  }

  async _onConnect() {
    this.onConnectExternal?.();
  }

  async _onNotify() {
    const buffer: ArrayBuffer | undefined = this.characteristic?.value?.buffer;
    if (buffer == undefined) {
      throw new MultimeterError("BLE: Notify buffer is undefined");
    }
    const bufferAsArray = [...new Uint8Array(buffer)];
    this.onNotifyExternal?.(bufferAsArray);
  }

  async _onDisconnect() {
    console.log("Multimeter disconnected");
    this.characteristic?.removeEventListener(
      "characteristicvaluechanged",
      this._onNotify,
    );

    this.onDisconnectExternal?.();
  }

  startAutoReconnect() {
    // Stop, if already running
    this.stopAutoReconnect();
    if (this.multimeterBluetoothDevice !== null && this.shouldAutoReconnect) {
      this.autoReconnectTimer = setTimeout(async () => {
        try {
          await this.autoReconnect();
        } catch (_err) {
          this.startAutoReconnect();
        }
      }, AUTO_RECONNECT_INTERVAL_MS);
    } else {
      this.autoReconnectTimer = undefined;
    }
  }
  stopAutoReconnect() {
    clearTimeout(this.autoReconnectTimer);
    this.autoReconnectTimer = undefined;
  }

  addNotifyHandler(handler: (bufferAsArray: number[]) => void) {
    this.onNotifyExternal = handler;
  }

  addConnectHandler(handler: () => void) {
    this.onConnectExternal = handler;
  }

  addDisconnectHandler(handler: () => void) {
    this.onDisconnectExternal = handler;
  }

  disconnect() {
    this.gatt?.disconnect();
  }

  enableShouldAutoReconnect() {
    this.shouldAutoReconnect = true;
  }

  disableShouldAutoReconnect() {
    this.shouldAutoReconnect = false;
  }
}
