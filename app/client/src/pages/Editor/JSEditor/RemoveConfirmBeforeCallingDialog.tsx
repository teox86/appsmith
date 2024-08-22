import React from "react";

import {
  REMOVE_CONFIRM_BEFORE_CALLING_DESCRIPTION,
  REMOVE_CONFIRM_BEFORE_CALLING_HEADING,
} from "ee/constants/messages";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@appsmith/ads";

interface RemoveConfirmationProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function RemoveConfirmationModal(props: RemoveConfirmationProps) {
  const { isOpen, onCancel, onConfirm } = props;

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onCancel();
    }
  };

  return (
    <Modal onOpenChange={onOpenChange} open={isOpen}>
      <ModalContent
        className={"t--remove-confirm-before-calling-confirmation-modal"}
        style={{ width: "600px" }}
      >
        <ModalHeader>{REMOVE_CONFIRM_BEFORE_CALLING_HEADING()}</ModalHeader>
        <ModalBody>
          <Text kind="body-m">
            {REMOVE_CONFIRM_BEFORE_CALLING_DESCRIPTION()}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button kind="secondary" onClick={onCancel} size="md">
            Cancel
          </Button>
          <Button
            data-testid="t--confirm-before-calling-remove-button"
            kind="primary"
            onClick={onConfirm}
            size="md"
          >
            Remove
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default RemoveConfirmationModal;
