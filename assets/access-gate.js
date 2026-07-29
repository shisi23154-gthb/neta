(() => {
  const config = {
    salt: "ZdnRo6b4Z3hyH5HPvD9UPYA2",
    iterations: 210000,
    hash: "DqEZac7oXX5VGTG_en5HTk3aKmwuc7uvGdqerSXb-rE",
  };

  const storageKey = "neta-access-v1";
  const token = `${config.salt}:${config.iterations}:${config.hash}`;
  const root = document.documentElement;
  let replacedFrameset = false;

  const readStoredToken = (storage) => {
    try {
      return storage.getItem(storageKey);
    } catch {
      return null;
    }
  };

  const hasStoredAccess = () => (
    readStoredToken(window.localStorage) === token ||
    readStoredToken(window.sessionStorage) === token
  );

  if (hasStoredAccess()) {
    return;
  }

  root.classList.add("access-locked");

  const style = document.createElement("style");
  style.textContent = `
html.access-locked,
html.access-locked body {
  min-height: 100%;
}

html.access-locked body > :not(.access-gate) {
  display: none !important;
}

html.access-locked frameset {
  display: none !important;
}

.access-gate {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 1.25rem;
  background:
    radial-gradient(circle at 18% 16%, rgba(49, 111, 209, 0.18), transparent 24rem),
    linear-gradient(135deg, #10151b, #1d2630 48%, #11161c);
  color: #f6f9fc;
  font-family: "Zen Kaku Gothic New", "Noto Sans JP", "Segoe UI Variable Text", "Yu Gothic UI", "Hiragino Sans", "Meiryo", sans-serif;
  line-height: 1.55;
}

.access-card {
  width: min(100%, 24rem);
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  background: rgba(18, 24, 31, 0.92);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.32);
}

.access-kicker {
  margin: 0 0 0.35rem;
  color: #8fb7ff;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.access-card h1 {
  margin: 0 0 0.4rem;
  font-size: 1.45rem;
  line-height: 1.2;
}

.access-card p {
  margin: 0 0 1rem;
  color: #c6d0da;
  font-size: 0.92rem;
}

.access-field {
  display: grid;
  gap: 0.38rem;
  margin-bottom: 0.75rem;
  color: #dbe5ee;
  font-size: 0.86rem;
  font-weight: 800;
}

.access-field input {
  width: 100%;
  min-height: 2.8rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: #f7fafc;
  color: #121820;
  font: inherit;
  outline: none;
}

.access-field input:focus {
  border-color: #8fb7ff;
  box-shadow: 0 0 0 3px rgba(143, 183, 255, 0.24);
}

.access-remember {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 1rem;
  color: #c6d0da;
  font-size: 0.86rem;
}

.access-remember input {
  width: 1rem;
  height: 1rem;
  accent-color: #77a7ff;
}

.access-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 2.75rem;
  border: 1px solid #77a7ff;
  border-radius: 8px;
  background: #77a7ff;
  color: #10151b;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
}

.access-button:disabled {
  cursor: wait;
  opacity: 0.72;
}

.access-error {
  min-height: 1.3rem;
  margin-top: 0.72rem;
  color: #ffb9c4;
  font-size: 0.84rem;
  font-weight: 800;
}
`;
  document.head.append(style);

  const base64Url = (bytes) => {
    let value = "";
    bytes.forEach((byte) => {
      value += String.fromCharCode(byte);
    });
    return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  };

  const derivePasswordHash = async (password) => {
    const encoder = new TextEncoder();
    const key = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"],
    );
    const bits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: encoder.encode(config.salt),
        iterations: config.iterations,
        hash: "SHA-256",
      },
      key,
      256,
    );
    return base64Url(new Uint8Array(bits));
  };

  const equalHash = (left, right) => {
    if (left.length !== right.length) {
      return false;
    }

    let diff = 0;
    for (let index = 0; index < left.length; index += 1) {
      diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return diff === 0;
  };

  const storeAccess = (remember) => {
    const targetStorage = remember ? window.localStorage : window.sessionStorage;
    try {
      targetStorage.setItem(storageKey, token);
    } catch {
      window.sessionStorage.setItem(storageKey, token);
    }
  };

  const unlock = () => {
    if (replacedFrameset) {
      window.location.reload();
      return;
    }

    const gate = document.querySelector(".access-gate");
    gate?.remove();
    root.classList.remove("access-locked");
  };

  const ensureBody = () => {
    if (document.body && document.body.tagName.toLowerCase() !== "frameset") {
      return document.body;
    }

    const body = document.createElement("body");
    if (document.body) {
      replacedFrameset = true;
      document.body.replaceWith(body);
    } else {
      document.documentElement.append(body);
    }
    return body;
  };

  const mountGate = () => {
    const body = ensureBody();
    const gate = document.createElement("main");
    gate.className = "access-gate";
    gate.setAttribute("aria-label", "アクセスパスワード");
    gate.innerHTML = `
      <form class="access-card" autocomplete="off">
        <p class="access-kicker">Private</p>
        <h1>ピザッツ</h1>
        <p>アクセスするにはパスワードを入力してください。</p>
        <label class="access-field">
          <span>パスワード</span>
          <input type="password" name="password" autocomplete="current-password" required>
        </label>
        <label class="access-remember">
          <input type="checkbox" name="remember" checked>
          <span>この端末で保持する</span>
        </label>
        <button class="access-button" type="submit">入る</button>
        <div class="access-error" aria-live="polite"></div>
      </form>
    `;
    body.prepend(gate);

    const form = gate.querySelector("form");
    const input = gate.querySelector("input[name='password']");
    const remember = gate.querySelector("input[name='remember']");
    const button = gate.querySelector("button");
    const error = gate.querySelector(".access-error");

    if (!window.crypto?.subtle) {
      error.textContent = "このブラウザでは確認できません。HTTPSで開き直してください。";
      button.disabled = true;
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.textContent = "";
      button.disabled = true;
      button.textContent = "確認中";

      try {
        const nextHash = await derivePasswordHash(input.value);
        if (equalHash(nextHash, config.hash)) {
          storeAccess(remember.checked);
          unlock();
          return;
        }

        error.textContent = "パスワードが違います。";
        input.select();
      } catch {
        error.textContent = "確認中に失敗しました。もう一度試してください。";
      } finally {
        button.disabled = false;
        button.textContent = "入る";
      }
    });

    requestAnimationFrame(() => input.focus());
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountGate, { once: true });
  } else {
    mountGate();
  }
})();
