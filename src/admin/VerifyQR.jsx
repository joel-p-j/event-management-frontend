import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import api from "../api/axios";

function VerifyQR() {
  const scannerRef = useRef(null);
  const [status, setStatus] = useState(null);
  const [info, setInfo] = useState(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(onScanSuccess, onScanError);
    scannerRef.current = scanner;

    function onScanSuccess(decodedText) {
      scanner.clear().catch(() => {});
      verifyQR(decodedText);
    }

    function onScanError(_) {}

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scanning]);

  async function verifyQR(qrText) {
    try {
      const res = await api.post("/booking/verify-qr/", {
        qr_text: qrText,
      });

      setStatus(res.data.status);
      setInfo(res.data);

      if (res.data.status === "valid") {
        navigator.vibrate?.(200);
      }
    } catch (err) {
      setStatus("invalid");
      setInfo(null);
    }
  }

  function scanNext() {
    setStatus(null);
    setInfo(null);
    setScanning(true);
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md">

        <h1 className="text-2xl font-bold mb-4 text-center">
          Ticket Verification
        </h1>

        {/* CAMERA VIEW */}
        {scanning && <div id="qr-reader" className="mb-4" />}

        {/* RESULT */}
        {status && (
          <div className="mt-4 text-center text-lg">

            {status === "valid" && (
              <div className="text-green-400">
                ✅ ENTRY ALLOWED
                <div className="mt-2 text-sm">
                  <p><b>Event:</b> {info.event}</p>
                  <p><b>User:</b> {info.user}</p>
                  <p>
                    <b>Ticket:</b> {info.ticket_type} × {info.quantity}
                  </p>
                </div>
              </div>
            )}

            {status === "already_used" && (
              <p className="text-yellow-400">⚠️ Ticket Already Used</p>
            )}

            {status === "not_allowed_for_this_event" && (
              <p className="text-red-400">
                ❌ Not your event
              </p>
            )}

            {status === "invalid" && (
              <p className="text-red-400">❌ Invalid QR</p>
            )}

            <button
              onClick={scanNext}
              className="mt-4 w-full bg-white text-black py-2 rounded-lg hover:bg-gray-200"
            >
              Scan Next Ticket
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default VerifyQR;
