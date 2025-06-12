const FileUploader = require("../../../libs/utils/file-uploader");
const fileUploader = new FileUploader("modx");

const uploadFile = async (req) => {
  const fileName = fileUploader.getUploadedFileName(req);
  return fileName;
};
