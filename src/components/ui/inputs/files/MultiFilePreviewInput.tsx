import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { resizeFile } from "@/utils/helpers";
import useTranslation from "next-translate/useTranslation";

const PrefixMultiFilePreviewInput = (props: any) => {
  const { onInput, onReject, maxSizeNote, allowedFormatsNotes, isInvalid } = props;

  const { t } = useTranslation("translations");

  const [files, setFiles] = useState<any[]>([]);
  const [imageLoading, setImageLoading] = useState(false);

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();

    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    onInput && onInput(files.filter((_, i) => i !== index));
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setImageLoading(true);
    try {
      const resizedImages = await Promise.all(
        acceptedFiles.map(async (file: File) => {
          try {
            return await resizeFile(file);
          } catch (err) {
            // toast({
            //   title: t("common.inputs.imageInput.file_error", {
            //     fileName: file.fileName,
            //   }),
            //   status: "error",
            //   duration: 10000,
            //   isClosable: true,
            // });
          }
        })
      );
      setFiles(resizedImages);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setImageLoading(false);
      //   checkoutStore.setIsLoading(false);
    }
  };

  return (
    <div className="flex items-stretch justify-center gap-3 lg:flex-row md:flex-col sm:flex-col">
      <Dropzone
        onDrop={onDrop}
        accept={{
          "image/jpeg": [],
          "image/png": [],
          "image/webp": [],
          "image/jpg": [],
          "image/svg+xml": [".svg"],
          "image/bmp": [],
          "image/heic": [".heif", ".heic"],
        }}
        maxFiles={5}
        onDropRejected={onReject}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className='w-full' {...getRootProps()}>
            <input {...getInputProps()} />
            <div
              className={`file-dropzone-container ${
                isInvalid ? "is-invalid" : ""
              }`}
            >
              {imageLoading ? (
                <p>{t("common.loading")}</p>
              ) : (
                <div className="text-center">
                  <i
                    className="fa-light fa-cloud-arrow-up"
                    style={{ color: "purple", fontSize: "30px" }}
                  ></i>
                  <p>{t("files.drag_files")}</p>
                  {files.length > 0 &&
                    files.map((file, index) => (
                      <div key={index} className="file-preview">
                        <p>{file.name}</p>
                        <i
                          onClick={(e) => handleRemove(e, index)}
                          className="fa-solid fa-xmark error z-100 cursor-pointer"
                        ></i>
                      </div>
                    ))}
                    
                  {!!maxSizeNote && <small>{maxSizeNote}</small>}
                  <br/>
                  {!!allowedFormatsNotes && (
                    <small>{allowedFormatsNotes}</small>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default PrefixMultiFilePreviewInput;
