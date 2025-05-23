import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useEffect, useRef } from "react";
import axios from "axios";

function QRScanner() {
  const [scanned, setScanned] = useState(false);
  const [accessType, setAccessType] = useState("ENTRY");
  const accessTypeRef = useRef("ENTRY");

  useEffect(() => {
    accessTypeRef.current = accessType;
    console.log("변경된 accessType:", accessType);
  }, [accessType]);


  const handleResult = async (result, error) => {
    if (result && !scanned) {
      const text = result?.text;
      console.log("QR 인식됨:", text);
      setScanned(true);
      const requestBody = {
        "qrCode": text,
        "accessType": accessTypeRef.current,
      }
      try {
        const res = await axios.post("http://13.125.140.66:8080/api/access/qr", requestBody);
        console.log("요청 데이터 : ", requestBody);
        alert(res.data.message);
      } catch (err) {
        console.error("백엔드 요청 실패:", err);
        alert("백엔드 요청 실패");
      }
    }

    if(error){
        console.error("QR 스캔 에러:", error.message);
    }
  };


  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        backgroundColor: "black"
      }}
    >
      {/* 헤더 영역 */}
      <div
        style={{
          height: "60px",
          minHeight: "60px",
          backgroundColor: "#000",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          boxSizing: "border-box"
        }}
      >
        <h2 style={{ margin: 0 }}>QR 리더기</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span>{accessType === "ENTRY" ? "입장 스캔" : "퇴장 스캔"}</span>
          <button
            onClick={() => {
              setAccessType(prev => (prev === "ENTRY" ? "EXIT" : "ENTRY"));
              setScanned(false);
            }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#222",
              border: "1px solid #666",
              borderRadius: "5px",
              color: "white",
              cursor: "pointer"
            }}
          >
            {accessType === "ENTRY" ? "퇴장 모드로 전환" : "입장 모드로 전환"}
          </button>
        </div>
      </div>

      {/* QR 스캔 영역 */}
      <div
        style={{
            width: "100%",
            maxWidth: "600px", // 너무 커지지 않도록 제한
            position: "relative",
            margin: "0 auto",
        }}
      >
        <QrReader
          constraints={{ facingMode: "environment" }}
          onResult={handleResult}
          containerStyle={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "relative"
          }}
          videoStyle={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0
          }}
        />
      </div>
    </div>
  );
}

export default QRScanner;
