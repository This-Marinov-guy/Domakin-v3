import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { resizeFile } from "@/utils/helpers";
import useTranslation from "next-translate/useTranslation";
import { observer } from "mobx-react-lite";
import { toast, ToastContent } from "react-toastify";

const PrefixMultiFilePreviewInput = (props: any) => {
  const {
    onChange,
    value,
    onReject,
    maxSizeNote,
    allowedFormatsNotes,
    isInvalid,
  } = props;

  const { t } = useTranslation("translations");

  const [imageLoading, setImageLoading] = useState(false);

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();

    onChange && onChange(value.filter((_: any, i: number) => i !== index));
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setImageLoading(true);
    const corruptedFiles: string[] = [];
    try {
      const resizedImages = await Promise.all(
        acceptedFiles.map(async (file: File) => {
          try {
            return await resizeFile(file);
          } catch (err) {
            corruptedFiles.push(file?.name ?? "-");
            return null;
          }
        })
      );
      if (corruptedFiles.length > 0) {
        toast.error(
          t("files.file_corrupted", { file: corruptedFiles.join(", ") }) as unknown as ToastContent<unknown>,
          {
            position: "top-center",
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
      onChange([...value, ...resizedImages.filter(Boolean)]);
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setImageLoading(false);
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
          "video/mp4": [".mp4"],
        }}
        maxFiles={10}
        onDropRejected={onReject}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div className="w-full" {...getRootProps()}>
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
                  {value.length > 0 &&
                    value.map((file: any, index: number) => (
                      file ? (
                        <div key={index} className="file-preview">
                          <p>{file.name ?? file.filename ?? '-'}</p>
                          <i
                            onClick={(e) => handleRemove(e, index)}
                            className="fa-solid fa-xmark error z-100 cursor-pointer"
                          ></i>
                        </div>
                      ) : null
                    ))}

                  {!!maxSizeNote && <small>{maxSizeNote}</small>}
                  <br />
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

export default observer(PrefixMultiFilePreviewInput);
