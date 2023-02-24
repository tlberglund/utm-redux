import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export default function DireWarning ({
  show,
  onHide,
  onConfirm,
}: {
  show: boolean;
  onHide: (value: boolean) => void;
  onConfirm: (value: boolean) => void;
}): JSX.Element {
  const [showConfig, setShowConfig] = useState<boolean>(false);

  useEffect(() => {
    setShowConfig(show);
  }, [show]);

  const handleConfirm = () => {
    setShowConfig(false);
    onConfirm(true);
  };

  const handleClose = () => {
    setShowConfig(false);
    onHide(true);
  };

  return (
    <Modal show={showConfig} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title><h1 style={{ color: 'red', textAlign: 'center' }}>Warning</h1></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          This will delete all the links in your history!
          <br />
          This cannot be undone!
          <br />
          Are you sure you want to continue?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
