import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api/axios";

export default function VerifyQRModal({ event, onClose }) {
  const scannerRef = useRef(null);
  const scannedRef = useRef(false); // 🔒 HARD LOCK
  const [status, setStatus] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    start();

    async function start() {
      try {
        await scanner.start(
          { facingMode: "environment" },
          { fps: 8, qrbox: 250 },
          onScanSuccess
        );
      } catch (err) {
        console.error("Camera error", err);
      }
    }

    async function onScanSuccess(decodedText) {
      if (scannedRef.current) return; // ✅ IGNORE DUPLICATES
      scannedRef.current = true;

      try {
        await scanner.stop();
      } catch {}

      verify(decodedText);
    }

    return () => {
      try {
        scanner.stop();
      } catch {}
    };
  }, []);

  async function verify(qrText) {
  try {
    const res = await api.post("booking/verify-qr/", {
      qr_text: qrText,
      event_id: event.id,
    });

    setStatus(res.data.status);
    setInfo(res.data);
  } catch (err) {
    setStatus("invalid");
  }
}


  function scanNext() {
    scannedRef.current = false;
    setStatus(null);
    setInfo(null);
    window.location.reload(); // simplest safe reset
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-gray-900 text-white p-6 rounded-xl w-full max-w-md">

        <h2 className="text-lg font-bold text-center mb-2">
          Verify Ticket
        </h2>

        {!status && (
          <div
            id="qr-reader"
            className="w-full h-[280px] rounded-lg overflow-hidden border"
          />
        )}
        {status === "wrong_event" && (
          <div className="text-red-400">
            ❌ Ticket belongs to another event
          </div>
        )}


        {status && (
          <div className="text-center mt-4">
            {status === "valid" && (
              <div className="text-green-400">
                ✅ ENTRY ALLOWED <br />
                {info.user} <br />
                Qty: {info.quantity}
              </div>
            )}

            {status === "already_used" && (
              <div className="text-yellow-400">⚠ Already Used</div>
            )}

            {status === "invalid" && (
              <div className="text-red-400">❌ Invalid Ticket</div>
            )}

            <button
              onClick={scanNext}
              className="mt-4 w-full bg-white text-black py-2 rounded"
            >
              Scan Next
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full border py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
