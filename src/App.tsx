import "./styles/App.sass";

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Input from "./components/UI/input/Input";
import SearchIcon from "./assets/icons/SearchIcon";
import Button from "./components/UI/button/Button";
import { Image } from "./core/types";
import Spinner from "./components/UI/spinner/Spinner";
import ImageModal from "./components/imageModal/ImageModal";

const API_URL = "https://api.unsplash.com/search/photos";
const PER_PAGE = 30;

const App: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const [photos, setPhotos] = useState<Image[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [allowMoreRequests, setAllowMoreRequests] = useState<boolean>(true);

  const lastPhotoRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || loading || !allowMoreRequests) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && photos.length > 0) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      observer.current.observe(node);
    },
    [loading, photos, allowMoreRequests]
  );

  const loadPhotos = useCallback(async () => {
    try {
      if (
        searchInputRef.current?.value &&
        (!totalPages || totalPages >= page)
      ) {
        setLoading(true);

        const { data, headers } = await axios.get(API_URL, {
          params: {
            client_id: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
            query: searchInputRef.current?.value,
            per_page: PER_PAGE,
            page,
          },
        });

        const remainingRequests = headers["x-ratelimit-remaining"];

        if (remainingRequests === "0") {
          const retryAfterSeconds = 300;

          setErrorMsg(
            `Превышен лимит API. Пожалуйста, повторите попытку позже.`
          );
          setAllowMoreRequests(false);

          setTimeout(() => {
            setAllowMoreRequests(true);
          }, retryAfterSeconds * 1000);
        } else {
          if (!data.results.length) {
            setErrorMsg("К сожалению, поиск не дал результатов");
          } else {
            setPhotos((prevPhotos) => [...prevPhotos, ...data.results]);
            setTotalPages(data.total_pages);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching photos", error);
      setErrorMsg("Ошибка при загрузке изображений. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    totalPages,
    searchInputRef,
    setPhotos,
    setTotalPages,
    setLoading,
    setErrorMsg,
    setAllowMoreRequests,
  ]);

  useEffect(() => {
    loadPhotos();
  }, [page, loadPhotos]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPhotos([]);
    setPage(1);
    setErrorMsg("");
    setAllowMoreRequests(true);
    await loadPhotos();
  };

  const openImageModal = (image: Image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="main">
      <div className="mainBody">
        <div className="container">
          <div
            className={`search-section ${
              searchInputRef.current ? "searched" : ""
            }`}
          >
            <form onSubmit={handleSearch} className="search-form">
              <Input
                className="search-input"
                placeholder="Телефоны, яблоки, груши..."
                ref={searchInputRef}
                icon={<SearchIcon />}
              />
              <Button label="Искать" />
            </form>
          </div>

          {photos.length > 0 && (
            <div className="images">
              {photos.map((image, index) => {
                const photoRef =
                  photos.length === index + 20 ? lastPhotoRef : null;
                return (
                  <div
                    className="image-container last"
                    key={image.id + index}
                    ref={photoRef}
                  >
                    <img
                      src={image.urls.small}
                      alt=""
                      className="image"
                      onClick={() => openImageModal(image)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="spinner-cont">
              <Spinner isLoading={loading} />
            </div>
          ) : (
            errorMsg && <div className="error-msg">{errorMsg}</div>
          )}
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage.urls.regular}
          altDescription={selectedImage.alt_description}
          onClose={closeImageModal}
        />
      )}
    </div>
  );
};

export default App;
