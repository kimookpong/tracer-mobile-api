# Upload API Documentation

## Overview

This API provides file upload, removal, and preview functionality with organized storage structure.

## File Structure

Files are stored in the following format:

```
/uploads/{category}/{year}/{newFilename}.{extension}
```

- **category**: Category of the file (e.g., farms, cattles, pens, documents)
- **year**: Current year (auto-generated)
- **newFilename**: Auto-generated UUID filename
- **extension**: Original file extension

## API Endpoints

### 1. Upload Single File

**POST** `/api/v1/upload/single`

Upload a single file.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**

- `file` (File, required): The file to upload
- `category` (String, optional): Category name (default: "general")

**Example Request:**

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("category", "farms");

fetch("/api/v1/upload/single", {
  method: "POST",
  headers: {
    Authorization: "Bearer your-token",
  },
  body: formData,
});
```

**Response:**

```json
{
  "status": "success",
  "message": "File(s) uploaded successfully",
  "data": [
    {
      "filename": "uuid-generated-name.jpg",
      "originalName": "my-photo.jpg",
      "filePath": "/uploads/farms/2025/uuid-generated-name.jpg",
      "contentType": "image/jpeg",
      "size": 102400,
      "category": "farms"
    }
  ]
}
```

---

### 2. Upload Multiple Files

**POST** `/api/v1/upload/multiple`

Upload multiple files (max 10 files).

**Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**

- `files` (File[], required): Array of files to upload (max 10)
- `category` (String, optional): Category name (default: "general")

**Example Request:**

```javascript
const formData = new FormData();
for (let i = 0; i < fileInput.files.length; i++) {
  formData.append("files", fileInput.files[i]);
}
formData.append("category", "cattles");

fetch("/api/v1/upload/multiple", {
  method: "POST",
  headers: {
    Authorization: "Bearer your-token",
  },
  body: formData,
});
```

**Response:**

```json
{
  "status": "success",
  "message": "File(s) uploaded successfully",
  "data": [
    {
      "filename": "uuid-1.jpg",
      "originalName": "photo1.jpg",
      "filePath": "/uploads/cattles/2025/uuid-1.jpg",
      "contentType": "image/jpeg",
      "size": 102400,
      "category": "cattles"
    },
    {
      "filename": "uuid-2.pdf",
      "originalName": "document.pdf",
      "filePath": "/uploads/cattles/2025/uuid-2.pdf",
      "contentType": "application/pdf",
      "size": 204800,
      "category": "cattles"
    }
  ]
}
```

---

### 3. Remove File

**POST** `/api/v1/upload/remove`

Delete a file from the server.

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**

```json
{
  "filePath": "/uploads/farms/2025/uuid-generated-name.jpg"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "File deleted successfully"
}
```

---

### 4. Preview File

**GET** `/api/v1/upload/preview/{category}/{year}/{filename}`

Preview or download a file.

**Parameters:**

- `category` (String): Category name
- `year` (String): Year
- `filename` (String): Filename

**Query Parameters:**

- `download` (Boolean, optional): Set to "true" to download instead of preview

**Example:**

```
GET /api/v1/upload/preview/farms/2025/uuid-name.jpg
GET /api/v1/upload/preview/farms/2025/document.pdf?download=true
```

**Response:**

- Returns the file as a stream
- Content-Type is set based on file extension
- For images: displays inline
- For documents: displays inline or downloads based on query parameter

---

### 5. Get File Info

**GET** `/api/v1/upload/info/{category}/{year}/{filename}`

Get information about a specific file.

**Headers:**

```
Authorization: Bearer {token}
```

**Parameters:**

- `category` (String): Category name
- `year` (String): Year
- `filename` (String): Filename

**Example:**

```
GET /api/v1/upload/info/farms/2025/uuid-name.jpg
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "filename": "uuid-name.jpg",
    "filePath": "/uploads/farms/2025/uuid-name.jpg",
    "size": 102400,
    "created": "2025-10-17T10:30:00.000Z",
    "modified": "2025-10-17T10:30:00.000Z",
    "extension": ".jpg",
    "category": "farms",
    "year": "2025"
  }
}
```

---

### 6. List Files

**GET** `/api/v1/upload/list/{category}/{year}`

List all files in a specific category and year.

**Headers:**

```
Authorization: Bearer {token}
```

**Parameters:**

- `category` (String): Category name
- `year` (String): Year

**Example:**

```
GET /api/v1/upload/list/farms/2025
```

**Response:**

```json
{
  "status": "success",
  "data": [
    {
      "filename": "uuid-1.jpg",
      "filePath": "/uploads/farms/2025/uuid-1.jpg",
      "size": 102400,
      "created": "2025-10-17T10:30:00.000Z",
      "modified": "2025-10-17T10:30:00.000Z",
      "extension": ".jpg"
    },
    {
      "filename": "uuid-2.pdf",
      "filePath": "/uploads/farms/2025/uuid-2.pdf",
      "size": 204800,
      "created": "2025-10-17T11:00:00.000Z",
      "modified": "2025-10-17T11:00:00.000Z",
      "extension": ".pdf"
    }
  ]
}
```

---

## Supported File Types

### Images

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Documents

- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx)

## File Size Limit

- Maximum file size: **10 MB** per file
- Multiple upload: Maximum **10 files** at once

## Categories

You can use any category name. Common categories:

- `farms` - Farm related documents
- `cattles` - Cattle photos and documents
- `pens` - Pen photos and documents
- `health` - Health records
- `vaccination` - Vaccination records
- `documents` - General documents
- `general` - Default category

## Error Responses

### 400 Bad Request

```json
{
  "status": "error",
  "message": "No file uploaded"
}
```

### 404 Not Found

```json
{
  "status": "error",
  "message": "File not found"
}
```

### File Type Error

```json
{
  "status": "error",
  "error": "Invalid file type. Only images, PDFs, and documents are allowed."
}
```

### File Size Error

```json
{
  "status": "error",
  "error": "File too large"
}
```

## Usage Examples

### Frontend (React/Vue)

```javascript
// Upload Single File
const uploadFile = async (file, category = "general") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  const response = await fetch("/api/v1/upload/single", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return await response.json();
};

// Upload Multiple Files
const uploadMultipleFiles = async (files, category = "general") => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  formData.append("category", category);

  const response = await fetch("/api/v1/upload/multiple", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return await response.json();
};

// Delete File
const deleteFile = async (filePath) => {
  const response = await fetch("/api/v1/upload/remove", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filePath }),
  });

  return await response.json();
};

// Get Preview URL
const getPreviewUrl = (category, year, filename) => {
  return `/api/v1/upload/preview/${category}/${year}/${filename}`;
};

// Get Download URL
const getDownloadUrl = (category, year, filename) => {
  return `/api/v1/upload/preview/${category}/${year}/${filename}?download=true`;
};
```

## Notes

1. All file uploads automatically generate new UUID-based filenames for security
2. Original filenames are preserved in the response for reference
3. Files are organized by category and year for easy management
4. Preview endpoint doesn't require authentication for easy embedding
5. All data keys are returned in camelCase format
6. Directory structure is created automatically if it doesn't exist
