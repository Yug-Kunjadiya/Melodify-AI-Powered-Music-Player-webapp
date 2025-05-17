import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { usePlayer } from '../context/PlayerContext';
import { getRandomSongForEmotion } from './emotionToSong';

interface FaceDetectionProps {
  onEmotionDetected: (emotion: string) => void;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({ onEmotionDetected }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        setIsModelLoading(false);
        setDetectionError(null);
      } catch (error) {
        console.error('Error loading face detection models:', error);
        setDetectionError('Failed to load face detection models');
      }
    };

    loadModels();
  }, []);

  const detectEmotion = async () => {
    if (!webcamRef.current || isModelLoading) return;

    const video = webcamRef.current.video;
    if (!video) return;

    try {
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections) {
        const expressions = detections.expressions;
        const emotion = Object.entries(expressions).reduce((a, b) => 
          a[1] > b[1] ? a : b
        )[0];
        onEmotionDetected(emotion);
        setDetectionError(null);
        const song = getRandomSongForEmotion(emotion);
        playSong(song);
      } else {
        setDetectionError('No face detected');
      }
    } catch (error) {
      console.error('Error detecting emotion:', error);
      setDetectionError('Error detecting emotion');
    }
  };

  useEffect(() => {
    const interval = setInterval(detectEmotion, 1000);
    return () => clearInterval(interval);
  }, [isModelLoading]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Webcam
        ref={webcamRef}
        audio={false}
        className="w-full rounded-lg shadow-lg"
        screenshotFormat="image/jpeg"
        mirrored={true}
      />
      {isModelLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <p className="text-white">Loading face detection models...</p>
        </div>
      )}
      {detectionError && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-red-500 bg-opacity-75 text-white text-center text-sm">
          {detectionError}
        </div>
      )}
    </div>
  );
};

export default FaceDetection; 