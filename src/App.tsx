// src/App.tsx
import React, { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Media } from "@capacitor-community/media";
import { useSpeechSynthesis } from "react-speech-kit";

const survey = [
  {
    question: {
      en: "What is your favorite fruit?",
      hi: "आपका पसंदीदा फल क्या है?",
      km: "ផ្លែឈើដែលអ្នកចូលចិត្តបំផុតគឺអ្វី?",
    },
    options: ["Apple", "Banana", "Orange"],
  },
  {
    question: {
      en: "How do you feel today?",
      hi: "आज आप कैसा महसूस कर रहे हैं?",
      km: "ថ្ងៃនេះអ្នកមានអារម្មណ៍យ៉ាងដូចម្តេច?",
    },
    options: [],
  },
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [language, setLanguage] = useState<"en" | "hi" | "km">("en");
  const { speak, cancel } = useSpeechSynthesis();

  const speakQuestion = () => {
    const current = survey[index];
    const text =
      current.question[language] +
      (current.options.length
        ? `. Options are: ${current.options.join(", ")}`
        : "");
    speak({ text, lang: getLangCode(language) });
  };

  const getLangCode = (lang: string) => {
    switch (lang) {
      case "hi":
        return "hi-IN";
      case "km":
        return "km-KH";
      default:
        return "en-US";
    }
  };

  const recordAudio = async () => {
    if (Capacitor.isNativePlatform()) {
      const media = await Media.recordAudio();
      const audioFile = media.path;
      const base64Audio = await Filesystem.readFile({
        path: audioFile,
        directory: Directory.Data,
      });
      console.log("Audio base64:", base64Audio.data);
    } else {
      alert("Voice recording works only in native app.");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Voice Survey</h1>

      <div>
        <label>Select Language: </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          className="border p-1 rounded"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="km">Khmer</option>
        </select>
      </div>

      <div className="space-y-2">
        <p className="font-semibold">Question {index + 1}:</p>
        <p>{survey[index].question[language]}</p>

        {survey[index].options.length > 0 && (
          <ul className="list-disc pl-6">
            {survey[index].options.map((opt, idx) => (
              <li key={idx}>{opt}</li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <button
            onClick={speakQuestion}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            🔊 Speak
          </button>
          <button
            onClick={recordAudio}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            🎙 Record
          </button>
        </div>

        <div className="flex gap-2">
          <button
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Previous
          </button>
          <button
            disabled={index === survey.length - 1}
            onClick={() => setIndex((i) => i + 1)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
