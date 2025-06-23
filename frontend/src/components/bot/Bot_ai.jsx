import React, { useState, useEffect, useRef, useCallback } from 'react';

const App = () => {
  const [contentText, setContentText] = useState("Click here to talk to me");
  const [showVoiceGif, setShowVoiceGif] = useState(false);
  const [showMicButton, setShowMicButton] = useState(true);

  const recognitionRef = useRef(null);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const text_speak = new SpeechSynthesisUtterance(text);
      text_speak.rate = 1;
      text_speak.pitch = 1;
      text_speak.volume = 1;
      text_speak.lang = "en-US";
      window.speechSynthesis.speak(text_speak);
    } else {
      console.warn("Speech Synthesis API not supported in this browser.");
    }
  }, []);

  const wishMe = useCallback(() => {
    const day = new Date();
    const hours = day.getHours();
    if (hours >= 0 && hours < 12) {
      speak("Good Morning Sir");
    } else if (hours >= 12 && hours < 16) {
      speak("Good afternoon Sir");
    } else {
      speak("Good Evening Sir");
    }
  }, [speak]);

  const takeCommand = useCallback((message) => {
    setShowVoiceGif(false);
    setShowMicButton(true);

    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hey")) {
      speak("Hello sir, what can I help you?");
    } else if (lowerCaseMessage.includes("who are you")) {
      speak("I am a virtual assistant, created by Revathi");
    } else if (lowerCaseMessage.includes("open youtube")) {
      speak("Opening YouTube...");
      window.open("https://youtube.com/", "_blank");
    } else if (lowerCaseMessage.includes("open google")) {
      speak("Opening Google...");
      window.open("https://google.com/", "_blank");
    } else if (lowerCaseMessage.includes("open facebook")) {
      speak("Opening Facebook...");
      window.open("https://facebook.com/", "_blank");
    } else if (lowerCaseMessage.includes("open instagram")) {
      speak("Opening Instagram...");
      window.open("https://instagram.com/", "_blank");
    }
    else if (lowerCaseMessage.includes("open calculator")) {
      speak("Opening calculator..");
      window.open("calculator://");
    } else if (lowerCaseMessage.includes("open whatsapp")) {
      speak("Opening WhatsApp..");
      window.open("whatsapp://");
    } else if (lowerCaseMessage.includes("time")) {
      const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
      speak(`The current time is ${time}`);
    } else if (lowerCaseMessage.includes("date")) {
      const date = new Date().toLocaleString(undefined, { day: "numeric", month: "long", year: "numeric" });
      speak(`Today's date is ${date}`);
    } else {
      const searchText = lowerCaseMessage.replace("revathi", "").trim();
      const finalText = `This is what I found on the internet regarding ${searchText}`;
      speak(finalText);
      window.open(`https://www.google.com/search?q=${searchText}`, "_blank");
    }
  }, [speak]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const currentIndex = event.resultIndex;
        const transcript = event.results[currentIndex][0].transcript;
        setContentText(transcript);
        takeCommand(transcript);
      };

      recognition.onend = () => {
        setShowVoiceGif(false);
        setShowMicButton(true);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setContentText(`Error: ${event.error}. Please try again.`);
        setShowVoiceGif(false);
        setShowMicButton(true);
        speak("Sorry, I didn't catch that. Please try again.");
      };

      recognitionRef.current = recognition;

      wishMe();

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
      setContentText("Speech recognition not supported in this browser.");
      setShowMicButton(false);
    }
  }, [wishMe, takeCommand]);

  const handleMicButtonClick = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setShowVoiceGif(true);
        setShowMicButton(false);
        setContentText("Listening...");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setContentText("Could not start listening. Please refresh.");
        setShowVoiceGif(false);
        setShowMicButton(true);
      }
    } else {
      setContentText("Speech recognition not ready or supported.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 flex flex-col items-center justify-center p-4 font-inter text-white">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8 text-center drop-shadow-lg">
        I'm <span className="text-purple-300">Revathi</span>, Your <span className="text-blue-300">Virtual Assistant</span>
      </h1>

      {showVoiceGif && (
        <img
          src="https://placehold.co/150x150/ffffff/000000?text=Voice+Active"
          alt="Voice Active"
          className="w-36 h-36 sm:w-48 sm:h-48 rounded-full mb-8 shadow-2xl animate-pulse"
        />
      )}

      {showMicButton && (
        <button
          id="btn"
          onClick={handleMicButtonClick}
          className="flex items-center justify-center p-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
        >
          <img
            src="https://placehold.co/40x40/FFFFFF/000000?text=MIC"
            alt="Microphone"
            className="w-10 h-10 mr-3"
          />
          <span id="content" className="text-xl sm:text-2xl font-semibold">
            {contentText}
          </span>
        </button>
      )}

      <div className="mt-12 text-center text-purple-200 text-lg sm:text-xl max-w-md">
        <p className="mb-2">Try saying things like:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>"Hello" or "Hey"</li>
          <li>"Who are you"</li>
          <li>"Open YouTube"</li>
          <li>"What is the time"</li>
          <li>"What is today's date"</li>
          <li>"Search for [anything]"</li>
        </ul>
      </div>
    </div>
  );
};

export default App;