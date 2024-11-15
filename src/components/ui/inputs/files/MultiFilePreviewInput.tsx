import React, { useState } from "react";
import { cleanFileName, createFileName, resizeFile } from "@/utils/helpers";
import Dropzone from "react-dropzone";
import useTranslation from "next-translate/useTranslation";

const PrefixMultiFilePreviewInput = (props: any) => {
  const { onInput, onReject, maxSizeNote, allowedFormatsNotes } = props;

  const { t } = useTranslation("components");

  const [files, setFiles] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    setImageLoading(true);
    // checkoutStore.setIsLoading(true);

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

      // setFiles(resizedImages);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setImageLoading(false);
      //   checkoutStore.setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-stretch justify-content-center gap-3 flex-lg-row flex-md-column flex-sm-column">
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
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="file-dropzone-container">
              {imageLoading ? (
                <></>
              ) : //   <Spinner />
              files.length > 0 ? (
                files.map((file, index) => (
                  <div key={index} className="center_div">
                    <p>{createFileName(index + 1)}</p>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <i
                    className="fa-light fa-cloud-arrow-up"
                    style={{ color: "purple", fontSize: "30px" }}
                  ></i>
                  <p>Drag files or click to upload</p>
                  {!!maxSizeNote && <small>{maxSizeNote}</small>}
                  {!!allowedFormatsNotes && (
                    <small>{allowedFormatsNotes}</small>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Dropzone>

      <div className="file-preview-container">
        <div className="d-flex align-items-center justify-content-center gap-3">
          <i
            className="fa-regular fa-file-lines"
            style={{ color: "grey", fontSize: "30px" }}
          ></i>
          <i
            className="fa-regular fa-file-image"
            style={{ color: "grey", fontSize: "30px" }}
          ></i>
          <i
            className="fa-regular fa-file-code"
            style={{ color: "grey", fontSize: "30px" }}
          ></i>
        </div>
        <p style={{ fontSize: "1.3em" }} className="text-center mt-10">
          Upload files to see preview
        </p>
      </div>
    </div>
  );
};

export default PrefixMultiFilePreviewInput;
