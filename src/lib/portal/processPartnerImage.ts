import {
  PARTNER_IMAGE_ACCEPT,
  PARTNER_IMAGE_MAX_PROCESSED_BYTES,
  PARTNER_IMAGE_MAX_UPLOAD_BYTES,
  PARTNER_IMAGE_MIME,
  PARTNER_IMAGE_OUTPUT_SIZE,
} from "./partnerImages";

const ACCEPTED_TYPES = new Set(PARTNER_IMAGE_ACCEPT.split(","));

function formatMegabytes(bytes: number): string {
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not process image."));
          return;
        }
        resolve(blob);
      },
      PARTNER_IMAGE_MIME,
      quality
    );
  });
}

/** Centre-crop to 1:1, resize, and compress for upload. */
export async function processPartnerImage(file: File): Promise<File> {
  if (file.size > PARTNER_IMAGE_MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image must be ${formatMegabytes(PARTNER_IMAGE_MAX_UPLOAD_BYTES)} or smaller.`
    );
  }

  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error("Please upload a JPG, PNG, or WebP image.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Could not read that image. Try a different file.");
  }

  if (bitmap.width < 200 || bitmap.height < 200) {
    bitmap.close();
    throw new Error("Image must be at least 200×200 pixels.");
  }

  const cropSize = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - cropSize) / 2;
  const sy = (bitmap.height - cropSize) / 2;
  const outputSize = Math.min(PARTNER_IMAGE_OUTPUT_SIZE, cropSize);

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not process image.");
  }

  ctx.drawImage(bitmap, sx, sy, cropSize, cropSize, 0, 0, outputSize, outputSize);
  bitmap.close();

  let quality = 0.88;
  let blob = await canvasToJpegBlob(canvas, quality);

  while (blob.size > PARTNER_IMAGE_MAX_PROCESSED_BYTES && quality > 0.52) {
    quality -= 0.08;
    blob = await canvasToJpegBlob(canvas, quality);
  }

  if (blob.size > PARTNER_IMAGE_MAX_PROCESSED_BYTES) {
    throw new Error(
      "Image is still too large after compression. Try a smaller or simpler photo."
    );
  }

  return new File([blob], "cover.jpg", {
    type: PARTNER_IMAGE_MIME,
    lastModified: Date.now(),
  });
}
