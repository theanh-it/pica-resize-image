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
  cover?: boolean;
};

const coverImage = (
  image: HTMLImageElement,
  options: ReadFileBeforeResizeOptions
): Promise<HTMLImageElement> => {
  const targetRatio = options.width! / options.height!;
  const imageRatio = image.width / image.height;

  let cropWidth, cropHeight, cropX, cropY;

  if (imageRatio > targetRatio) {
    // Ảnh rộng hơn, cần crop theo chiều rộng
    cropHeight = image.height;
    cropWidth = image.height * targetRatio;
    cropX = (image.width - cropWidth) / 2;
    cropY = 0;
  } else {
    // Ảnh cao hơn, cần crop theo chiều cao
    cropWidth = image.width;
    cropHeight = image.width / targetRatio;
    cropX = 0;
    cropY = (image.height - cropHeight) / 2;
  }

  // Tạo canvas tạm để crop
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCanvas.width = cropWidth;
  tempCanvas.height = cropHeight;

  // Crop ảnh
  tempCtx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  // Tạo ảnh mới từ phần đã crop
  const croppedImage = new Image();
  croppedImage.src = tempCanvas.toDataURL();

  return new Promise((resolve, reject) => {
    croppedImage.onload = () => resolve(croppedImage);
    croppedImage.onerror = (error) => reject(error);
  });
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
      image.onload = async () => {
        if (!options) {
          const percent = 100 / image.height;
          canvas.width = percent * image.width;
          canvas.height = 100;

          return resolve({ from: image, to: canvas });
        } else if (options.width && options.height && options.cover) {
          const croppedImage = await coverImage(image, options);
          canvas.width = options.width;
          canvas.height = options.height;

          return resolve({ from: croppedImage, to: canvas });
        } else if (options.width && options.height) {
          canvas.width = options.width;
          canvas.height = options.height;

          return resolve({ from: image, to: canvas });
        } else if (options.width) {
          const percent = options.width / image.width;
          canvas.width = options.width;
          canvas.height = percent * image.height;

          return resolve({ from: image, to: canvas });
        } else if (options.height) {
          const percent = options.height / image.height;
          canvas.width = percent * options.height;
          canvas.height = options.height;

          return resolve({ from: image, to: canvas });
        }
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
  cover?: boolean;
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
