import CloseIconRound from "../../assets/icons/CloseIconRound";
import "./styles.sass";

import React, { useEffect } from "react";

interface ImageModalProps {
  imageUrl: string;
  altDescription: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  altDescription,
  onClose,
}) => {
  useEffect(() => {
    document.body.classList.add("locked-scroll");
    return () => {
      document.body.classList.remove("locked-scroll");
    };
  }, []);

  return (
    <div className="image-modal">
      <div className="modal-background" onClick={onClose}></div>
      <img src={imageUrl} alt={altDescription} className="modal-image" />
      <button className="close-button" onClick={onClose}>
        <CloseIconRound />
      </button>
    </div>
  );
};

export default ImageModal;
