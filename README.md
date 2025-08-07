# pica-resize-image

Một plugin resize ảnh dựa trên thư viện Pica, hỗ trợ resize ảnh với nhiều định dạng đầu ra khác nhau.

## Cài đặt

```bash
# Sử dụng npm
npm install pica-resize-image

# Sử dụng yarn
yarn add pica-resize-image

# Sử dụng bun
bun add pica-resize-image
```

## Tính năng

- ✅ Resize ảnh với kích thước tùy chỉnh
- ✅ Hỗ trợ nhiều định dạng đầu ra: File, Blob, Base64
- ✅ Hỗ trợ định dạng PNG, JPEG và WebP
- ✅ Resize một ảnh hoặc nhiều ảnh cùng lúc
- ✅ Tùy chỉnh chất lượng ảnh
- ✅ Tự động tính toán tỷ lệ khung hình

## Sử dụng

### Import

```typescript
import {
  resizeImage,
  resizeImages,
  MIME_TYPE,
  OUTPUT_TYPE,
} from "pica-resize-image";
```

### Resize một ảnh

```typescript
// Resize với kích thước mặc định (chiều cao 100px, giữ tỷ lệ)
const resizedFile = await resizeImage(imageFile);

// Resize với kích thước tùy chỉnh
const resizedFile = await resizeImage(imageFile, {
  width: 800,
  height: 600,
});

// Resize chỉ chiều rộng, tự động tính chiều cao
const resizedFile = await resizeImage(imageFile, {
  width: 800,
});

// Resize chỉ chiều cao, tự động tính chiều rộng
const resizedFile = await resizeImage(imageFile, {
  height: 600,
});
```

### Resize nhiều ảnh

```typescript
const resizedFiles = await resizeImages([imageFile1, imageFile2, imageFile3], {
  width: 800,
  height: 600,
});
```

### Tùy chọn đầu ra

```typescript
// Đầu ra dạng File (mặc định)
const file = await resizeImage(imageFile, {
  output: OUTPUT_TYPE.file,
});

// Đầu ra dạng Blob
const blob = await resizeImage(imageFile, {
  output: OUTPUT_TYPE.blob,
});

// Đầu ra dạng Base64
const base64 = await resizeImage(imageFile, {
  output: OUTPUT_TYPE.base64,
});
```

### Tùy chọn định dạng và chất lượng

```typescript
// Sử dụng định dạng PNG
const pngFile = await resizeImage(imageFile, {
  mimeType: MIME_TYPE.png,
  quality: 1.0,
});

// Sử dụng định dạng JPEG với chất lượng 0.8
const jpegFile = await resizeImage(imageFile, {
  mimeType: MIME_TYPE.jpeg,
  quality: 0.8,
});

// Sử dụng định dạng WebP với chất lượng 1.0 (mặc định)
const webpFile = await resizeImage(imageFile, {
  mimeType: MIME_TYPE.webp,
  quality: 1.0,
});
```

## API Reference

### `resizeImage(image: File, options?: ResizeImageOptions)`

Resize một ảnh với các tùy chọn.

**Parameters:**

- `image: File` - File ảnh cần resize
- `options?: ResizeImageOptions` - Tùy chọn resize

**Returns:** Promise với kết quả tùy theo `output` type

### `resizeImages(images: File[], options?: ResizeImageOptions)`

Resize nhiều ảnh với cùng tùy chọn.

**Parameters:**

- `images: File[]` - Mảng các file ảnh cần resize
- `options?: ResizeImageOptions` - Tùy chọn resize

**Returns:** Promise với mảng kết quả

### `ResizeImageOptions`

```typescript
type ResizeImageOptions = {
  width?: number; // Chiều rộng mới (px)
  height?: number; // Chiều cao mới (px)
  mimeType?: MimeType; // Định dạng đầu ra
  quality?: number; // Chất lượng (0-1)
  output?: OutputType; // Kiểu đầu ra
};
```

**Chú thích về tham số `quality`:**

- Giá trị từ `0` đến `1`
- `0`: Chất lượng thấp nhất, kích thước file nhỏ nhất
- `1`: Chất lượng cao nhất, kích thước file lớn nhất (mặc định)
- Chỉ áp dụng cho định dạng JPEG và WebP
- Định dạng PNG không bị ảnh hưởng bởi tham số này vì PNG là định dạng không mất dữ liệu

### `MIME_TYPE`

```typescript
const MIME_TYPE = {
  png: { mimeType: "image/png", extension: "png" },
  jpeg: { mimeType: "image/jpeg", extension: "jpeg" },
  webp: { mimeType: "image/webp", extension: "webp" },
};
```

### `OUTPUT_TYPE`

```typescript
const OUTPUT_TYPE = {
  file: "file", // Trả về File object
  blob: "blob", // Trả về Blob object
  base64: "base64", // Trả về Base64 string
};
```

## Ví dụ hoàn chỉnh

```typescript
import { resizeImage, MIME_TYPE, OUTPUT_TYPE } from "pica-resize-image";

// Xử lý upload ảnh
const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      // Resize ảnh thành thumbnail
      const thumbnail = await resizeImage(file, {
        width: 300,
        height: 200,
        mimeType: MIME_TYPE.webp,
        quality: 0.8,
        output: OUTPUT_TYPE.file,
      });

      console.log("Thumbnail created:", thumbnail);

      // Tạo preview base64
      const preview = await resizeImage(file, {
        width: 800,
        output: OUTPUT_TYPE.base64,
      });

      console.log("Preview:", preview);
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  }
};
```

## Lưu ý

- Package này sử dụng thư viện Pica để đảm bảo chất lượng resize tốt nhất
- Mặc định sẽ resize ảnh thành chiều cao 100px và giữ tỷ lệ khung hình
- Nếu chỉ cung cấp `width` hoặc `height`, chiều còn lại sẽ được tính tự động để giữ tỷ lệ
- Chất lượng mặc định là 1.0 (chất lượng cao nhất)
- Định dạng mặc định là WebP
- Tên file được tạo tự động với timestamp và extension tương ứng với định dạng được chọn

## License

MIT
