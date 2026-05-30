import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, Loader2, Sparkles } from "lucide-react";
import type * as PoseDetection from "@tensorflow-models/pose-detection";

type TrackerStatus = "idle" | "loading" | "calibrating" | "tracking" | "error";
type BowState = "ready" | "bowing";

interface PoseTrackerProps {
  roomId: string;
  userId?: number;
  onPrayerDetected: () => void;
  roomCurrentCount?: number;  // ← Nhận số người hiện tại
}

const CALIBRATION_MS = 3000;
const MIN_KEYPOINT_SCORE = 0.35;
const BOW_DEBOUNCE_MS = 1000;

function getKeypoint(pose: PoseDetection.Pose, name: string) {
  return pose.keypoints.find((keypoint) => keypoint.name === name);
}

export function PoseTracker({ roomId, userId, onPrayerDetected, roomCurrentCount = 0 }: PoseTrackerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectorRef = useRef<PoseDetection.PoseDetector | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const calibrationIntervalRef = useRef<number | null>(null);
  const calibrationTimeoutRef = useRef<number | null>(null);
  const runIdRef = useRef(0);
  const stopRequestedRef = useRef(false);
  const bowStateRef = useRef<BowState>("ready");
  const lastPrayerAtRef = useRef(0);
  const calibrationSamplesRef = useRef<number[]>([]);
  const shoulderWidthSamplesRef = useRef<number[]>([]);
  const baselineRef = useRef<{ handY: number; shoulderWidth: number } | null>(null);

  const [status, setStatus] = useState<TrackerStatus>("idle");
  const [error, setError] = useState("");
  const [localCount, setLocalCount] = useState(0);
  const [calibrationLeft, setCalibrationLeft] = useState(0);
  const [gestureState, setGestureState] = useState<BowState>("ready");
  const [handsClasped, setHandsClasped] = useState(false);

  const stopTracking = () => {
    runIdRef.current += 1;
    stopRequestedRef.current = true;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (calibrationIntervalRef.current) {
      window.clearInterval(calibrationIntervalRef.current);
      calibrationIntervalRef.current = null;
    }

    if (calibrationTimeoutRef.current) {
      window.clearTimeout(calibrationTimeoutRef.current);
      calibrationTimeoutRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    const context = canvasRef.current?.getContext("2d");
    if (canvasRef.current && context) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    bowStateRef.current = "ready";
    calibrationSamplesRef.current = [];
    shoulderWidthSamplesRef.current = [];
    baselineRef.current = null;
    setGestureState("ready");
    setHandsClasped(false);
    setCalibrationLeft(0);
    setStatus("idle");
  };

  const drawPose = (pose: PoseDetection.Pose) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !video || !context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);

    pose.keypoints.forEach((keypoint) => {
      if ((keypoint.score ?? 0) < MIN_KEYPOINT_SCORE) return;
      context.beginPath();
      context.arc(keypoint.x, keypoint.y, 5, 0, Math.PI * 2);
      context.fillStyle = "#f97316";
      context.fill();
    });
  };

  const detectPrayerGesture = (pose: PoseDetection.Pose) => {
    const leftShoulder = getKeypoint(pose, "left_shoulder");
    const rightShoulder = getKeypoint(pose, "right_shoulder");
    const leftWrist = getKeypoint(pose, "left_wrist");
    const rightWrist = getKeypoint(pose, "right_wrist");

    if (!leftShoulder || !rightShoulder || !leftWrist || !rightWrist) return;
    if (
      (leftShoulder.score ?? 0) < MIN_KEYPOINT_SCORE ||
      (rightShoulder.score ?? 0) < MIN_KEYPOINT_SCORE ||
      (leftWrist.score ?? 0) < MIN_KEYPOINT_SCORE ||
      (rightWrist.score ?? 0) < MIN_KEYPOINT_SCORE
    ) {
      setHandsClasped(false);
      return;
    }

    const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
    const wristDistance = Math.hypot(leftWrist.x - rightWrist.x, leftWrist.y - rightWrist.y);
    const handY = (leftWrist.y + rightWrist.y) / 2;
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const handsAreClasped = wristDistance < Math.max(45, shoulderWidth * 0.45);

    setHandsClasped(handsAreClasped);

    if (!baselineRef.current) {
      if (handsAreClasped) {
        calibrationSamplesRef.current.push(handY);
        shoulderWidthSamplesRef.current.push(shoulderWidth);
      }
      return;
    }

    if (!handsAreClasped) {
      return;
    }

    const baselineHandY = baselineRef.current.handY || shoulderY;
    const movementScale = Math.max(60, baselineRef.current.shoulderWidth * 0.35);
    const bowThreshold = baselineHandY + movementScale;
    const readyThreshold = baselineHandY + Math.max(18, baselineRef.current.shoulderWidth * 0.12);
    const now = Date.now();

    if (handY > bowThreshold && bowStateRef.current === "ready") {
      bowStateRef.current = "bowing";
      setGestureState("bowing");
      return;
    }

    if (
      handY < readyThreshold &&
      bowStateRef.current === "bowing" &&
      now - lastPrayerAtRef.current > BOW_DEBOUNCE_MS
    ) {
      bowStateRef.current = "ready";
      setGestureState("ready");
      lastPrayerAtRef.current = now;
      setLocalCount((count) => count + 1);
      onPrayerDetected();
    }
  };

  const detectLoop = async () => {
    if (stopRequestedRef.current) return;

    const detector = detectorRef.current;
    const video = videoRef.current;

    if (!detector || !video || video.readyState < 2) {
      if (!stopRequestedRef.current) {
        animationRef.current = requestAnimationFrame(detectLoop);
      }
      return;
    }

    const poses = await detector.estimatePoses(video, { maxPoses: 1, flipHorizontal: true });

    if (stopRequestedRef.current) return;

    const pose = poses[0];

    if (pose) {
      drawPose(pose);
      detectPrayerGesture(pose);
    }

    if (!stopRequestedRef.current) {
      animationRef.current = requestAnimationFrame(detectLoop);
    }
  };

  const startTracking = async () => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    stopRequestedRef.current = false;

    try {
      setError("");
      setStatus("loading");

      const [tf, poseDetection] = await Promise.all([
        import("@tensorflow/tfjs-core"),
        import("@tensorflow-models/pose-detection"),
        import("@tensorflow/tfjs-backend-webgl"),
      ]).then(([tfModule, poseModule]) => [tfModule, poseModule] as const);

      if (stopRequestedRef.current || runIdRef.current !== runId) return;

      await tf.setBackend("webgl");
      await tf.ready();

      if (stopRequestedRef.current || runIdRef.current !== runId) return;

      detectorRef.current ??= await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        }
      );

      if (stopRequestedRef.current || runIdRef.current !== runId) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      if (stopRequestedRef.current || runIdRef.current !== runId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      if (stopRequestedRef.current || runIdRef.current !== runId) return;

      setStatus("calibrating");
      setCalibrationLeft(3);

      calibrationIntervalRef.current = window.setInterval(() => {
        setCalibrationLeft((value) => Math.max(0, value - 1));
      }, 1000);

      calibrationTimeoutRef.current = window.setTimeout(() => {
        if (stopRequestedRef.current || runIdRef.current !== runId) return;

        if (calibrationIntervalRef.current) {
          window.clearInterval(calibrationIntervalRef.current);
          calibrationIntervalRef.current = null;
        }

        const samples = calibrationSamplesRef.current;
        const averageHandY = samples.length
          ? samples.reduce((sum, sample) => sum + sample, 0) / samples.length
          : (videoRef.current?.videoHeight || 480) * 0.45;
        const shoulderSamples = shoulderWidthSamplesRef.current;
        const averageShoulderWidth = shoulderSamples.length
          ? shoulderSamples.reduce((sum, sample) => sum + sample, 0) / shoulderSamples.length
          : (videoRef.current?.videoWidth || 640) * 0.28;
        const videoWidth = videoRef.current?.videoWidth || 640;
        baselineRef.current = {
          handY: averageHandY,
          shoulderWidth: averageShoulderWidth || videoWidth * 0.28,
        };

        setStatus("tracking");
        setCalibrationLeft(0);
      }, CALIBRATION_MS);

      animationRef.current = requestAnimationFrame(detectLoop);
    } catch (err) {
      console.error("Pose tracker failed:", err);
      setError("Khong mo duoc camera hoac AI.");
      stopTracking();
      setStatus("error");
    }
  };

  useEffect(() => {
    return () => {
      stopTracking();
      detectorRef.current?.dispose();
    };
  }, []);

  const isActive = status !== "idle" && status !== "error";
  const isCameraDisabled = roomCurrentCount >= 25;  // ✅ Disable nếu >= 25 người

  return (
    <div className="bg-white border border-orange-100 rounded-[30px] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12} /> Lay AI
          </p>
          <p className="text-[11px] font-bold text-gray-400 mt-1">
            {isCameraDisabled
              ? "❌ Phòng đã đủ 25 người mở camera, không thể bật"
              : status === "calibrating"
              ? `Chap tay dung yen ${calibrationLeft}s de can chinh`
              : status === "tracking"
                ? handsClasped
                  ? "Da nhan tay chap, hay lay xuong roi nang len"
                  : "Chap hai tay lai truoc nguc de bat dau"
                : status === "loading"
                  ? "Dang tai AI..."
                  : "Camera dang tat"}
          </p>
        </div>

        <button
          type="button"
          onClick={isActive ? stopTracking : startTracking}
          disabled={status === "loading" || isCameraDisabled}
          className={`w-11 h-11 rounded-2xl border border-black/10 flex items-center justify-center shadow-sm transition-all ${
            isCameraDisabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isActive
                ? "bg-red-50 text-red-500"
                : "bg-orange-50 text-orange-600 hover:bg-orange-100"
          }`}
          title={isCameraDisabled ? "Phòng đã đủ 25 người mở camera" : isActive ? "Tắt camera AI" : "Bật camera AI"}
        >
          {status === "loading" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isActive ? (
            <CameraOff size={18} />
          ) : (
            <Camera size={18} />
          )}
        </button>
      </div>

      <div className="relative aspect-video overflow-hidden rounded-[22px] bg-gray-950 border border-black/10">
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full scale-x-[-1]" />

        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center text-center px-6">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/70">
              Bat camera de AI tu dem luot lay
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="bg-orange-50 rounded-2xl p-3 border border-orange-100">
          <p className="text-[9px] font-black text-orange-500 uppercase">Ca nhan</p>
          <p className="text-xl font-black text-black">{localCount}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 border border-black/5">
          <p className="text-[9px] font-black text-gray-400 uppercase">Trang thai</p>
          <p className="text-[11px] font-black text-black uppercase">{handsClasped ? gestureState : "chap tay"}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-3 border border-black/5">
          <p className="text-[9px] font-black text-gray-400 uppercase">Phong</p>
          <p className="text-[11px] font-black text-black truncate">{roomId}</p>
        </div>
      </div>

      {error && <p className="mt-3 text-[11px] font-bold text-red-500">{error}</p>}
      {!userId && (
        <p className="mt-3 text-[11px] font-bold text-amber-600">
          Ban chua dang nhap, AI van dem tren may nay nhung chua luu theo thanh vien.
        </p>
      )}
    </div>
  );
}
