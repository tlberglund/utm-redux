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
import React, {
  useEffect,
  useState,
  useRef,
  KeyboardEventHandler,
} from 'react';
import { QRCode, IProps } from 'react-qrcode-logo';
import { Button, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { ClipboardData, Clipboard2CheckFill } from 'react-bootstrap-icons';
import QRConfigForm from './configuration/QRConfigForm';
import logo from '../../assets/images/logo-mark_fill.png';

export default function QCode({
  link,
  ext,
  qrOnly,
}: {
  link: string;
  ext: string;
  qrOnly: boolean;
}) {
  const [fileExt, setFileExt] = useState<string>('png');
  const [dataLink, setDataLink] = useState<string>('https://example.com/');
  const [copied, setCopied] = useState<boolean>(false);
  const [qrProps, setQRProps] = useState<IProps>({
    value: 'https://google.com/',
    ecLevel: 'H',
    size: 175,
    quietZone: 0,
    enableCORS: true,
    bgColor: '#FFFFFF',
    fgColor: 'rgba(11, 38, 62, 1)',
    logoImage: logo,
    logoWidth: 60,
    logoHeight: 60,
    logoOpacity: 10,
    removeQrCodeBehindLogo: false,
    qrStyle: 'dots',
    eyeColor: 'rgba(11, 38, 62, 1)',
    eyeRadius: [
      [16, 16, 0, 16],
      [16, 16, 16, 0],
      [16, 0, 16, 16],
    ],
  });

  const [qrSize, setQRSize] = useState<number>(175);
  const [qrState, setQrState] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const ref = useRef(null);

  const updateQrSize = (size: number) => {
    setQRSize(size);
    setQRProps({ ...qrProps, size });
  };

  const onDownloadClick = () => {
    const canvas = document.getElementById(
      'react-qrcode-logo'
    ) as HTMLCanvasElement;
    const dataURL = canvas?.toDataURL(`image/${fileExt}`);
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `qrcode.${fileExt}`;
    a.click();
  };

  const showConfigWindow = () => {
    setShowConfig(!showConfig);
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

  const updateQRProps = (link: string) => {
    setQRProps({ ...qrProps, value: link });
  };

  useEffect(() => {
    setDataLink(link);
    updateQRProps(link);
    setCopied(false);
  }, [link]);

  useEffect(() => {
    setQrState(qrOnly);
  }, [qrOnly]);

  return (
    <div>
      <div className="alert-columns">
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
                onKeyDown={null as unknown as KeyboardEventHandler}
                title="Click to copy your link!"
              />
            </OverlayTrigger>
          )}
        </div>
        <div className="alert-column2">
          <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 400 }}
            rootClose
            overlay={
              <Tooltip id="alert-tooltip">
                {qrState
                  ? 'This data is encoded in the QR Code'
                  : 'Click here to copy your link!'}
              </Tooltip>
            }
          >
            <div
              onClick={copyMe}
              onKeyDown={null as unknown as KeyboardEventHandler}
              role="button"
              tabIndex={0}
            >
              <strong style={{ cursor: 'pointer' }} className="header-stuff">
                {link}
              </strong>
            </div>
          </OverlayTrigger>
        </div>
        <div className="alert-column3">
          <Row style={{ margin: 'auto' }}>
            <OverlayTrigger
              placement="auto"
              delay={{ show: 250, hide: 400 }}
              rootClose
              overlay={
                <Tooltip id="qrcode-tooltip">
                  Click the QR Code or the &lsquo;Download&rsquo; button to save
                  the QR Code
                </Tooltip>
              }
            >
              <div
                ref={ref}
                onClick={onDownloadClick}
                onKeyDown={null as unknown as KeyboardEventHandler}
                role="button"
                tabIndex={-1}
              >
                <QRCode
                  id="react-qrcode-logo"
                  value={qrProps.value}
                  size={qrProps.size}
                  bgColor={qrProps.bgColor}
                  fgColor={qrProps.fgColor}
                  logoImage={qrProps.logoImage}
                  qrStyle={qrProps.qrStyle}
                  logoWidth={qrProps.logoWidth}
                  logoHeight={qrProps.logoHeight}
                  logoOpacity={qrProps.logoOpacity}
                  eyeColor={qrProps.eyeColor}
                  eyeRadius={qrProps.eyeRadius}
                  quietZone={qrProps.quietZone}
                  enableCORS={qrProps.enableCORS}
                  ecLevel={qrProps.ecLevel}
                />
              </div>
            </OverlayTrigger>
          </Row>
          <Row style={{ marginRight: '-30px', textAlignLast: 'right' }}>
            <Col sm="6" style={{ marginRight: '-30px' }} />
            <Col sm="6" style={{ marginRight: '-30px' }}>
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Download your QR Code</Tooltip>}
              >
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={onDownloadClick}
                >
                  Download
                </Button>
              </OverlayTrigger>
            </Col>
            {/* <Col sm="6">
              <OverlayTrigger
                placement="auto"
                overlay={<Tooltip>Adjust your QR Code</Tooltip>}
              >
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={showConfigWindow}
                >
                  Options
                </Button>
              </OverlayTrigger>
            </Col> */}
          </Row>
        </div>
        <QRConfigForm
          show={showConfig}
          size={qrSize}
          exten={ext}
          sizeCallback={updateQrSize}
          extensionCallback={setFileExt}
          onHide={showConfigWindow}
        />
      </div>
    </div>
  );
}
