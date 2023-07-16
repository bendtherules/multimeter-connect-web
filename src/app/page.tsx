"use client";

import Image from "next/image";
import {
  TParsedDMMResponse,
  debounceReadingFunc,
  parseDMMBuffer,
  startBluetoothCoonection as startBluetoothConnection,
} from "@/helpers/parseDMM";
import { startBuzz } from "@/helpers/buzzSound";
import {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export function SpeakerOnIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
      />
    </svg>
  );
}

export function SpeakerOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
      />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export function MegaphoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
      />
    </svg>
  );
}

export function useBuzzSound() {}

export function useStateWithRef<TState>(
  initialValue: TState,
): [TState, Dispatch<SetStateAction<TState>>, MutableRefObject<TState>] {
  const [value, setValue] = useState<TState>(initialValue);
  const valueRef = useRef<TState>(initialValue);
  valueRef.current = value;

  return [value, setValue, valueRef];
}

export default function Home() {
  const [printedValue, setPrintedValue] = useState<string | undefined>(
    undefined,
  );
  const [liveValue, setLiveValue] = useState<string | undefined>(undefined);
  const [isMute, setIsMute, isMuteRef] = useStateWithRef<boolean>(false);
  const stopBuzzRef = useRef<(() => void) | undefined>(undefined);

  let [selectedVoice, setSelectedVoice, selectedVoiceRef] = useStateWithRef<
    string | undefined
  >(undefined);
  let [allVoices, setAllVoices] = useState<SpeechSynthesisVoice[]>();
  let multimeterBluetoothDeviceRef = useRef<BluetoothDevice | undefined>(
    undefined,
  );
  let multimeterDisconnectRef = useRef<(() => void) | undefined>(undefined);

  const [showDisconnect, setShowDisconnect] = useState(false);
  const showConnect = !showDisconnect;

  function resetStatusAfterDisconnect() {
    if (multimeterBluetoothDeviceRef.current !== undefined) {
      // Only announce once
      speak("Multimeter disconnected");
    }
    multimeterBluetoothDeviceRef.current = undefined;
    multimeterDisconnectRef.current = undefined;
    setLiveValue(undefined);
    setPrintedValue(undefined);
    setShowDisconnect(false);
  }

  function speak(value: string) {
    let speech = new SpeechSynthesisUtterance();
    speech.lang = "en";
    speech.text = value;
    speech.voice =
      allVoices?.find(
        ({ voiceURI }) => voiceURI === selectedVoiceRef.current,
      ) || null;
    speech.volume = isMuteRef.current ? 0 : 1;
    window.speechSynthesis.speak(speech);
  }

  function handleConnectClick() {
    const debouncedLogAndSpeak = debounceReadingFunc((value) => {
      value = value as string;
      setPrintedValue(value);
      console.log(value);
      speak(value.replace("-", "Minus "));
    }, 700);

    function handleBuzz(parsedDMMresponse: TParsedDMMResponse) {
      const { isBuzz, isDiode } = parsedDMMresponse;
      // If BUZZ sign & not DIODE sign & not mute
      if (isBuzz && !isDiode && !isMuteRef.current) {
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
    startBluetoothConnection({
      onDisconnect: () => resetStatusAfterDisconnect(),
      onNotify,
    }).then((obj) => {
      multimeterBluetoothDeviceRef.current = obj.multimeterBluetoothDevice;
      multimeterDisconnectRef.current = obj.disconnect;
      setShowDisconnect(true);
      speak("Connected");
    });
  }

  function handleDisconnectClick() {
    if (multimeterDisconnectRef.current) {
      console.log("Calling disconnect...");
      multimeterDisconnectRef.current();

      resetStatusAfterDisconnect();
    } else {
      console.log("Disconnect is not set");
    }
  }

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
        setSelectedVoice(allEnglishVoices[0].name);
      }
    }

    _updateAllVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      _updateAllVoices();
    };
  }, [setSelectedVoice]);

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
            className="mx-2 px-1 border-gray-200 border-2 border-solid rounded-sm"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
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
            className="bg-white text-gray-500 py-1 px-1 mx-4"
            onClick={handleMuteClick}
          >
            <SpeakerOnIcon />
          </button>
        ) : (
          <button
            title="Unmute audio"
            className="bg-white text-red-400 py-1 px-1 mx-4"
            onClick={handleUnmuteClick}
          >
            <SpeakerOffIcon />
          </button>
        )}
      </div>
    </main>
  );
}
