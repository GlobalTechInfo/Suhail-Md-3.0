const readline = require("readline");

const VALID_NUMBER = /^\d{8,15}$/;

const out = (...args) => {
  const fn = typeof global.log === "function" ? global.log : global.print;
  if (typeof fn === "function") return fn(...args);
  return process.stdout.write(args.join(" ") + "\n");
};

const ask = (rl, question) => new Promise(resolve => rl.question(question, a => resolve(String(a).trim())));

const isInteractive = () => Boolean(process.stdin.isTTY && process.stdout.isTTY);

/**
 * @returns {Promise<{mode: "qr"} | {mode: "code", code: string, number: string}>}
 */
async function askAuthMethod(sock) {
  const preset = String(process.env.AUTH_METHOD || "").toLowerCase().trim();

  if (sock.authState?.creds?.registered) return { mode: "qr" };

  if (!isInteractive()) {
    out(
      !preset
        ? "\n⚠️  No interactive terminal detected, falling back to QR code.\n" +
            "    (set AUTH_METHOD=code and PAIR_NUMBER=<digits> for headless pairing-code linking)"
        : `\nℹ️  AUTH_METHOD=${preset} (non-interactive)`
    );
    if (preset === "code") return requestCode(sock);
    return { mode: "qr" };
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    let mode = "";
    while (mode !== "qr" && mode !== "code") {
      const answer = (await ask(
        rl,
        "\n┌──────────────────────────────────────┐\n" +
          "│  How do you want to link this device? │\n" +
          "│    1 — QR code (scan from phone)      │\n" +
          "│    2 — Pairing code (type on phone)   │\n" +
          "└──────────────────────────────────────┘\n> "
      )).toLowerCase();
      if (["1", "qr"].includes(answer)) mode = "qr";
      else if (["2", "code", "pairing", "pair"].includes(answer)) mode = "code";
      else out("  ⚠️  Please enter 1 or 2.");
    }

    if (mode === "qr") return { mode: "qr" };

    // Pairing code needs the number, digits only with country code.
    let number = String(process.env.PAIR_NUMBER || "").replace(/\D/g, "");
    while (!VALID_NUMBER.test(number)) {
      number = (await ask(rl, "📱 Phone number with country code, digits only (e.g. 923051391007): ")).replace(/\D/g, "");
      if (!VALID_NUMBER.test(number)) out("  ⚠️  That doesn't look like a valid number (8-15 digits).");
    }
    return await requestCode(sock, number);
  } finally {
    rl.close();
  }
}

async function requestCode(sock, number) {
  if (!number) {
    number = String(process.env.PAIR_NUMBER || "").replace(/\D/g, "");
    if (!VALID_NUMBER.test(number)) throw new Error("PAIR_NUMBER must be 8-15 digits with country code");
  }
  const code = await sock.requestPairingCode(number);
  out(
    `\n🔗 Pairing code for +${number}: ${code}\n` +
      "   On your phone: WhatsApp → Settings → Linked Devices → Link a Device\n" +
      '   → "Link with phone number instead" → enter the code above.\n'
  );
  return { mode: "code", code, number };
}

module.exports = { askAuthMethod, requestCode };
