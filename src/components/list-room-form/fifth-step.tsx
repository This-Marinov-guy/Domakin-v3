"use client";

import React, { useMemo, useState } from "react";
import StepsBar from "@/components/steps/stepsBar";
import Dropzone from "react-dropzone";
import { resizeFile } from "@/utils/helpers";
import useTranslation from "next-translate/useTranslation";
import { useStore } from "@/stores/storeContext";
import { observer } from "mobx-react-lite";
import { MdClose } from "react-icons/md";
import { toast, ToastContent } from "react-toastify";

interface FifthStepProps {
  steps: (string | number)[];
  currentStep: number;
}

function FifthStep({ steps, currentStep }: FifthStepProps) {
  const { t } = useTranslation("translations");
  const {
    propertyStore: { addListingData, updateListingData, errorFields, setHasNewImages },
  } = useStore();

  const images = addListingData.images || [];

  const [imageLoading, setImageLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleImagesChange = (newImages: any[]) => {
    updateListingData("images", "", newImages);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setImageLoading(true);
    setHasNewImages(true);
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
          (t("files.file_corrupted", {
            file: corruptedFiles.join(", "),
          }) || "Some files could not be processed.") as unknown as ToastContent<unknown>,
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

      const validImages = resizedImages.filter(Boolean) as File[];
      if (validImages.length) {
        handleImagesChange([...images, ...validImages]);
      }
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemove = (index: number) => {
    handleImagesChange(
      images.filter((_image: unknown, i: number) => i !== index)
    );
  };

  const handleSetMain = (index: number) => {
    if (index === 0) return;
    const mainImage = images[index];
    const remaining = images.filter((_image: unknown, i: number) => i !== index);
    handleImagesChange([mainImage, ...remaining]);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDropOn = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...images];
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, moved);

    handleImagesChange(updated);
    setDraggedIndex(null);
  };

  const previewUrls = useMemo(() => {
    return images.map((fileOrUrl: any) => {
      if (typeof fileOrUrl === "string") {
        return fileOrUrl;
      }

      if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
        return URL.createObjectURL(fileOrUrl);
      }

      return "";
    });
  }, [images]);

  return (
    <div className="list-room-modal__first-step mt-3">
      <div className="list-room-modal__first-step__body d-flex flex-column">
        <p>
          {t("list_room_steps.fifth.intro_1")}
        </p>
        <p>
          {t("list_room_steps.fifth.intro_2")}
        </p>

        <div className="mt-4">
          <h5 className="mb-4">
            {t("list_room_steps.fifth.wishlist_title")}
          </h5>
          <ul>
            <li>{t("list_room_steps.fifth.wishlist.private_rooms")}</li>
            <li>{t("list_room_steps.fifth.wishlist.common_areas")}</li>
            <li>{t("list_room_steps.fifth.wishlist.bathroom_toilet")}</li>
            <li>{t("list_room_steps.fifth.wishlist.amenities")}</li>
            <li>{t("list_room_steps.fifth.wishlist.outdoors")}</li>
            <li>{t("list_room_steps.fifth.wishlist.private_furniture")}</li>
          </ul>


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
            onDropRejected={() => {
              toast.error(
                (t("list_room_steps.fifth.upload_rejected") ||
                  "File upload rejected. Please check file size and format.") as unknown as ToastContent<unknown>,
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
            }}
          >
            {({ getRootProps, getInputProps, isDragActive }) => (
              <div className="w-100" {...getRootProps()}>
                <input {...getInputProps()} />
                <div
                  className={`file-dropzone-container ${errorFields.includes("images") ? "is-invalid" : ""
                    }`}
                >
                  {imageLoading ? (
                    <p>{t("common.loading")}</p>
                  ) : (
                    <div className="text-center">
                      <i
                        className="fa-light fa-image"
                        style={{ color: "#FF6725", fontSize: "30px" }}
                      ></i>
                      <p>
                        {isDragActive
                          ? t("files.drag_files") || "Drop files here"
                          : t("files.drag_files")}
                      </p>
                      <small className="d-block">
                        {t("files.allowed_types_note", {
                          allowed_types:
                            "jpg, png, jpeg, webp, svg, bmp, heic, mp4",
                        })}
                      </small>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Dropzone>
        </div>

        {images.length > 0 && (
          <div className="mt-4">
            <div className="row mb-4 align-items-center justify-content-between">
              <h5 className="col-md-6 col-12">{t("list_room_steps.fifth.preview_order_title")}</h5>
              <small className="col-md-6 col-12 text-muted w-auto">
                {t("list_room_steps.fifth.preview_order_hint")}
              </small>
            </div>

            <div className="row">
              {images.map((_image: unknown, index: number) => {
                const src = previewUrls[index];

                if (!src) return null;

                return (
                  <div
                    key={index}
                    className="col-6 col-sm-4 col-md-3 col-lg-2 mb-3 position-relative"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDropOn(index)}
                    style={{ cursor: "move" }}
                  >
                    <div
                      className="position-relative w-100 h-100"
                      onClick={() => handleSetMain(index)}
                    >
                      <div className="ratio ratio-1x1">
                        <img
                          src={src}
                          alt={`Property image ${index + 1}`}
                          className="w-100 h-100 rounded border object-fit-cover"
                        />
                      </div>
                      {index === 0 && (
                        <span className="badge bg-primary position-absolute top-0 start-0 m-2">
                          {t("list_room_steps.fifth.main_badge")}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="position-absolute top-0 end-0"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(index);
                      }}
                      style={{
                        zIndex: 100,
                        borderRadius: "20%",
                        width: "30px",
                        height: "30px",
                        background: "#dc3545",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        padding: 0,
                        margin: "5px",
                        boxShadow: "0 0 5px rgba(0,0,0,0.5)",
                      }}
                    >
                      <MdClose size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(FifthStep);