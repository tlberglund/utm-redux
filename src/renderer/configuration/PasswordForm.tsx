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
import { Form, Button, Modal, FloatingLabel, Row, Col } from 'react-bootstrap';
import jsSHA from 'jssha';


function PasswordForm ({
  show,
  callback,
}: {
  show: boolean;
  callback: (value: boolean) => void;
}): JSX.Element {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    setShowPassword(show);
    if (show) {
      setPassword('');
    }
  }, [show]);

  useEffect(() => {
    window.electronAPI
      .checkPass()
      .then((response: string) => {
        const s = JSON.parse(response);
        setAdminPassword(s);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const shaObj = new jsSHA("SHA-512", "TEXT");
    shaObj.update(password);
    const hash = shaObj.getHash("HEX");
    if (hash === adminPassword) {
      callback(true);
    } else {
      callback(false);
    }
  };

  const handleCancel = () => {
    setShowPassword(false);
    callback(false);
  };

  return (
    <Modal
      show={showPassword}
      onHide={handleCancel}
      size="xl"
      dialogClassName="modal-90w"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Configuration Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicPassword">
            <FloatingLabel label="Password">
              <Form.Control
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FloatingLabel>
          </Form.Group>
          <p />
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
};

export default PasswordForm;
