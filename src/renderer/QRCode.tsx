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
import { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { QRCode } from 'react-qrcode-logo';
import {
  Button,
  OverlayTrigger,
  Tooltip,
  Dropdown,
  DropdownButton,
  Row,
  Col,
} from 'react-bootstrap';
import { ClipboardData, Clipboard2CheckFill } from 'react-bootstrap-icons';

import icon from '../../assets/images/startree_logo-mark_fill-lightning-4.png';

export default function QCode({ link, ext, qrOnly }: { link: string; ext: string, qrOnly: boolean }) {
  const [fileExt, setFileExt] = useState<FileExtension>('png');
  const [dataLink, setDataLink] = useState<string>('https://example.com/');
  const [copied, setCopied] = useState<boolean>(false);
  const [qrCode, setQRCode] = useState<string>(
    'https://example.com/'
  );
  const [qrState, setQrState] = useState<boolean>(false);
  const ref = useRef(null);

  const onExtensionChange = (event: Event) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    setFileExt(event?.target?.id);
  };

  const onDownloadClick = () => {
    const canvas = document.getElementById('react-qrcode-logo');
    const url = canvas?.toDataURL('image/jpg', 0.8);

    // remove Base64 stuff from the Image
    const base64Data = url.replace(/^data:image\/png;base64,/, '');
    const dataURL = canvas?.toDataURL(`image/${fileExt}`);
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `qrcode.${fileExt}`;
    a.click();
  };

  // Copy link to the clipboard and change the icon to a checkmark
  function copyMe(): void {
    setCopied(!copied);
    navigator.clipboard
      .writeText(dataLink)
      .then(null, null)
      // eslint-disable-next-line no-console
      .catch((err) => console.error('Error: ', err));
  }

  // useEffect(() => {
  //   setDataLink(link);
  //   setQRCode(link);
  // }, [link]);

  useEffect(() => {
    setDataLink(link);
    setQRCode(link);
    setCopied(false);
  }, [link]);

  useEffect(() => {
    setQrState(qrOnly);
  }, [qrOnly]);

  return (
    <div>
      <div className="alert-columns">
        {!qrState && (
          <div className="alert-column1">
          {copied && (
            <OverlayTrigger
              delay={{ show: 250, hide: 400 }}
              rootClose
              overlay={
                <Tooltip id="alert-tooltip">
                  You have successfully copied the link!
                </Tooltip>
              }
            >
              <Clipboard2CheckFill
                className="copy-icon header-stuff"
                style={{
                  fontSize: '2rem',
                  color: '#0B263E',
                }}
              />
            </OverlayTrigger>
          )}
          {!copied && (
            <OverlayTrigger
              placement="auto"
              delay={{ show: 250, hide: 400 }}
              rootClose
              overlay={
                <Tooltip id="alert-tooltip">
                  Click here to copy your link!
                </Tooltip>
              }
            >
              <ClipboardData
                className="copy-icon header-stuff"
                tabIndex={0}
                cursor="pointer"
                role="button"
                // eslint-disable-next-line react/jsx-no-bind
                onClick={copyMe}
                // eslint-disable-next-line react/jsx-no-bind
                onKeyPress={copyMe}
                title="Click to copy your link!"
              />
            </OverlayTrigger>
          )}

        </div>)}
        {qrState && (
          <div className="alert-column1">
            </div>)}
        <div className="alert-column2">
          <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 400 }}
            rootClose
            overlay={
              <Tooltip id="alert-tooltip">
                {qrState ? 'This data is encoded in the QR Code' : 'Click here to copy your QR Code!' }
              </Tooltip>
            }
          >
            {!qrState ? (
            <div onClick={copyMe} onKeyDown={copyMe} role="button" tabIndex={0}>
              <strong style={{ cursor: 'pointer' }} className="header-stuff">{link}</strong>
            </div>
            ) : (
              <div>
                <strong className="header-stuff">{link}</strong>
              </div>
            )}
          </OverlayTrigger>
        </div>
        <div className="alert-column3">
          <Row>
            <div ref={ref}>
              <QRCode
                value={qrCode}
                logoImage={icon}
                logoWidth={120}
                logoHeight={110}
                size={200}
                fgColor="#1F3A56"
                qrStyle="dots"
                eyeColor="#1F3A56"
                eyeRadius={[
                  [30, 30, 0, 30], // top/left eye
                  [30, 30, 30, 0], // top/right eye
                  [30, 0, 30, 30], // bottom/left
                ]}
              />
            </div>
          </Row>
          <Row>
            <Col sm="6">
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Choose image Format</Tooltip>}
              >
                <DropdownButton
                  id="dropdown-basic-button"
                  title={fileExt.toUpperCase()}
                  size="sm"
                  flip
                >
                  <Dropdown.Item
                    style={{ color: '#000000' }}
                    id="png"
                    onClick={onExtensionChange}
                  >
                    PNG
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{ color: '#000000' }}
                    id="jpeg"
                    onClick={onExtensionChange}
                  >
                    JPEG
                  </Dropdown.Item>
                </DropdownButton>
              </OverlayTrigger>
            </Col>
            <Col sm="6">
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Download your QR Code</Tooltip>}
              >
                <Button size="sm" onClick={onDownloadClick}>
                  Download
                </Button>
              </OverlayTrigger>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

QCode.propTypes = {
  link: PropTypes.string.isRequired,
  ext: PropTypes.string.isRequired,
};
