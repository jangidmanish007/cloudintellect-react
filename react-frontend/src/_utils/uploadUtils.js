import { fetcher, fetcherV2 } from "@/_utils/ApiBase";

export const getPreSignedUrl = async (params) => {
  try {
    const response = await fetcherV2('POST', process.env.GENERATE_PRESIGNED_URL, params);
    return response;
  } catch (err) {
    return null;
  }
};

// Validate filename for special characters
export function validateFileName(fileName) {
  const invalidChars = /[\\/:*?<>|#%]/;
  return !invalidChars.test(fileName);
}

// Sanitize filename by removing invalid characters
export function sanitizeFileName(fileName) {
  // Remove invalid characters: \/:*?<>|#%
  return fileName.replace(/[\\/:*?<>|#%]/g, '');
}

export async function uploadMediaWithUrl(uploadPath, file, returnFullUrl = false) {
  if (!file) return null;

  // Validate and sanitize filename
  if (!validateFileName(file.name)) {
    const sanitizedName = sanitizeFileName(file.name);
    // Create a new file with sanitized name
    file = new File([file], sanitizedName, { type: file.type });
  }

  const fileName = `${uploadPath}/${file.name}`;
  const fileParams = { file_names: [fileName] };

  try {
    const uploadResponse = await getPreSignedUrl(fileParams);
    if (uploadResponse?.status) {
      const uploadUrl = uploadResponse?.result?.[0];
      if (uploadUrl) {
        const uploadResult = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        if (!uploadResult.ok) {
          throw new Error(`Failed to upload file with status: ${uploadResult.status}`);
        }

        // Return full URL only if requested
        return returnFullUrl ? `${fileName}` : fileName;
      }
    }
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }

  return null;
}