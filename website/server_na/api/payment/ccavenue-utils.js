import CryptoJS from 'crypto-js';


class Configure {
    constructor() {
        const runtimeConfig = useRuntimeConfig();
        let initOptions = {
            working_key: runtimeConfig.public.WORKING_KEY,
            merchant_id: runtimeConfig.public.MERCHANT_ID,
        }

        this.initOptions = initOptions;
    }

    encrypt(plainText) {
        if (!plainText || !this.initOptions.working_key) throw new Error("Missing required parameters");

        const key = CryptoJS.MD5(this.initOptions.working_key);
        const iv = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
        const encrypted = CryptoJS.AES.encrypt(plainText, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString();
    }

    decrypt(encText) {
        if (!encText || !this.initOptions.working_key) throw new Error("Missing required parameters");

        const key = CryptoJS.MD5(this.initOptions.working_key);
        const iv = CryptoJS.enc.Hex.parse('000102030405060708090a0b0c0d0e0f');
        const ciphertext = CryptoJS.enc.Hex.parse(encText);
        const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
        const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    redirectResponseToJson(response) {
        const decryptedResponse = this.decrypt(response);
        return decryptedResponse.split("&").reduce((acc, pair) => {
            let [key, value] = pair.split("=");
            acc[key] = value;
            return acc;
        }, {});
    }

    getEncryptedOrder(orderParams) {
        let data = `merchant_id=${this.initOptions.merchant_id}`;
        data += Object.entries(orderParams).map(([key, value]) => `&${key}=${value}`).join("");
        return this.encrypt(data);
    }
}

export default new Configure();
