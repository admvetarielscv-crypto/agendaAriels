const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export async function uploadImage(base64: string): Promise<string | null> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) return null;

  try {
    const blob = await (await fetch(base64)).blob();
    const fd = new FormData();
    fd.append("file", blob);
    fd.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: fd }
    );

    if (!res.ok) return null;

    const data: { secure_url?: string } = await res.json();
    if (!data.secure_url) return null;

    return data.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_800,c_limit/"
    );
  } catch {
    return null;
  }
}