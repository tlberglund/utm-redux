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
import { useEffect, useState } from 'react';
import {
  FloatingLabel,
  Form,
  FormControl,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import CountrySelect from 'react-bootstrap-country-select';
import ICountry from 'react-bootstrap-country-select';
import UTMTextField from './UTMTextField.tsx';
import UTMChoice from './UTMChoice.tsx';
import UTMChoiceShorten from './UTMChoiceShorten.tsx';
import { BitlyConfig, defaultUTMParams, UtmParams } from './types.tsx';
import BitlyCheck from './BitlyCheck.tsx';
import QCode from './QRCode.tsx';
import ConfigEditor from './configuration/ConfigEditor.tsx';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';

export default function LinkForm({
  showConfig,
  callback,
}: {
  showConfig: boolean;
  callback: (value: boolean) => void;
}): JSX.Element {
  const [campaign, setCampaign] = useState('');
  const [finalCampaign, setFinalCampaign] = useState('');
  const [medium, setMedium] = useState('');
  const [source, setSource] = useState('');
  const [term, setTerm] = useState('');
  const [restrictBases, setRestrictBases] = useState(true);
  const [showCountry, setShowCountry] = useState(false);
  const [base, setBase] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState<typeof ICountry>();
  const [countryID, setCountryID] = useState('');
  const [team, setTeam] = useState('');
  const [target, setTarget] = useState('https://www.example.com/');
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [enableBitly, setEnableBitly] = useState(false);
  const [bitlyConfig, setBitlyConfig] = useState<BitlyConfig>({});
  const [editConfig, setEditConfig] = useState(false);
  const [mainConfig, setMainConfig] = useState(defaultUTMParams);
  const [qrOnly, setQrOnly] = useState(false);

  useEffect(() => {
    window.electronAPI
      .getConfig(null)
      .then((response: JSON) => {
        const c: UtmParams = JSON.parse(response);
        setMainConfig(c);
        setRestrictBases(c.restrict_bases);
        setShowCountry(c.show_country);
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
    if (qrOnly) {
      setLongLink(target);
    } else {
      let ll = '';
      const regex = new RegExp('(^http[s]*://)|(^ftp[s]*://)');
      if (base !== '' && target === 'https://www.example.com/') {
        setTarget('');
      }
      setBase((prevBase) =>
        prevBase.endsWith('/') ? prevBase : `${prevBase}/`
      );
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
      if (finalCampaign !== '') {
        ll = `${ll}&utm_campaign=${finalCampaign}`;
      }
      // if (term !== '') {
      //   ll = `${ll}&utm_term=${term}`;
      // }
      setLongLink(ll);
      if (base === 'choose_one_...') {
        setBase('');
        setTarget('https://example.com/');
      }
    }
  }, [
    base,
    target,
    source,
    term,
    finalCampaign,
    medium,
    longLink,
    restrictBases,
  ]);

  useEffect(() => {
    if (qrOnly) {
      setShowCountry(false);
      setRestrictBases(false);
    }
  }, [qrOnly]);
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

  const updateTeam = (value: string) => {
    setTeam(value);
  };

  const updateRegion = (value: string) => {
    setRegion(value);
  };

  const updateTerm = (value: string) => {
    setTerm(value);
  };

  useEffect(() => {
    let temp_campaign = '';
    if (team !== '') {
      temp_campaign = `${team}_`;
    }
    if (campaign !== '') {
      temp_campaign = `${temp_campaign}${campaign}_`;
    }
    if (region !== '') {
      temp_campaign = `${temp_campaign}${region}_`;
    }
    if (countryID !== '') {
      temp_campaign = `${temp_campaign}${countryID}_`;
    }
    const t = temp_campaign.endsWith('_')
      ? temp_campaign.slice(0, -`_`.length)
      : temp_campaign;
    setFinalCampaign(t);
  }, [team, term, region, countryID, campaign]);

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

  const updateCountry = (countryIdOrCountry: string | ICountry) => {
    if (countryIdOrCountry === null) {
      setCountryID('');
      setCountry({ id: '', name: '' });
      return;
    }
    const c = countryIdOrCountry.name;
    setCountry(countryIdOrCountry);
    const i = countryIdOrCountry.id;
    setCountryID(i);
  };

  return (
    <div className="link-form">
      <div>
        <QCode link={shortLink === '' ? longLink : shortLink} ext="PNG" qrOnly={qrOnly} />
      </div>
      <p />
      <Row>
        <Col sm={4}>
          <Form.Check
            type="checkbox"
            id="qr-only-show"
            label="Just generate QR Codes"
            checked={qrOnly}
            onChange={(e) => {
              setQrOnly(e.target.checked);
            }}
          />
        </Col>
        <Col sm={4}>
          </Col>
        {!qrOnly && (<Col sm={4} style={{alignContent: 'end'}}>
          <BitlyCheck
            targetType="bitly_config"
            useMe={enableBitly}
            valueChanged={setEnableBitly}
          />
        </Col> )}
      </Row>
      {/* utm_target */}
      <Row>
        <InputGroup className="mb-3" size="lg">
          <Col sm={4}>
            {restrictBases && (
              <UTMChoice
                valueChanged={setBase}
                targetType="utm_bases"
                id="restricted-bases"
                enabled
                settings={mainConfig.utm_bases}
              />
            )}
          </Col>
          <Col sm={restrictBases ? 8 : 12}>
            <UTMTextField
              valueChanged={setTarget}
              targetType="utm_target"
              enableMe={
                !restrictBases || (base !== '' && base !== 'choose_one_...')
              }
              qrOnly={qrOnly}
            />
          </Col>
        </InputGroup>
      </Row>
      <p />
      {/* utm_source */}
      <Row>
        <Col sm={12}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={setSource}
              targetType="utm_source"
              enabled={!qrOnly}
              id="utm-source"
              settings={mainConfig.utm_term}
            />
          </InputGroup>
        </Col>
      </Row>
      <p />
      {/* utm_medium */}
      <Row>
        <Col sm={12}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={setMedium}
              targetType="utm_medium"
              enabled={!qrOnly}
              id="medium-choice"
              settings={mainConfig.utm_medium}
            />
          </InputGroup>
        </Col>
      </Row>
      <p />
      {/* utm_source */}
      <Row>
        <Col sm={12}>
          <UTMTextField
            valueChanged={setCampaign}
            targetType="utm_campaign"
            enableMe={!qrOnly}
          />
        </Col>
      </Row>
      <p />
      <Row>
        <Col sm={showCountry ? 4 : 6}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoiceShorten
              valueChanged={updateTeam}
              targetType="utm_campaign_team"
              enabled={!qrOnly}
              id="utm-team"
              settings={mainConfig.team_name}
            />
          </InputGroup>
        </Col>
        <Col sm={showCountry ? 4 : 6}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoiceShorten
              valueChanged={updateRegion}
              targetType="utm_campaign_region"
              enabled={!qrOnly}
              id="utm-region"
              settings={mainConfig.region_name}
            />
          </InputGroup>
        </Col>
        {/* <Row>
        <InputGroup className="mb-3" size="lg">
          <UTMTextField
            valueChanged={setSource}
            targetType="utm_source"
            enableMe
          />
        </InputGroup>
      </Row> */}
        {showCountry && (
          <Col sm={4}>
            <CountrySelect
              value={country}
              valueAs="object"
              size="lg"
              onChange={updateCountry}
              enabled={!qrOnly}
            />
          </Col>
        )}
      </Row>
      <p />
      <Row>
        <Col sm={12}>
          <InputGroup className="mb-3" size="lg">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>This value is auto-generated</Tooltip>}
            >
              <FloatingLabel label="Final Campaign String">
                <FormControl
                  required
                  disabled
                  id={`final-campaign-target`}
                  aria-label="Final Campaign Value (Read Only)"
                  aria-describedby="Final Campaign Value (Read Only)"
                  value={finalCampaign}
                />
              </FloatingLabel>
            </OverlayTrigger>
            <Form.Control.Feedback type="invalid">
              This value is auto-generated
            </Form.Control.Feedback>
            {/* <UTMTextField
            valueChanged={setCampaign}
            targetType="utm_campaign"
            value={campaign}
            enableMe={false}
          /> */}
          </InputGroup>
        </Col>
      </Row>
          <ConfigEditor showMe={editConfig} callback={closeConfig} />

    </div>
  );
}