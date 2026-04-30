// PDF download utility

/**
 * Download a PDF from a URL
 * @param {string} url - The URL of the PDF
 * @param {string} filename - The desired filename for the download
 */
export const downloadPdfFromUrl = (url, filename = 'download.pdf') => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Download a PDF from a base64 string
 * @param {string} base64 - Base64 encoded PDF data
 * @param {string} filename - The desired filename for the download
 */
export const downloadPdfFromBase64 = (base64, filename = 'download.pdf') => {
  const byteCharacters = atob(base64);
  const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  const url = URL.createObjectURL(blob);
  downloadPdfFromUrl(url, filename);
  URL.revokeObjectURL(url);
};
