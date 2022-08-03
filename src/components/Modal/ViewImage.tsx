/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Image src={imgUrl} alt="image" />
        </ModalBody>
        <ModalFooter>
          <Link onClick={onClose}>Close</Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
  // TODO MODAL WITH IMAGE AND EXTERNAL LINK
}
