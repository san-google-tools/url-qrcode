import React, { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

const App = () => {
  const [tabLink, setTabLink] = useState("");
  const qrCodeRef = useRef(null);
  const [qrSize, setQRSize] = useState(0);
  const [showTag, toggleShow] = useState(false);

  const handleCopyLink = useCallback(async () => {
    if (window.navigator.clipboard) {
      await window.navigator.clipboard.writeText(tabLink);
      toggleShow(true);
      const timer = setTimeout(() => {
        toggleShow(false);
        clearTimeout(timer);
      }, 1000);
    }
  }, [tabLink]);

  useEffect(() => {
    if (qrCodeRef.current) {
      const width = qrCodeRef.current?.getBoundingClientRect().width ?? 0;
      setQRSize(width);
    }

    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      setTabLink(tab.url);
    })();
  }, []);

  return (
    <div id="popup-root">
      <div className="qrcode-root">
        <div className="qrcode">
          <div className="qrcode-container">
            <div id="qrcode" ref={qrCodeRef}>
              <QRCode value={tabLink} size={qrSize} bgColor={"#212529"} fgColor={"#ffffff"} />
            </div>
          </div>
        </div>
      </div>
      <div className="link-root">
        <div className="link-text">{tabLink}</div>
        <div className="btn-group">
          <button id="change-color-btn" onClick={handleCopyLink}>
            复制链接
          </button>
        </div>
      </div>

      <div
        id="copy-success-text"
        style={{ display: showTag ? "flex" : "none" }}
      >
        <i>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-check-circle-fill"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
          </svg>
        </i>
        <span>复制成功</span>
      </div>
    </div>
  );
};

export default App;
