import Image, { StaticImageData } from "next/image";
import Fancybox from "@/components/common/Fancybox";
import { useState } from "react";

const MediaGallery = ({ style, images }: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [thumbGroup, setThumbGroup] = useState(0);

  const IMAGES_PER_GROUP = 3;

  const totalGroups = Math.ceil(images.length / IMAGES_PER_GROUP);

  const getCurrentThumbnails = () => {
    const start = thumbGroup * IMAGES_PER_GROUP;
    return images.slice(start, start + IMAGES_PER_GROUP);
  };

  const showNavigation = images.length > IMAGES_PER_GROUP;

  const handleNextGroup = () => {
    if (thumbGroup < totalGroups - 1) {
      setThumbGroup((prev) => prev + 1);
    }
  };

  const handlePrevGroup = () => {
    if (thumbGroup > 0) {
      setThumbGroup((prev) => prev - 1);
    }
  };

  return (
    <div className="media-gallery mt-40">
      <div id="media_slider" className="carousel slide row">
        <div
          className={`col-lg-10 bg-white border-20 md-mb-20 ${
            style ? "" : "shadow4 p-30"
          }`}
        >
          <div className="position-relative z-1 overflow-hidden border-20">
            <div className="img-fancy-btn border-10 fw-500 fs-16 color-dark">
              {images.length}{" "}
              <span className="color-gray">
                <i className="fa-regular fa-images"></i>
              </span>
              <Fancybox
                options={{
                  Carousel: {
                    infinite: true,
                  },
                }}
              >
                {images.map((thumb: any, index: number) => (
                  <a
                    key={index}
                    className="d-block"
                    data-fancybox="img2"
                    href={thumb}
                  ></a>
                ))}
              </Fancybox>
            </div>

            <div className="d-flex align-items-center justify-content-around carousel-inner w-100">
              {images.map((image: any, index: number) => (
                <div
                  key={index}
                  className={`carousel-item ${
                    index === activeIndex ? "active" : ""
                  }`}
                >
                  <Image
                    src={image}
                    width={1000}
                    height={1000}
                    alt="gallery"
                    className="w-50 image-preview"
                  />
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              onClick={() =>
                setActiveIndex((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1
                )
              }
            >
              <i className="bi bi-chevron-left"></i>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              onClick={() =>
                setActiveIndex((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0
                )
              }
            >
              <i className="bi bi-chevron-right"></i>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div className="col-lg-2">
          <div
            className={`position-relative ${
              style ? "" : "border-15 bg-white shadow4"
            }`}
          >
            {showNavigation && (
              <div className="thumbnail-navigation d-flex justify-content-between align-items-center px-3 py-2">
                <button
                  className={`nav-btn ${thumbGroup === 0 ? "invisible" : ""}`}
                  onClick={handlePrevGroup}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <span className="nav-indicator">
                  {thumbGroup + 1} / {totalGroups}
                </span>
                <button
                  className={`nav-btn ${
                    thumbGroup === totalGroups - 1 ? "invisible" : ""
                  }`}
                  onClick={handleNextGroup}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}

            <div className="thumbnails-container p-3">
              <div className="thumbnails-column d-flex flex-row flex-lg-column gap-2" style={{minHeight: '7em'}}>
                {getCurrentThumbnails().map((image: any, i: number) => {
                  const currentIndex = thumbGroup * IMAGES_PER_GROUP + i;
                  return (
                    <button
                      key={currentIndex}
                      onClick={() => setActiveIndex(currentIndex)}
                      className={`thumbnail-item border-0 p-0 position-relative ${
                        currentIndex === activeIndex ? "active" : ""
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`thumbnail-${currentIndex}`}
                        width={200}
                        height={150}
                        className="img-fluid border-10"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaGallery;
