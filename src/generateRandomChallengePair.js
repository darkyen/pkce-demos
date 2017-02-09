import crypto from 'crypto';
import base64URLEncode from './base64URLEncode';

export function sha256(buffer) {
    return crypto.createHash('sha256').update(buffer).digest();
}

export default function generateRandomChallengePair() {
    const codeVerifier = base64URLEncode(crypto.randomBytes(32));
    const codeChallenge = base64URLEncode(sha256(codeVerifier));
    return { codeVerifier, codeChallenge };
}
