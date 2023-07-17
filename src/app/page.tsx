"use client";

import React, { useCallback, useMemo } from "react";
import Image from "next/image";
import { TParsedDMMResponse, parseDMMBuffer } from "@/helpers/parseDMM";
import { debounceReadingFunc } from "@/helpers/debounce";
import { BluetoothConnection } from "@/helpers/bluetooth";
import { startBuzz } from "@/helpers/buzzSound";
import { useEffect, useRef, useState } from "react";
import { EyeIcon, MegaphoneIcon, SpeakerOnIcon, SpeakerOffIcon } from "./icons";
import { useStateWithRef } from "@/helpers/custom-hooks";

function useBluetoothConnection() {
  let bluetoothConnectionRef = useRef<BluetoothConnection | null>(null);
  if (bluetoothConnectionRef.current == null) {
    bluetoothConnectionRef.current = new BluetoothConnection();
  }
  const bluetoothConnection = bluetoothConnectionRef.current;
  const {
    startConnection,
    startAutoReconnect,
    addConnectHandler,
    addDisconnectHandler,
    addNotifyHandler,
    disconnect,
    enableShouldAutoReconnect,
    disableShouldAutoReconnect,
  } = bluetoothConnection;
  return {
    startConnection,
    startAutoReconnect,
    addConnectHandler,
    addDisconnectHandler,
    addNotifyHandler,
    disconnect,
    enableShouldAutoReconnect,
    disableShouldAutoReconnect,
  };
}

function useSpeechApi() {
  const [isMute, setIsMute, isMuteRef] = useStateWithRef<boolean>(false);
  let [selectedVoiceURI, setSelectedVoiceURI, selectedVoiceURIRef] =
    useStateWithRef<string | undefined>(undefined);
  let [allVoices, setAllVoices, allVoicesRef] = useStateWithRef<
    SpeechSynthesisVoice[] | undefined
  >(undefined);

  const speak = useCallback(
    function speak(value: string) {
      let speech = new SpeechSynthesisUtterance();
      speech.lang = "en";
      speech.text = value;
      speech.voice =
        allVoicesRef.current?.find(
          ({ voiceURI }) => voiceURI == selectedVoiceURIRef.current,
        ) || null;
      speech.volume = isMuteRef.current ? 0 : 1;
      window.speechSynthesis.speak(speech);
    },
    [isMuteRef, selectedVoiceURIRef, allVoicesRef],
  );

  // Effect - Init all voices
  useEffect(() => {
    function _updateAllVoices() {
      // Get List of Voices
      const tempAllVoices = window.speechSynthesis.getVoices();
      const allEnglishVoices = tempAllVoices.filter(({ lang }) =>
        lang.startsWith("en"),
      );
      setAllVoices(allEnglishVoices);

      if (allEnglishVoices.length > 0) {
        // Initially set the First Voice in the Array.
        setSelectedVoiceURI(allEnglishVoices[0].voiceURI);
      }
    }

    _updateAllVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      _updateAllVoices();
    };
  }, [setSelectedVoiceURI, setAllVoices]);

  return {
    allVoices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    isMute,
    setIsMute,
    speak,
  };
}

export default function Home() {
  const [printedValue, setPrintedValue] = useState<string | undefined>(
    undefined,
  );
  const [liveValue, setLiveValue] = useState<string | undefined>(undefined);
  const stopBuzzRef = useRef<(() => void) | undefined>(undefined);

  const [showDisconnect, setShowDisconnect] = useState(false);
  const showConnect = !showDisconnect;

  const {
    startConnection,
    startAutoReconnect,
    addConnectHandler,
    addDisconnectHandler,
    addNotifyHandler,
    disconnect,
    enableShouldAutoReconnect,
    disableShouldAutoReconnect,
  } = useBluetoothConnection();
  const {
    allVoices,
    selectedVoiceURI,
    setSelectedVoiceURI,
    isMute,
    setIsMute,
    speak,
  } = useSpeechApi();

  const debouncedLogAndSpeak = useMemo(
    () =>
      debounceReadingFunc((value) => {
        value = value as string;
        setPrintedValue(value);
        console.log(value);
        speak(value.replace("-", "Minus "));
      }, 700),
    [speak],
  );

  function handleBuzz(parsedDMMresponse: TParsedDMMResponse) {
    const { isBuzz, isDiode } = parsedDMMresponse;
    // If BUZZ sign & not DIODE sign & not mute
    if (isBuzz && !isDiode && !isMute) {
      // Multimeter is buzzing, reciprocate
      const { stop } = startBuzz();
      stopBuzzRef.current = stop;
    } else {
      stopBuzzRef.current?.();
    }
  }

  function onNotify(bufferAsArray: number[]) {
    const parsedDMMresponse = parseDMMBuffer(bufferAsArray);
    const printValue = parsedDMMresponse.toString();
    // Set live value
    setLiveValue(printValue);

    // Debounced announce value
    debouncedLogAndSpeak(printValue);

    // Buzz, if needed
    handleBuzz(parsedDMMresponse);
  }
  addNotifyHandler(onNotify);

  function onDisconnect() {
    speak("Multimeter disconnected");

    setLiveValue(undefined);
    setPrintedValue(undefined);
    setShowDisconnect(false);

    // Has internal check for shouldAutoReconnect
    startAutoReconnect();
  }
  addDisconnectHandler(onDisconnect);

  function onConnect() {
    // TODO: Check if autoReconnect settings enabled
    enableShouldAutoReconnect();
    setShowDisconnect(true);
    speak("Connected");
  }
  addConnectHandler(onConnect);

  function handleConnectClick() {
    startConnection();
  }

  function handleDisconnectClick() {
    console.log("Clicked disconnect");
    disableShouldAutoReconnect();
    disconnect();
  }

  function handleMuteClick() {
    setIsMute(true);
  }

  function handleUnmuteClick() {
    setIsMute(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12">
      <div className="flex flex-col items-center mb-12">
        <Image
          src="/dmm-speaker-icon.png"
          alt="Multimeter speaker Logo"
          className="dark:invert pb-4"
          width={150}
          height={150}
          priority
        />
        <h1 className="font-mono text-2xl">Multimeter Speaker</h1>
      </div>
      <div className="mb-4">
        <p
          title="Live value"
          className="mb-8 flex flex-row items-center min-w-[200px] text-lg font-bold"
        >
          <span className="pr-2">
            <EyeIcon />
          </span>
          <span>{liveValue || "----"}</span>
        </p>
        <p
          title="Announced value (debounced)"
          className="mb-8 flex flex-row items-center min-w-[200px] text-lg font-bold"
        >
          <span className="pr-2">
            <MegaphoneIcon />
          </span>
          <span>{printedValue || "----"}</span>
        </p>
      </div>
      <div className="mb-8">
        {showConnect ? (
          <button
            className="bg-white text-green-500 py-2 px-3 mx-4 rounded-sm border-green-500 border-2 border-solid"
            onClick={handleConnectClick}
          >
            Connect bluetooth
          </button>
        ) : (
          <button
            className="bg-white text-red-500 py-2 px-3 mx-4 rounded-sm border-red-500 border-2 border-solid"
            onClick={handleDisconnectClick}
          >
            Disconnect
          </button>
        )}
      </div>
      <div className="mb-8 flex flex-col sm:flex-row items-center">
        <label className="mb-2 sm:mb-0 flex flex-col sm:flex-row items-center">
          <span className="mx-2 mb-2 sm:mb-0">Voice:</span>
          <select
            name="voice"
            className="mx-2 px-1 border-gray-200 border-2 border-solid rounded-sm bg-white text-black dark:bg-black dark:text-white"
            value={selectedVoiceURI}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
          >
            {allVoices?.map(({ name, voiceURI }) => (
              <option key={voiceURI} value={voiceURI}>
                {name}
              </option>
            ))}
          </select>
        </label>
        {!isMute ? (
          <button
            title="Mute audio"
            className="py-1 px-1 mx-4"
            onClick={handleMuteClick}
          >
            <SpeakerOnIcon />
          </button>
        ) : (
          <button
            title="Unmute audio"
            className="py-1 px-1 mx-4"
            onClick={handleUnmuteClick}
          >
            <SpeakerOffIcon />
          </button>
        )}
      </div>
    </main>
  );
}
