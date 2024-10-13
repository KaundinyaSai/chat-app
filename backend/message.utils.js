import crypto from "crypto";

const alg = "aes-256-cbc"; // Advanced Encryption Standard(standard for encrption) - 256(key size in bytes) - Cipher block chaining(idk what cbc means).
const secret = process.env.AES_SECRET;
const iv = crypto.randomBytes(16); // init vector

function encryptMessage(message) {
  const cipher = crypto.createCipheriv(alg, Buffer.from(secret), iv); //creates cipher by using the alg, buffer(binary) of the secret and the init vector.
  let encrypted = cipher.update(message); //cipher.update just proceess the message and encrypts it(i think).
  encrypted = Buffer.concat([encrypted, cipher.final()]); //.final finalizes the encryption and buffer.concat concats(mergerws or something) the previos encryption to the finalized cipher(Dont ask me more even im new to this stuff);
  return iv.toString("hex") + ":" + encrypted.toString("hex"); //return message.
}

function decryptMessage(encryptedMessage) {
  const [ivHex, encryptedHex] = encryptedMessage.split(":"); //splits encrypted message into iv(in hex format) and the message itself(also in hex format).
  //converts hex to buffeer(binary).
  const ivBuffer = Buffer.from(ivHex, "hex");
  const encryptedBuffer = Buffer.from(encryptedHex, "hex");
  //deciphers the message and returns it. same as encrypt part just for deciphering.
  const decipher = crypto.createDecipheriv(alg, Buffer.from(secret), ivBuffer);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export { encryptMessage, decryptMessage };
