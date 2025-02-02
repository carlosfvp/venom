import { generateMediaKey, getFileHash } from '../helper';

export async function encryptAndUploadFile(type, blob) {
  try {
    const filehash = await getFileHash(blob);
    const mediaKey = generateMediaKey(32);
    const controller = new AbortController();
    const signal = controller.signal;
    console.log(`called encryptAndUploadFile`, type, blob);
    const encrypted = await window.Store.UploadUtils.encryptAndUpload({
      blob,
      type,
      signal,
      mediaKey
    });
    return {
      ...encrypted,
      clientUrl: encrypted.url,
      filehash,
      id: filehash,
      uploadhash: encrypted.encFilehash,
      mediaBlob: blob
    };
  } catch (e) {
    console.log('encryptAndUploadFile exception', e);
    return false;
  }
}
