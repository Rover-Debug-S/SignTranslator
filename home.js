import React, { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from "react-webcam"
import * as fp from "fingerpose"
import Handsigns from "../components/handsigns"
import { drawHand } from "../components/handposeutil"

export default function Home() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const [word, setWord] = useState("")
  const stableLetterRef = useRef("")
  const stableCountRef = useRef(0)
  const lastLetterRef = useRef("")
  const ACCEPT_THRESHOLD = 3
  const DETECT_INTERVAL_MS = 150
  const [speakEnabled, setSpeakEnabled] = useState(true)

  // Helper: send to App Inventor
  function sendToAppInventor(payload) {
    try {
      if (window.AppInventor?.setWebViewString) {
        window.AppInventor.setWebViewString(payload)
      } else if (window.parent?.AppInventor?.setWebViewString) {
        window.parent.AppInventor.setWebViewString(payload)
      }
    } catch {}
  }

  function acceptLetter(letter) {
    if (lastLetterRef.current === letter) return
    lastLetterRef.current = letter
    setWord((prev) => {
      const next = prev + letter
      sendToAppInventor(`WORD:${next}`)
      if (speakEnabled) {
        try {
          const utter = new SpeechSynthesisUtterance(next)
          window.speechSynthesis.speak(utter)
        } catch {}
      }
      return next
    })
  }

  async function detect(net) {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video
      const videoWidth = video.videoWidth
      const videoHeight = video.videoHeight
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      const hand = await net.estimateHands(video)
      if (hand.length > 0) {
        const GE = new fp.GestureEstimator(Object.values(Handsigns))
        const estimatedGestures = await GE.estimate(hand[0].landmarks, 6.5)

        if (estimatedGestures.gestures?.length > 0) {
          const confidence = estimatedGestures.gestures.map((p) => p.confidence)
          const maxIndex = confidence.indexOf(Math.max(...confidence))
          let letter = estimatedGestures.gestures[maxIndex].name
          letter = letter?.toUpperCase()?.charAt(0)

          if (stableLetterRef.current === letter) {
            stableCountRef.current++
          } else {
            stableLetterRef.current = letter
            stableCountRef.current = 1
          }

          if (stableCountRef.current >= ACCEPT_THRESHOLD) {
            acceptLetter(letter)
            stableLetterRef.current = ""
            stableCountRef.current = 0
          }
        }
      } else {
        stableLetterRef.current = ""
        stableCountRef.current = 0
      }

      const ctx = canvasRef.current.getContext("2d")
      drawHand(hand, ctx)
    }
  }

  useEffect(() => {
    const loadModel = async () => {
      const net = await handpose.load()
      setInterval(() => detect(net), DETECT_INTERVAL_MS)
    }
    loadModel()
  }, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#000",
        height: "100vh",
        overflow: "hidden",
        justifyContent: "center",
        color: "white",
      }}
    >
      {/* Webcam Fullscreen */}
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
        />
        {/* Word Display */}
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            width: "100%",
            textAlign: "center",
            fontSize: "4vw",
            fontWeight: "bold",
            color: "#00FFCC",
            textShadow: "0 0 10px #000",
          }}
        >
          {word || "Show a sign..."}
        </div>

        {/* Mute/Unmute Button */}
        <button
          onClick={() => setSpeakEnabled((prev) => !prev)}
          style={{
            position: "absolute",
            top: "5%",
            right: "5%",
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            padding: "10px 15px",
            borderRadius: "10px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          {speakEnabled ? "🔊" : "🔇"}
        </button>
      </div>
    </div>
  )
}
