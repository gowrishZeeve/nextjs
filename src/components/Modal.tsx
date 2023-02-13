import Image, { StaticImageData } from "next/image";
import { Button, Modal as BootstrapModal } from "react-bootstrap";
import { ImCross } from "react-icons/im";

export interface ModalProps {
  onHide: () => void;
  onConfirm?: () => void;
  show: boolean;
  title?: string;
  titleClassName?: string;
  titleIcon?: StaticImageData;
  size?: "sm" | "lg" | "xl";
  bodyClassName?: string;
  children?: React.ReactNode;
  visibleHeaderCloseIcon: boolean;
  visibleFooterCloseButton: boolean;
  backdrop?: "static";
  confirmBtnText?: string;
  visibleFooter?: boolean;
  visibleConfirmBtn?: boolean;
  confirmBtnClassName?: string;
  disableConfirmBtn?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  onHide,
  onConfirm,
  show,
  title,
  titleClassName = "text-center",
  titleIcon,
  size,
  bodyClassName,
  children,
  visibleFooterCloseButton,
  backdrop = "static",
  confirmBtnText = "ok",
  visibleFooter = true,
  visibleConfirmBtn,
  confirmBtnClassName,
  disableConfirmBtn = false,
  visibleHeaderCloseIcon,
}) => {
  return (
    <BootstrapModal
      onHide={onHide}
      show={show}
      size={size}
      aria-labelledby=""
      centered
      backdrop={backdrop}
    >
      <BootstrapModal.Body className={bodyClassName}>
        {visibleHeaderCloseIcon ? (
          <div
            className={`d-flex align-items-center justify-content-between ${titleClassName}`}
          >
            <h5 className="mb-0">{title}</h5>
            <ImCross className="text-muted cursor-clickable" onClick={onHide} />
          </div>
        ) : (
          <div className={`${titleClassName}`}>
            <h5 className="mb-0">
              {titleIcon && (
                <Image src={titleIcon} alt="title-icon" className="" />
              )}
              {title}
            </h5>
          </div>
        )}
        {children}
      </BootstrapModal.Body>
      {visibleFooter && (
        <BootstrapModal.Footer
          className={visibleHeaderCloseIcon ? "" : "justify-content-center"}
        >
          {visibleFooterCloseButton && (
            <Button variant="secondary" onClick={onHide}>
              Close
            </Button>
          )}
          {visibleConfirmBtn && (
            <Button
              disabled={disableConfirmBtn}
              className={confirmBtnClassName}
              onClick={onConfirm}
            >
              {confirmBtnText}
            </Button>
          )}
        </BootstrapModal.Footer>
      )}
    </BootstrapModal>
  );
};
