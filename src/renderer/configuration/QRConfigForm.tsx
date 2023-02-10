/* The MIT License (MIT)
 *
 * Copyright (c) 2022-present David G. Simmons
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import React, { useState, useEffect, SyntheticEvent } from 'react';
import {
  Form,
  Button,
  Modal,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import PropTypes from 'prop-types';


export default function QRConfigForm({
  show,
  size,
  exten,
  sizeCallback,
  extensionCallback,
  onHide,
}: {
  show: boolean;
  size: number;
  exten: string;
  sizeCallback: (value: number) => void;
  extensionCallback: (value: string) => void;
  onHide: (value: boolean) => void;
}): JSX.Element {
  const [showConfig, setShowConfig] = useState(false);
  const [qrSize, setQrSize] = useState(175);
  const [qrExtension, setQrExtension] = useState('png');
  const initSize = size;
  const initExtension = exten;

  useEffect(() => {
    setShowConfig(show);
  }, [show]);

  useEffect(() => {
    setQrSize(size);
  }, [size]);

  useEffect(() => {
    setQrExtension(exten.toLowerCase());
  }, [exten]);

  const onExtensionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQrExtension(event.target.id.split('-')[2]);
    extensionCallback(event.target.id.split('-')[2]);
  };

  const onSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQrSize(parseInt(event.target.value, 10));
    sizeCallback(parseInt(event.target.value, 10));
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setShowConfig(false);
    sizeCallback(qrSize);
    extensionCallback(qrExtension);
  };

  const handleCancel = () => {
    sizeCallback(initSize);
    extensionCallback(initExtension);
    setShowConfig(false);
    onHide(false);
  };

  return (
    <Modal
      show={showConfig}
      onHide={handleCancel}
      size="xl"
      dialogClassName="modal-40w"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>QR Code Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm="4" style={{ paddingLeft: '1rem', paddingRight: '0px' }}>
              <Form.Group controlId="formBasicCheckbox">
                <OverlayTrigger
                  placement="auto"
                  delay={{ show: 250, hide: 400 }}
                  rootClose
                  overlay={
                    <Tooltip id="qrcode-tooltip">
                      Current size of the QR Code.
                    </Tooltip>
                  }
                >
                  <Form.Label size="lg" style={{ fontSize: 'large' }}>
                    Size: {qrSize}
                  </Form.Label>
                </OverlayTrigger>
              </Form.Group>
            </Col>
            <Col sm="5" style={{ paddingLeft: '-1rem' }}>
              <OverlayTrigger
                placement="auto"
                delay={{ show: 250, hide: 400 }}
                rootClose
                overlay={
                  <Tooltip id="qrcode-tooltip">
                    Adjust the size of your QR Code.
                  </Tooltip>
                }
              >
                <Form.Range
                  value={qrSize}
                  min={150}
                  max={350}
                  step={10}
                  onChange={(e) => {
                    onSizeChange(e);
                  }}
                />
              </OverlayTrigger>
            </Col>
          </Row>
          <Row>
            <Col sm="4" style={{ paddingLeft: '1rem', paddingRight: '0px' }}>
              <Form.Label size="lg" style={{ fontSize: 'large' }}>
                File Extension:{' '}
              </Form.Label>
            </Col>
            <Col sm="6" style={{ paddingLeft: '1rem' }}>
              <div key="inline-radio" className="mb-3">
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Download as a PNG</Tooltip>}
                >
                  <Form.Check
                    inline
                    label=".png"
                    name="group1"
                    type="radio"
                    id="inline-radio-png"
                    style={{ marginRight: '.5rem' }}
                    onChange={(e) => {
                      onExtensionChange(e);
                    }}
                    checked={qrExtension === 'png'}
                  />
                </OverlayTrigger>
                <OverlayTrigger
                  placement="auto"
                  overlay={<Tooltip>Download as a JPG</Tooltip>}
                >
                  <Form.Check
                    inline
                    label=".jpg"
                    name="group1"
                    type="radio"
                    id="inline-radio-jpg"
                    style={{ marginRight: '.5rem' }}
                    onChange={onExtensionChange}
                    checked={qrExtension === 'jpg'}
                  />
                </OverlayTrigger>
              </div>
            </Col>
          </Row>
          <Form.Group as={Row}>
            <Col sm={4}>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
            <Col sm={4}>&nbsp;</Col>
            <Col sm={4}>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

QRConfigForm.propTypes = {
  show: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired,
  exten: PropTypes.string.isRequired,
  sizeCallback: PropTypes.func.isRequired,
  extensionCallback: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
};
