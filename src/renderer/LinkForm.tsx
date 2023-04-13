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
  Button,
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
import CountrySelect, { ICountry } from 'react-bootstrap-country-select';
import uuid from 'react-uuid';
import UTMTextField from './UTMTextField';
import UTMChoice from './UTMChoice';
import HistoryChooser from './HistoryChooser';
import {
  BitlyConfig,
  defaultBitlyConfig,
  defaultUTMParams,
  UtmParams,
  LinkData,
} from './types';
import BitlyCheck from './BitlyCheck';
import QCode from './QRCode';
import 'react-bootstrap-country-select/dist/react-bootstrap-country-select.css';
import DireWarning from './configuration/DireWarning';
import {
  XCircle,
  XCircleFill,
  Save,
  SaveFill,
} from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

export default function LinkForm({ dark }: { dark: boolean }): JSX.Element {
  const [campaign, setCampaign] = useState('');
  const [finalCampaign, setFinalCampaign] = useState('');
  const [medium, setMedium] = useState('');
  const [source, setSource] = useState('');
  const [restrictBases, setRestrictBases] = useState(true);
  const [showCountry, setShowCountry] = useState(false);
  const [base, setBase] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState<string | ICountry>();
  const [countryID, setCountryID] = useState('');
  const [team, setTeam] = useState('');
  const [target, setTarget] = useState('https://www.example.com/');
  const [longLink, setLongLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [useBitly, setUseBitly] = useState(false);
  const [bitlyConfig, setBitlyConfig] =
    useState<BitlyConfig>(defaultBitlyConfig);
  const [enableBitly, setEnableBitly] = useState(false);
  const [mainConfig, setMainConfig] = useState(defaultUTMParams);
  const [qrOnly, setQrOnly] = useState(false);
  const [linkHistory, setLinkHistory] = useState<LinkData[]>([]);
  const [showDireWarning, setShowDireWarning] = useState(false);
  const [darkMode, setDarkMode] = useState(dark);
  const [darkClass, setDarkClass] = useState<string>('header-stuff');

  useEffect(() => {
    setDarkMode(dark);
    dark ? setDarkClass('header-stuff-dark') : setDarkClass('header-stuff');
  }, [dark]);

  const getHistory = (): void => {
    window.electronAPI
      .getLinks()
      .then((response: string) => {
        const linkData: LinkData[] = JSON.parse(response);
        setLinkHistory(linkData);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  const saveLink = (): void => {
    const ld: LinkData = {
      longLink,
      shortLink,
      uuid: uuid(),
      teamName: team,
      regionName: region,
      campaign,
      source,
      medium,
      term: '',
      target,
      base,
      countryName: countryID,
      date: new Date().toLocaleString(),
    };
    const linkDataString = JSON.stringify(ld);
    window.electronAPI
      .saveLink(linkDataString)
      .then((response: string) => {
        const linkData: LinkData[] = JSON.parse(response);
        setLinkHistory(linkData);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  const clearHistory = (): void => {
    window.electronAPI
      .clearHistory()
      .then((response) => {
        setLinkHistory(JSON.parse(response));
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  const dire = (): void => {
    setShowDireWarning(false);
    clearHistory();
  };
  const clearForm = (): void => {
    window.electronAPI
      .clearForm()
      .then(() => {
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  useEffect(() => {
    window.electronAPI
      .getConfig()
      .then((response: string) => {
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
    if (qrOnly) {
      setLongLink(target);
    } else {
      let ll = '';
      const regex = /(^http[s]*:\/\/)|(^ftp[s]*:\/\/)/;
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
        setTarget(target);
        // (prevTarget) =>
        //  prevTarget.endsWith('/') ? prevTarget : `${prevTarget}/`
        // );
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
    finalCampaign,
    medium,
    longLink,
    restrictBases,
    qrOnly,
  ]);

  useEffect(() => {
    getHistory();
  }, []);

  const fillHistory = (histID: string) => {
    if (histID === 'clear-history') {
      setShowDireWarning(true);
      return;
    }
    linkHistory.forEach((item) => {
      if (item.uuid === histID) {
        setBase(item?.base);
        setTarget(item?.target);
        setSource(item?.source);
        setMedium(item?.medium);
        setCampaign(item?.campaign);
        setTeam(item?.teamName);
        setRegion(item?.regionName);
        setCountry(item?.countryName);
        setUseBitly(false);
        if (item?.shortLink !== '') {
          setShortLink(item?.shortLink);
          setUseBitly(true);
        }
        setLongLink(item?.longLink);
      }
    });
  };

  useEffect(() => {}, [restrictBases]);

  useEffect(() => {
    if (qrOnly) {
      setShowCountry(false);
      setRestrictBases(false);
    }
  }, [qrOnly]);

  // If Bitly switch is turned on, get the Bitly configuration
  useEffect(() => {
    if (useBitly) {
      window.electronAPI
        .getParams('bitly_config')
        .then((response: string) => {
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
  }, [useBitly, setBitlyConfig]);

  const updateTeam = (value: string) => {
    setTeam(value);
  };

  const updateRegion = (value: string) => {
    setRegion(value);
  };

  useEffect(() => {
    let tempCampaign = '';
    if (team !== '') {
      tempCampaign = `${team}_`;
    }
    if (campaign !== '') {
      tempCampaign = `${tempCampaign}${campaign}_`;
    }
    if (region !== '') {
      tempCampaign = `${tempCampaign}${region}_`;
    }
    if (countryID !== '') {
      tempCampaign = `${tempCampaign}${countryID}_`;
    }
    const t = tempCampaign.endsWith('_')
      ? tempCampaign.slice(0, -`_`.length)
      : tempCampaign;
    setFinalCampaign(t);
  }, [team, region, countryID, campaign]);

  useEffect(() => {
    if (
      target !== 'https://www.example.com/' &&
      source !== '' &&
      medium !== '' &&
      campaign !== ''
    ) {
      setEnableBitly(true);
    } else {
      setEnableBitly(false);
    }
  }, [target, source, medium, campaign]);

  useEffect(() => {
    if (bitlyConfig.bitlyEnabled) {
      // only call bitly if the link is complete.
      if (
        target !== 'https://www.example.com/' &&
        source !== '' &&
        medium !== '' &&
        campaign !== ''
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
  }, [bitlyConfig, longLink, target, source, medium, campaign]); // , term

  const updateCountry = (countryIdOrCountry: string | ICountry) => {
    if (countryIdOrCountry === null) {
      setCountryID('');
      const c: ICountry = {
        id: '',
        name: '',
        flag: '',
        alpha2: '',
        alpha3: '',
        ioc: '',
      };
      setCountry(c);
      return;
    }
    const c = countryIdOrCountry as ICountry;
    setCountry(countryIdOrCountry);
    const i = c.id;
    setCountryID(i);
  };

  return (
    <div className="link-form">
      <div>
        <QCode
          link={!useBitly ? longLink : shortLink}
          ext="png"
          qrOnly={qrOnly}
          dark={darkMode}
        />
      </div>
      {/* bitly button */}
      <div style={{ width: '100%' }}>
        <div style={{ width: '18%', display: 'inline-block' }}>
          {/* <OverlayTrigger
          placement="auto"
          overlay={
            <Tooltip id="bitly-tooltip">
              {bitlyConfig.tooltip}
            </Tooltip>
          }
        > */}
          {/* bitly enable */}

          <BitlyCheck
            targetType="bitly_config"
            useMe={useBitly}
            bitlyEnabled={enableBitly}
            valueChanged={setUseBitly}
          />
          {/* </OverlayTrigger> */}
        </div>
        {/* qr only button */}
        <div style={{ width: '22%', display: 'inline-block' }}>
          <OverlayTrigger
            placement="auto"
            delay={{ show: 250, hide: 300 }}
            overlay={
              <Tooltip id="qr-only-tooltip">
                Just generate a QR Code with no UTM parameters.
              </Tooltip>
            }
          >
            <Form.Check
              type="switch"
              id="qr-only-show"
              label="QR Code Only"
              checked={qrOnly}
              style={{ float: 'left' }}
              onChange={(e) => {
                setQrOnly(e.target.checked);
              }}
            />
          </OverlayTrigger>
        </div>
        {/* history, save & clear buttons */}
        <div
          style={{
            width: '60%',
            display: 'inline-block',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '50%', display: 'inline-block' }}></div>
          {/* history button */}
          <div
            style={{
              width: '34%',
              display: 'inline-block',
              verticalAlign: 'top',
            }}
          >
            <HistoryChooser
              history={linkHistory}
              dark={darkMode}
              callback={fillHistory}
            />
          </div>
          {/* save button */}
          <div style={{ width: '8%', display: 'inline-block' }}>
            <OverlayTrigger
              placement="auto"
              delay={{ show: 250, hide: 300 }}
              overlay={
                <Tooltip id="save-btn-tooltip">
                  Save the current link to your history.
                </Tooltip>
              }
            >
              <Button
                size="sm"
                id="save-btn"
                variant={darkMode ? 'icon-only-dark' : 'icon-only'}
                onClick={saveLink}
                className={darkClass}
                style={{ float: 'right' }}
              >
                {darkMode ? <Save /> : <SaveFill />}
              </Button>
            </OverlayTrigger>
          </div>
          {/* clear button */}
          <div style={{ width: '1.5%', display: 'inline-block' }}>
            <OverlayTrigger
              placement="auto"
              delay={{ show: 250, hide: 300 }}
              overlay={
                <Tooltip id="clear-btn-tooltip">
                  Clear the form and start over.
                </Tooltip>
              }
            >
              <Button
                size="sm"
                variant={darkMode ? 'icon-only-dark' : 'icon-only'}
                color={darkMode ? '#adb5bd' : '#0B3665'}
                className={darkClass}
                onClick={clearForm}
                style={{ float: 'right', marginRight: '-30px' }}
              >
                {darkMode ? <XCircle /> : <XCircleFill />}
              </Button>
            </OverlayTrigger>
          </div>
        </div>
      </div>
      {/* utm_target */}
      <Row style={{ marginBottom: '-.5rem' }}>
        <InputGroup className="mb-3" size="lg">
          <Col sm={4}>
            {restrictBases && !qrOnly && (
              <UTMChoice
                valueChanged={setBase}
                targetType="utm_bases"
                id="restricted-bases"
                enabled
                settings={mainConfig.utm_bases}
                selected={base}
              />
            )}
          </Col>
          <Col sm={restrictBases && !qrOnly ? 8 : 12}>
            <UTMTextField
              valueChanged={setTarget}
              targetType="utm_target"
              enableMe={
                !restrictBases ||
                qrOnly ||
                (base !== '' && base !== 'choose_one_...')
              }
              qrOnly={qrOnly}
              value={target === 'https://www.example.com/' ? '' : target}
            />
          </Col>
        </InputGroup>
      </Row>
      {/* utm_source */}
      <Row style={{ marginBottom: '-.5rem' }}>
        <Col sm={12}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={setSource}
              targetType="utm_source"
              enabled={!qrOnly}
              id="utm-source"
              settings={mainConfig.utm_term}
              selected={source}
            />
          </InputGroup>
        </Col>
      </Row>
      {/* utm_medium */}
      <Row style={{ marginBottom: '-.5rem' }}>
        <Col sm={12}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={setMedium}
              targetType="utm_medium"
              enabled={!qrOnly}
              id="medium-choice"
              settings={mainConfig.utm_medium}
              selected={medium}
            />
          </InputGroup>
        </Col>
      </Row>
      {/* utm_source */}
      <Row>
        <Col sm={12}>
          <UTMTextField
            valueChanged={setCampaign}
            targetType="utm_campaign"
            enableMe={!qrOnly}
            qrOnly={qrOnly}
            value={campaign}
          />
        </Col>
      </Row>
      {/* utm_team, utm_region, utm_country */}
      <Row style={{ marginTop: '.5rem', marginBottom: '-.5rem' }}>
        <Col sm={showCountry ? 4 : 6}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={updateTeam}
              targetType="utm_campaign_team"
              enabled={!qrOnly}
              id="utm-team"
              settings={mainConfig.team_name}
              selected={team}
            />
          </InputGroup>
        </Col>
        <Col sm={showCountry ? 4 : 6}>
          <InputGroup className="mb-3" size="lg">
            <UTMChoice
              valueChanged={updateRegion}
              targetType="utm_campaign_region"
              enabled={!qrOnly}
              id="utm-region"
              settings={mainConfig.region_name}
              selected={region}
            />
          </InputGroup>
        </Col>
        {showCountry && (
          <Col sm={4} style={{ marginTop: '.3rem' }}>
            <CountrySelect
              value={country as ICountry}
              valueAs="object"
              size="lg"
              disabled={qrOnly}
              onChange={updateCountry}
              onTextChange={updateCountry}
            />
          </Col>
        )}
      </Row>
      {/* utm_content */}
      <Row>
        <Col sm={12}>
          <InputGroup className="mb-3" size="lg">
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 300 }}
              overlay={<Tooltip id='auto-gen-tooltip'>This value is auto-generated</Tooltip>}
            >
              <FloatingLabel label="Final Campaign String">
                <FormControl
                  required
                  disabled
                  id="final-campaign-target"
                  aria-label="Final Campaign Value (Read Only)"
                  aria-describedby="Final Campaign Value (Read Only)"
                  value={finalCampaign}
                />
              </FloatingLabel>
            </OverlayTrigger>
            <Form.Control.Feedback type="invalid">
              This value is auto-generated
            </Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Row>
      <p />
      {/* Dire Warning modal */}
      <DireWarning
        show={showDireWarning}
        onHide={setShowDireWarning}
        onConfirm={dire}
      />
    </div>
  );
}

LinkForm.propTypes = {
  dark: PropTypes.bool,
};
