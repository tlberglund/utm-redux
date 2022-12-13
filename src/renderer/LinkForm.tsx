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
import { useEffect, useState, useRef } from 'react';
import { InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import UTMTextField from './UTMTextField';
import UTMChoice from './UTMChoice';
import { BitlyConfig, defaultUTMParams, UtmParams } from './types';
import BitlyCheck from './BitlyCheck';
import QCode from './QRCode';
import ConfigEditor from './configuration/ConfigEditor';

export default function LinkForm({
  showConfig,
  callback,
}: {
  showConfig: boolean;
  callback: (value: boolean) => void;
}): JSX.Element {
  const [campaign, setCampaign] = useState('');
  const [medium, setMedium] = useState('');
  const [source, setSource] = useState('');
  const [term, setTerm] = useState('');
  const [restrictBases, setRestrictBases] = useState(true);
  const [base, setBase] = useState('');
  const [target, setTarget] = useState('https://www.example.com/');
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [linkComplete, setLinkComplete] = useState(false);
  const [enableBitly, setEnableBitly] = useState(false);
  const [bitlyConfig, setBitlyConfig] = useState<BitlyConfig>({});
  const [editConfig, setEditConfig] = useState(false);
  const [mainConfig, setMainConfig] = useState(defaultUTMParams);

  useEffect(() => {
    window.electronAPI
      .getConfig(null)
      .then((response: JSON) => {
        const c: UtmParams = JSON.parse(response);
        setMainConfig(c);
        setRestrictBases(c.restrict_bases);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, [restrictBases]);

  useEffect(() => {
    setEditConfig(showConfig);
    if (!showConfig) {
      window.electronAPI
        .getParams(null, 'bitly_config')
        .then((response: JSON) => {
          const c: BitlyConfig = JSON.parse(response);
          setBitlyConfig(c);
          setEnableBitly(c.bitlyEnabled);
          return '';
        })
        .catch((error: unknown) => {
          console.log(`Error: ${error}`);
        });
    }
  }, [showConfig]);

  useEffect(() => {
    let ll = '';
    const regex = new RegExp('(^http[s]*://)|(^ftp[s]*://)');
    if (base !== '' && target === 'https://www.example.com/') {
      setTarget('');
    }
    setBase((prevBase) => (prevBase.endsWith('/') ? prevBase : `${prevBase}/`));
    setBase(base);
    if (!restrictBases) {
      setTarget((prevTarget) =>
        !regex.test(prevTarget) ? `https://${prevTarget}` : prevTarget
      );
    }
    if (target !== 'https://www.example.com/' && target !== '') {
      setTarget((prevTarget) =>
        prevTarget.endsWith('/') ? prevTarget : `${prevTarget}/`
      );
    }
    ll = `${base}${target}`;
    setSource((prevSource) =>
      regex.test(prevSource) ? prevSource.replace(regex, '') : prevSource
    );
    if (source !== '') {
      ll = `${ll}?utm_source=${source}`;
    }
    if (medium !== '') {
      ll = `${ll}&utm_medium=${medium}`;
    }
    if (campaign !== '') {
      ll = `${ll}&utm_campaign=${campaign}`;
    }
    if (term !== '') {
      ll = `${ll}&utm_term=${term}`;
    }
    setLongLink(ll);
  }, [base, target, source, term, campaign, medium, longLink, restrictBases]);

  // If Bitly switch is turned on, get the Bitly configuration
  useEffect(() => {
    if (enableBitly) {
      window.electronAPI
        .getParams(null, 'bitly_config')
        .then((response: JSON) => {
          const c: BitlyConfig = JSON.parse(response);
          c.bitlyEnabled = true;
          setBitlyConfig(c);
          return '';
        })
        .catch((error: unknown) => {
          console.log(`Error: ${error}`);
        });
    } else {
      setShortLink('');
    }
  }, [enableBitly, setBitlyConfig]);

  useEffect(() => {
    if (bitlyConfig.bitlyEnabled) {
      // only call bitly if the link is complete.
      if (
        target !== 'https://www.example.com/' &&
        source !== '' &&
        medium !== '' &&
        campaign !== '' &&
        term !== ''
      ) {
        const headers = {
          Authorization: `Bearer ${bitlyConfig.bitlyToken}`,
          Accept: 'application/json',
          ContentType: 'application/json; charset=utf-8',
        };
        const data = JSON.parse(
          `{"long_url": "${longLink}", "domain": "${bitlyConfig.bitlyDomain}"}`
        );
        // eslint-disable-next-line promise/catch-or-return
        axios
          .post(`${bitlyConfig.bitlyAddr}`, data, {
            headers,
          })
          // eslint-disable-next-line promise/always-return
          .then((response) => {
            setShortLink(response.data.link);
            return '';
          });
      }
    }
  }, [bitlyConfig, longLink, target, source, medium, campaign, term]);

  const closeConfig = () => {
    setEditConfig(false);
    callback(false);
    setRestrictBases(!mainConfig.restrict_bases);
  };

  return (
    <div className="link-form">
      <div>
        <QCode link={shortLink === '' ? longLink : shortLink} ext="PNG" />
      </div>
      <p />
      <Row>
        <InputGroup className="mb-3" size="lg">
          <Col sm={4}>
            {restrictBases && (
              <UTMChoice
                valueChanged={setBase}
                targetType="utm_bases"
                id="restricted-bases"
                enabled
              />
            )}
          </Col>
          <Col sm={restrictBases ? 8 : 12}>
            <UTMTextField
              valueChanged={setTarget}
              targetType="utm_target"
              enableMe={!restrictBases || base !== ''}
            />
          </Col>
        </InputGroup>
      </Row>
      <Row>
        <InputGroup className="mb-3" size="lg">
          <UTMTextField
            valueChanged={setSource}
            targetType="utm_source"
            enableMe
          />
        </InputGroup>
      </Row>
      <Row>
        <InputGroup className="mb-3" size="lg">
          <UTMTextField
            valueChanged={setCampaign}
            targetType="utm_campaign"
            enableMe
          />
        </InputGroup>
      </Row>

      <Row>
        <Col sm={6}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={setTerm}
              targetType="utm_term"
              enabled
              id="utm-term"
            />
          </InputGroup>
        </Col>
        <Col sm={6}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={setMedium}
              targetType="utm_medium"
              enabled={term !== ''}
              id="medium-choice"
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <BitlyCheck
            targetType="bitly_config"
            useMe={enableBitly}
            valueChanged={setEnableBitly}
          />
        </Col>
        <Col>
          <ConfigEditor showMe={editConfig} callback={closeConfig} />
        </Col>
      </Row>
    </div>
  );
}
