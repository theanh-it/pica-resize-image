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
- ✅ Hỗ trợ crop ảnh theo kiểu cover (giống CSS object-fit: cover)
- ✅ Tương thích với Vue, React, Angular và các framework frontend khác
- ✅ Chỉ hoạt động trong môi trường browser

## Setup và Configuration

### Vue.js

#### Vue 3 (Composition API)

```HTML
<!-- App.vue -->
<template>
  <div>
    <input type="file" @change="handleFileUpload" accept="image/*" />
    <div v-if="preview" class="preview">
      <img :src="preview" alt="Preview" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { resizeImage, MIME_TYPE, OUTPUT_TYPE } from "pica-resize-image";

const preview = ref<string>("");

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      const resizedImage = await resizeImage(file, {
        width: 800,
        mimeType: MIME_TYPE.webp,
        quality: 0.8,
        output: OUTPUT_TYPE.base64,
      });

      preview.value = resizedImage as string;
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  }
};
</script>
```

#### Vue 2 (Options API)

```HTML
<template>
  <div>
    <input type="file" @change="handleFileUpload" accept="image/*" />
    <div v-if="preview" class="preview">
      <img :src="preview" alt="Preview" />
    </div>
  </div>
</template>

<script>
import { resizeImage, MIME_TYPE, OUTPUT_TYPE } from "pica-resize-image";

export default {
  data() {
    return {
      preview: "",
    };
  },
  methods: {
    async handleFileUpload(event) {
      const input = event.target;
      const file = input.files?.[0];

      if (file) {
        try {
          const resizedImage = await resizeImage(file, {
            width: 800,
            mimeType: MIME_TYPE.webp,
            quality: 0.8,
            output: OUTPUT_TYPE.base64,
          });

          this.preview = resizedImage;
        } catch (error) {
          console.error("Error resizing image:", error);
        }
      }
    },
  },
};
</script>
```

## Sử dụng

### Framework Support

Package này được thiết kế để hoạt động trong môi trường browser và tương thích với các framework frontend:

- **Vue.js** (Vue 2, Vue 3)
- **Nuxt.js** (Nuxt 2, Nuxt 3)
- **React**
- **Angular**
- **Svelte**
- **Vanilla JavaScript**

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

// Resize với crop cover (giống CSS object-fit: cover)
const resizedFile = await resizeImage(imageFile, {
  width: 800,
  height: 600,
  cover: true, // Crop ảnh để vừa khít với kích thước đích
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
  cover?: boolean; // Crop ảnh theo kiểu cover (giống CSS object-fit: cover)
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

### Vanilla JavaScript

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

      // Tạo ảnh cover cho banner
      const bannerImage = await resizeImage(file, {
        width: 1200,
        height: 400,
        cover: true, // Crop ảnh để vừa khít với kích thước banner
        mimeType: MIME_TYPE.webp,
        quality: 0.9,
        output: OUTPUT_TYPE.file,
      });

      console.log("Banner image created:", bannerImage);
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  }
};
```

### Vue.js

```vue
<template>
  <div>
    <input type="file" @change="handleFileUpload" accept="image/*" />
    <div v-if="preview" class="preview">
      <img :src="preview" alt="Preview" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { resizeImage, MIME_TYPE, OUTPUT_TYPE } from "pica-resize-image";

const preview = ref<string>("");

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file) {
    try {
      const resizedImage = await resizeImage(file, {
        width: 800,
        mimeType: MIME_TYPE.webp,
        quality: 0.8,
        output: OUTPUT_TYPE.base64,
      });

      preview.value = resizedImage as string;
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  }
};
</script>
```

### React

```tsx
import React, { useState } from "react";
import { resizeImage, MIME_TYPE, OUTPUT_TYPE } from "pica-resize-image";

const ImageUploader: React.FC = () => {
  const [preview, setPreview] = useState<string>("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const resizedImage = await resizeImage(file, {
          width: 800,
          mimeType: MIME_TYPE.webp,
          quality: 0.8,
          output: OUTPUT_TYPE.base64,
        });

        setPreview(resizedImage as string);
      } catch (error) {
        console.error("Error resizing image:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} accept="image/*" />
      {preview && (
        <div className="preview">
          <img src={preview} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
```

## Lưu ý

- Package này sử dụng thư viện Pica để đảm bảo chất lượng resize tốt nhất
- **Chỉ hoạt động trong môi trường browser** - không thể sử dụng trong Node.js server-side
- Mặc định sẽ resize ảnh thành chiều cao 100px và giữ tỷ lệ khung hình
- Nếu chỉ cung cấp `width` hoặc `height`, chiều còn lại sẽ được tính tự động để giữ tỷ lệ
- Khi sử dụng `cover: true`, ảnh sẽ được crop để vừa khít với kích thước đích (giống CSS `object-fit: cover`)
- Chất lượng mặc định là 1.0 (chất lượng cao nhất)
- Định dạng mặc định là WebP
- Tên file được tạo tự động với timestamp và extension tương ứng với định dạng được chọn

## License

MIT
