export type OutputType = "file" | "base64" | "blob";

export const OUTPUT_TYPE: Record<OutputType, OutputType>;

export type MimeType = {
  mimeType: string;
  extension: string;
};

export const MIME_TYPE: Record<string, MimeType>;

export type ResizeImageOptions = {
  width?: number;
  height?: number;
  mimeType?: MimeType;
  quality?: number;
  output?: OutputType;
};

export declare function resizeImage(
  image: File,
  options?: ResizeImageOptions
): Promise<File | string | Blob>;

export declare function resizeImages(
  images: File[],
  options?: ResizeImageOptions
): Promise<(File | string | Blob)[]>;
