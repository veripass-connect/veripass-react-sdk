import React, { useRef, useEffect, useState } from 'react';
import { VeripassLayout } from '@components/shared/layouts/VeripassLayout';

import { FaceMesh } from '@mediapipe/face_mesh';
import { FACEMESH_TESSELATION, FACEMESH_LIPS, FACEMESH_LEFT_EYE, FACEMESH_RIGHT_EYE } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { CircularProgress } from '@mui/material';

async function emitEvent({ action, payload, error, eventHandler }) {
  if (eventHandler) {
    eventHandler({ action, namespace: 'veripass', payload, error });
  }
}

export const VeripassQuickUserBiometricsSelfie = ({ onEvent, currentStepIndex, isPopupContext = false }) => {
  const debug = false;
  const userAlignedTime = 5000;
  const stabilityThreshold = 35;
  const faceThreshold = 250;
  const eyePositionAdjustment = -40;
  const nosePositionAdjustment = 15;
  const eyeDistanceAdjustment = 100;

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const userSnapshot = useRef(null);
  const debugFaceGuideColor = useRef('blue');
  const debugBiometricGuideColor = useRef('blue');
  const canvasContext = useRef(null);
  const canvasCenterX = useRef(0);
  const canvasCenterY = useRef(0);
  const alignmentTimer = useRef(null);
  const progressIntervalRef = useRef(null);
  const [isFaceAlignedWithinField, setIsFaceAlignedWithinField] = useState(false);
  const [isBiometricsAligned, setIsBiometricsAligned] = useState(false);
  const [userAlignedProgress, setUserAlignedProgress] = useState(0);
  const [aiModel, setAiModel] = useState(null);

  const [isAligned, setIsAligned] = useState([]);

  useEffect(() => {
    initializeMediaPipe();

    return () => {
      cleanupResources();
    };
  }, []);

  useEffect(() => {
    if (currentStepIndex !== 1) {
      cleanupResources();
    }
  }, [currentStepIndex]);

  useEffect(() => {
    if (userSnapshot.current && alignmentTimer.current) {
      clearAlignmentTimer();
    }
  }, [userSnapshot]);

  const initializeMediaPipe = async () => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(onFaceResults);

    await setupCamera(faceMesh);

    setAiModel(faceMesh);
  };

  const cleanupResources = () => {
    if (cameraRef && cameraRef.current) {
      cameraRef.current.stop();
    }

    if (alignmentTimer.current) {
      clearTimeout(alignmentTimer.current);
    }

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (aiModel) {
      aiModel.close();
    }
  };

  const setupCamera = async (faceMesh) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return;
    }

    if (!videoRef.current) {
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    videoRef.current.onloadedmetadata = () => {
      videoRef.current.play();
      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          await faceMesh.send({ image: videoRef.current });
        },
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
      cameraRef.current.start();

      setupCanvas();
    };
  };

  const setupCanvas = () => {
    if (canvasRef.current && videoRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      const context = canvasRef.current.getContext('2d');
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;

      canvasContext.current = context;
      canvasCenterX.current = centerX;
      canvasCenterY.current = centerY;
    }
  };

  const clearAlignmentTimer = () => {
    if (alignmentTimer.current) {
      clearTimeout(alignmentTimer.current);
      alignmentTimer.current = null;
    }
    stopProgress();
  };

  const drawVisualGuides = () => {
    if (!canvasContext.current) {
      return;
    }

    if (debug) {
      canvasContext.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawFacialSquare();
      drawEyeDebugGuides();
      drawNoseDebugGuide();
    }
  };

  const drawFacialSquare = () => {
    const halfSquareSize = faceThreshold / 2;

    canvasContext.current.lineWidth = 1;
    canvasContext.current.strokeStyle = debugFaceGuideColor.current;
    canvasContext.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasContext.current.beginPath();
    canvasContext.current.rect(
      canvasCenterX.current - halfSquareSize,
      canvasCenterY.current - halfSquareSize,
      faceThreshold,
      faceThreshold,
    );
    canvasContext.current.stroke();
  };

  const drawEyeDebugGuides = () => {
    drawEyeDebugGuide(canvasCenterX.current - eyeDistanceAdjustment / 2, canvasCenterY.current + eyePositionAdjustment, 5);
    drawEyeDebugGuide(canvasCenterX.current + eyeDistanceAdjustment / 2, canvasCenterY.current + eyePositionAdjustment, 5);
  };

  const drawEyeDebugGuide = (x, y, pointSize) => {
    canvasContext.current.fillStyle = debugBiometricGuideColor.current;
    canvasContext.current.beginPath();
    canvasContext.current.arc(x, y, pointSize, 0, 2 * Math.PI);
    canvasContext.current.fill();

    canvasContext.current.strokeStyle = debugBiometricGuideColor.current;
    canvasContext.current.beginPath();
    canvasContext.current.arc(x, y, stabilityThreshold, 0, 2 * Math.PI);
    canvasContext.current.stroke();
  };

  const drawNoseDebugGuide = () => {
    const noseX = canvasCenterX.current;
    const noseY = canvasCenterY.current + nosePositionAdjustment;

    // Center guide
    canvasContext.current.fillStyle = debugBiometricGuideColor.current;
    canvasContext.current.beginPath();
    canvasContext.current.arc(noseX, noseY, 5, 0, 2 * Math.PI);
    canvasContext.current.fill();

    // Threshold guide
    canvasContext.current.strokeStyle = debugBiometricGuideColor.current;
    canvasContext.current.beginPath();
    canvasContext.current.ellipse(noseX, noseY, stabilityThreshold, stabilityThreshold * 1.5, 0, 0, 2 * Math.PI);
    canvasContext.current.stroke();
  };

  const drawLandmarks = (landmarks) => {
    if (!landmarks) {
      return;
    }

    canvasContext.current.strokeStyle = '#8e8e8e';
    canvasContext.current.lineWidth = 0.1;

    const drawConnections = (connections) => {
      connections.forEach(([start, end]) => {
        const startPoint = landmarks[start];
        const endPoint = landmarks[end];
        if (startPoint && endPoint) {
          canvasContext.current.beginPath();
          canvasContext.current.moveTo((1 - startPoint.x) * canvasRef.current.width, startPoint.y * canvasRef.current.height);
          canvasContext.current.lineTo((1 - endPoint.x) * canvasRef.current.width, endPoint.y * canvasRef.current.height);
          canvasContext.current.stroke();
        }
      });
    };

    drawConnections(FACEMESH_TESSELATION);
    drawConnections(FACEMESH_LIPS);
    drawConnections(FACEMESH_LEFT_EYE);
    drawConnections(FACEMESH_RIGHT_EYE);

    canvasContext.current.fillStyle = '#d1d1d1';
    canvasContext.current.globalAlpha = 0.5;
    landmarks.forEach((point) => {
      canvasContext.current.beginPath();
      canvasContext.current.arc((1 - point.x) * canvasRef.current.width, point.y * canvasRef.current.height, 1, 0, 2 * Math.PI);
      canvasContext.current.fill();
    });
    canvasContext.current.globalAlpha = 1.0;
  };

  const checkAlignment = (landmarks) => {
    if (!landmarks || !landmarks.length) {
      setIsAligned(false);
      return false;
    }

    const isFaceWithinSquare = checkFaceWithinSquare(landmarks);
    const isFaceAligned = checkBiometricsFaceAligned(landmarks);

    setIsAligned(isFaceWithinSquare && isFaceAligned);
    debugFaceGuideColor.current = isFaceWithinSquare ? 'blue' : 'gray';
    debugBiometricGuideColor.current = isFaceAligned ? 'green' : 'gray';
    setIsFaceAlignedWithinField(isFaceWithinSquare);
    setIsBiometricsAligned(isFaceAligned);

    return isFaceWithinSquare && isFaceAligned;
  };

  const checkBiometricsFaceAligned = (landmarks) => {
    const rightEye = landmarks[33];
    const leftEye = landmarks[263];
    const nose = landmarks[1];

    const eyeDistance = Math.sqrt(Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2));

    const eyeLevelY = canvasCenterY.current + eyePositionAdjustment;
    const noseLevelY = canvasCenterY.current + nosePositionAdjustment;

    const isRightEyeAligned =
      Math.abs(canvasCenterX.current - eyeDistanceAdjustment / 2 - rightEye.x * canvasRef.current.width) < stabilityThreshold &&
      Math.abs(eyeLevelY - rightEye.y * canvasRef.current.height) < stabilityThreshold;

    const isLeftEyeAligned =
      Math.abs(canvasCenterX.current + eyeDistanceAdjustment / 2 - leftEye.x * canvasRef.current.width) < stabilityThreshold &&
      Math.abs(eyeLevelY - leftEye.y * canvasRef.current.height) < stabilityThreshold;

    const isNoseAligned =
      Math.abs(canvasCenterX.current - nose.x * canvasRef.current.width) < stabilityThreshold &&
      Math.abs(noseLevelY - nose.y * canvasRef.current.height) < stabilityThreshold;

    const isAligned = isRightEyeAligned && isLeftEyeAligned && isNoseAligned;

    debugBiometricGuideColor.current = isAligned ? 'green' : 'red';

    return isAligned;
  };

  const checkFaceWithinSquare = (landmarks) => {
    const faceOutlineIndices = [
      10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172,
      58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
    ];
    const halfSquareSize = faceThreshold / 2;

    return faceOutlineIndices.every((index) => {
      const point = landmarks[index];
      const x = point.x * canvasRef.current.width;
      const y = point.y * canvasRef.current.height;
      return (
        x >= canvasCenterX.current - halfSquareSize &&
        x <= canvasCenterX.current + halfSquareSize &&
        y >= canvasCenterY.current - halfSquareSize &&
        y <= canvasCenterY.current + halfSquareSize
      );
    });
  };

  const takeSnapshot = () => {
    if (!videoRef?.current || userSnapshot.current) {
      return;
    }

    const canvas = document.createElement('canvas');
    let ctx;
    let dataUrl;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    dataUrl = canvas.toDataURL('image/png');

    userSnapshot.current = dataUrl;
  };

  const manageAlignmentTimer = (isCurrentlyAligned) => {
    if (userSnapshot?.current) {
      return;
    }

    if (!isCurrentlyAligned && alignmentTimer.current) {
      clearAlignmentTimer();
      stopProgress();
      return;
    }

    if (isCurrentlyAligned && !alignmentTimer.current) {
      const timer = setTimeout(() => {
        takeSnapshot();
        clearAlignmentTimer();
      }, userAlignedTime);
      startProgress(isCurrentlyAligned);
      alignmentTimer.current = timer;
    } else if (!isCurrentlyAligned) {
      stopProgress();
    }
  };

  const onFaceResults = (results) => {
    if (!canvasContext.current) {
      setupCanvas();
      return;
    }

    if (!results.multiFaceLandmarks) {
      setIsAligned(false);
      return;
    }

    const landmarks = results.multiFaceLandmarks[0];
    const isCurrentlyAligned = checkAlignment(landmarks);
    setIsAligned(isCurrentlyAligned);

    drawVisualGuides();

    if (debug) {
      drawLandmarks(landmarks);
    }

    manageAlignmentTimer(isCurrentlyAligned);
  };

  const startProgress = (isCurrentlyAligned) => {
    const startTime = Date.now();
    if (progressIntervalRef.current) {
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      biometricsProgressCalculation(startTime, isCurrentlyAligned);
    }, 100);
  };

  const biometricsProgressCalculation = (startTime, isCurrentlyAligned) => {
    if (!isCurrentlyAligned) {
      return;
    }

    const elapsedTime = Date.now() - startTime;
    const progressValue = (elapsedTime / userAlignedTime) * 100;
    const roundedProgressValue = Math.min(progressValue, 100);

    if (userAlignedProgress < 100 && roundedProgressValue > userAlignedProgress) {
      if (elapsedTime >= userAlignedTime || !isCurrentlyAligned) {
        stopProgress();
        setUserAlignedProgress(100);
      } else {
        setUserAlignedProgress(roundedProgressValue);
      }
    } else {
      setUserAlignedProgress(100);
    }
  };

  const stopProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  return (
    <VeripassLayout $isPopup={isPopupContext}>
      <section className="card-body p-0 d-flex flex-column">
        {!userSnapshot?.current && (
          <>
            <section className="position-relative mx-auto mt-2" style={{ width: '100%', maxWidth: '640px' }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', transform: 'scaleX(-1)' }} />
              <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%' }} />

              <section>
                {!isBiometricsAligned && (
                  <>
                    <i
                      className="mdi mdi-crop-free"
                      style={{
                        position: 'absolute',
                        top: '5px',
                        left: '170px',
                        width: '100%',
                        fontSize: '300px',
                        color: isFaceAlignedWithinField ? 'green' : 'gray',
                        opacity: 0.5,
                      }}
                    ></i>
                  </>
                )}

                {(isBiometricsAligned || userSnapshot?.current) && (
                  <>
                    <div className="backdrop"></div>
                    <CircularProgress
                      variant="determinate"
                      value={userAlignedProgress}
                      style={{
                        position: 'absolute',
                        top: '222px',
                        left: '70px',
                        width: '270px',
                        zIndex: 11,
                        color: 'green',
                        transition: 'stroke-dashoffset 0.005s ease-out',
                      }}
                    />
                  </>
                )}
              </section>
            </section>

            <section>
              <p>isFaceAlignedWithinField: {isFaceAlignedWithinField ? 'si' : 'no'}</p>
              <p>isBiometricsAligned: {isBiometricsAligned ? 'si' : 'no'}</p>
            </section>
          </>
        )}

        {userSnapshot?.current && (
          <section className="d-flex flex-wrap mx-auto my-3">
            <article className="mx-3">
              <img src={userSnapshot?.current} alt="Front view" className="w-100 flip-horizontal" />
            </article>
          </section>
        )}
      </section>
    </VeripassLayout>
  );
};
