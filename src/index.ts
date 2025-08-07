import Pica from "pica";

export type OutputType = "file" | "base64" | "blob";

export const OUTPUT_TYPE: Record<OutputType, OutputType> = {
  file: "file",
  blob: "blob",
  base64: "base64",
};

export type MimeType = {
  mimeType: string;
  extension: string;
};

export const MIME_TYPE: Record<string, MimeType> = {
  png: {
    mimeType: "image/png",
    extension: "png",
  },
  jpeg: {
    mimeType: "image/jpeg",
    extension: "jpeg",
  },
  webp: {
    mimeType: "image/webp",
    extension: "webp",
  },
};

type ReadFileBeforeResizeOptions = {
  width?: number;
  height?: number;
};

const readFileBeforeResize = (
  file: File,
  options?: ReadFileBeforeResizeOptions
) => {
  const canvas = document.createElement("canvas");
  const image = new Image();
  image.src = URL.createObjectURL(file);

  return new Promise<{ from: HTMLImageElement; to: HTMLCanvasElement }>(
    (resolve, reject) => {
      image.onload = () => {
        if (!options) {
          const percent = 100 / image.height;
          canvas.width = percent * image.width;
          canvas.height = 100;
        } else if (options.width && options.height) {
          canvas.width = options.width;
          canvas.height = options.height;
        } else if (options.width) {
          const percent = options.width / image.width;
          canvas.width = options.width;
          canvas.height = percent * image.height;
        } else if (options.height) {
          const percent = options.height / image.height;
          canvas.width = percent * options.height;
          canvas.height = options.height;
        }

        resolve({ from: image, to: canvas });
      };

      image.onerror = (error) => reject(error);
    }
  );
};

const blobToFile = (blob: Blob, mimeType: MimeType) => {
  const prefix = new Date().getTime();
  const suffix = Math.random().toString(36).slice(2);

  return new File([blob], `image-${prefix}-${suffix}.${mimeType.extension}`, {
    type: mimeType.mimeType,
  });
};

const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

type ResizeType = {
  from: HTMLImageElement;
  to: HTMLCanvasElement;
  mimeType: MimeType;
  quality: number;
  output: OutputType;
};

const resize = ({ from, to, mimeType, quality, output }: ResizeType) => {
  const pica = Pica();

  return pica
    .resize(from, to)
    .then((result) => pica.toBlob(result, mimeType.mimeType, quality))
    .then((resizedBlob) => {
      switch (output) {
        case OUTPUT_TYPE.file:
          return blobToFile(resizedBlob, mimeType);
        case OUTPUT_TYPE.base64:
          return blobToBase64(resizedBlob);
        case OUTPUT_TYPE.blob:
          return resizedBlob;
      }
    })
    .catch((error) => error);
};

export type ResizeImageOptions = {
  width?: number;
  height?: number;
  mimeType?: MimeType;
  quality?: number;
  output?: OutputType;
};

export const resizeImage = async (
  image: File,
  options?: ResizeImageOptions
) => {
  const { from, to } = await readFileBeforeResize(image, options);

  const mimeType = options?.mimeType || MIME_TYPE.webp;
  const quality = options?.quality || 1;
  const output = options?.output || "file";

  return resize({ from, to, mimeType, quality, output });
};

export const resizeImages = async (
  images: File[],
  options?: ResizeImageOptions
) => {
  const mimeType = options?.mimeType || MIME_TYPE.webp;
  const quality = options?.quality || 1;
  const output = options?.output || "file";

  const readImagesBeforeResize = await Promise.all(
    images.map((image) => readFileBeforeResize(image, options))
  );

  return Promise.all(
    readImagesBeforeResize.map(({ from, to }) =>
      resize({ from, to, mimeType, quality, output })
    )
  );
};
