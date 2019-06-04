
export enum ResultMsg {
  ValidationSuccess = "Validation Succcess!",
  ValidationTypeError = "File type is invalid!",
  ValidationSizeError = "File size is invalid!",

  UploadSuccess = "Upload Success.",
  UploadFailed = "Upload Failed.",
}

export enum ValidationResult {
  FileTypeInvalid,
  FileSizeInvalid,
  Success,
}
