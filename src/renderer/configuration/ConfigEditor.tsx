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
/* eslint-disable no-case-declarations */
import { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Accordion, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UtmParams, defaultUTMParams, UtmKeyValue } from '../types';
import PillArea from './pills/PillArea';

export default function ConfigEditor({
  showMe,
  callback,
}: {
  showMe: boolean;
  callback: (value: boolean) => void;
}): JSX.Element {
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState<UtmParams>(defaultUTMParams);
  const [baseVal, setBaseVal] = useState('');
  const [termVal, setTermVal] = useState('');
  const [teamVal, setTeamVal] = useState('');
  const [teamValid, setTeamValid] = useState(true);
  const [sourceValid, setSourceValid] = useState(true);
  const [regionVal, setRegionVal] = useState('');
  const [regValid, setRegValid] = useState(true);
  const [mediumVal, setMediumVal] = useState('');
  const [medValid, setMedValid] = useState(true);
  const [targetValidated, setTargetValidated] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // get the configuration
  useEffect(() => {
    window.electronAPI
      .getConfig()
      .then((response: string) => {
        const c: UtmParams = JSON.parse(response);
        setConfig(c);
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  }, []);

  useEffect(() => {
    setShow(showMe);
  }, [showMe]);

  const deletePillValue = (value: string, type: string) => {
    switch (type) {
      case 'utm_target':
        const newB = Object.entries(config.utm_bases);
        const bLen = newB.length;
        const entries: UtmKeyValue[] = newB[bLen - 1][1] as UtmKeyValue[];
        for (let i = 0; i < entries.length; i += 1) {
          if (entries[i].value === value) {
            entries.splice(i, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newBase = {
            ...newConfig.utm_bases,
          };
          newBase.value = entries;
          newConfig.utm_bases = newBase;
          return newConfig;
        });
        break;
      case 'utm_term':
        const newT = Object.entries(config.utm_term);
        const tLen = newT.length;
        const tEntries: UtmKeyValue[] = newT[tLen - 1][1] as UtmKeyValue[];
        for (let t = 0; t < tEntries.length; t += 1) {
          if (tEntries[t].value === value) {
            tEntries.splice(t, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTerm = {
            ...newConfig.utm_term,
          };
          newTerm.value = tEntries;
          newConfig.utm_term = newTerm;
          return newConfig;
        });
        break;
      case 'utm_medium':
        const newM = Object.entries(config.utm_medium);
        const mLen = newM.length;
        const mEntries: UtmKeyValue[] = newM[mLen - 1][1] as UtmKeyValue[];
        for (let n = 0; n < mEntries.length; n += 1) {
          if (mEntries[n].value === value) {
            mEntries.splice(n, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newMed = {
            ...newConfig.utm_medium,
          };
          newMed.value = mEntries;
          newConfig.utm_medium = newMed;
          return newConfig;
        });
        break;
      case 'team_name':
        const newTea = Object.entries(config.team_name);
        const len = newTea.length;
        const teaEntries: UtmKeyValue[] = newTea[len - 1][1] as UtmKeyValue[];
        for (let tn = 0; tn < teaEntries.length; tn += 1) {
          if (teaEntries[tn].value === value) {
            teaEntries.splice(tn, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTeam = {
            ...newConfig.team_name,
          };
          newTeam.value = teaEntries;
          newConfig.team_name = newTeam;
          return newConfig;
        });
        break;
      case 'region_name':
        const newReg = Object.entries(config.region_name);
        const gLen = newReg.length;
        const rEntries: UtmKeyValue[] = newReg[gLen - 1][1] as UtmKeyValue[];
        for (let i = 0; i < rEntries.length; i += 1) {
          if (rEntries[i].value === value) {
            rEntries.splice(i, 1);
          }
        }
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTeam = {
            ...newConfig.region_name,
          };
          newTeam.value = rEntries;
          newConfig.region_name = newTeam;
          return newConfig;
        });
        break;
      default:
        break;
    }
  };

  const addPill = (event: SyntheticEvent, type: string) => {
    const target = event.target as HTMLInputElement;

    switch (type) {
      case 'utm_target':
        setBaseVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        setBaseVal('');
        const newTar = config.utm_bases.value;
        const newTarPill = {
          key: target?.value?.replace(/,/g, ''),
          value: target?.value?.replace(/,/g, ''),
        };
        newTar.push(newTarPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newBase = {
            ...newConfig.utm_bases,
          };
          newBase.value = newTar;
          newConfig.utm_bases = newBase;
          return newConfig;
        });
        break;
      case 'utm_term':
        setTermVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setSourceValid(false);
          return;
        }
        setTermVal('');
        const newTrm = config.utm_term.value;
        const newTrmPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newTrm.push(newTrmPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTerm = {
            ...newConfig.utm_term,
          };
          newTerm.value = newTrm;
          newConfig.utm_term = newTerm;
          return newConfig;
        });
        break;
      case 'team_name':
        setTeamVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setTeamValid(false);
          return;
        }
        setTeamVal('');
        const newTm = config.team_name.value as UtmKeyValue[];
        const newTmPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newTm.push(newTmPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTeam = {
            ...newConfig.team_name,
          };
          newTeam.value = newTm;
          newConfig.team_name = newTeam;
          return newConfig;
        });
        break;
      case 'region_name':
        setRegionVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setRegValid(false);
          return;
        }
        setRegionVal('');
        const newR = config.region_name.value;
        const newRPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1],
          value: target?.value?.replace(/,/g, '').split('=')[0],
        };
        newR.push(newRPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTeam = {
            ...newConfig.region_name,
          };
          newTeam.value = newR;
          newConfig.region_name = newTeam;
          return newConfig;
        });
        break;
      case 'utm_medium':
        setMediumVal(target?.value);
        if (!target?.value.includes(',')) {
          return;
        }
        if (target?.value.indexOf('=') === -1) {
          setMedValid(false);
          return;
        }
        setMediumVal('');
        const newMeds = config.utm_medium.value;
        const newMedPill = {
          key: target?.value?.replace(/,/g, '').split('=')[1].trim(),
          value: target?.value?.replace(/,/g, '').split('=')[0].trim(),
        };
        newMeds.push(newMedPill);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newMed = {
            ...newConfig.utm_medium,
          };
          newMed.value = newMeds;
          newConfig.utm_medium = newMed;
          return newConfig;
        });
        break;
      default:
        break;
    }
  };

  const setFieldValue = (event: ChangeEvent, type: string) => {
    const target = event.target as HTMLInputElement;

    const ind = target?.value.indexOf('(');
    const nv =
      target?.value.indexOf('(') > -1
        ? target?.value.substring(0, target?.value.indexOf('(') - 1).trim()
        : target?.value;
    switch (type) {
      case 'utm_target':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newVal = {
            ...newConfig.utm_target,
          };
          newVal.label = nv;
          newConfig.utm_target = newVal;
          return newConfig;
        });
        break;
      case 'utm_term':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newVal = {
            ...newConfig.utm_term,
          };
          newVal.label = nv;
          newConfig.utm_term = newVal;
          return newConfig;
        });
        break;
      case 'utm_medium':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newVal = {
            ...newConfig.utm_medium,
          };
          newVal.label = nv;
          newConfig.utm_medium = newVal;
          return newConfig;
        });
        break;
      case 'team_name':
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newVal = {
            ...newConfig.team_name,
          };
          newVal.label = nv;
          newConfig.team_name = newVal;
          return newConfig;
        });
        break;
      default:
        break;
    }
  };
  /* handle closing without saving */
  const handleCancel = () => {
    handleClose();
    callback(false);
  };

  function callDone() {
    callback(false);
  }
  /* handle the save button */
  const handleSave = (event: SyntheticEvent) => {
    const form = event.currentTarget as HTMLFormElement;
    if (form != null && form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setTargetValidated(true);
    const c = JSON.stringify(config);
    window.electronAPI
      .saveConfig(c)
      .then((response: string) => {
        callDone();
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      size="xl"
      dialogClassName="modal-90w"
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Configuration Editor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Accordion>
          {/* UTM Target */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <strong>utm_target</strong>
            </Accordion.Header>
            <Accordion.Body id="utm_target">
              <Form noValidate validated={targetValidated}>
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_target_label"
                    id="utm_target-label"
                    placeholder="Enter utm_target field label"
                    value={
                      config.utm_target.showName
                        ? `${config.utm_target.label} (utm_target)`
                        : `${config.utm_target.label}`
                    }
                    onChange={(e) => {
                      setFieldValue(e, 'utm_target');
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    // key="show-utm_target"
                    id="utm_target-show"
                    label="Show 'utm_target' in Field Label?"
                    checked={config.utm_target.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTarget = {
                          ...newConfig.utm_target,
                        };
                        newTarget.showName = e.target.checked;
                        newConfig.utm_target = newTarget;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_target_tooltip"
                    id="utm_target-tooltip"
                    placeholder="Enter utm_target field tooltip"
                    value={config.utm_target.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTarget = {
                          ...newConfig.utm_target,
                        };
                        newTarget.tooltip = e.target.value;
                        newConfig.utm_target = newTarget;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_target_aria"
                    id="utm_target-aria"
                    placeholder="Enter utm_target field ARIA (Accessibility) label"
                    required
                    value={config.utm_target.ariaLabel}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTarget = {
                          ...newConfig.utm_target,
                        };
                        newTarget.ariaLabel = e.target.value;
                        newConfig.utm_target = newTarget;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    // key="utm_target_error"
                    id="utm_target-error"
                    placeholder="Enter utm_target field tooltip"
                    value={config.utm_target.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTarget = {
                          ...newConfig.utm_target,
                        };
                        newTarget.error = e.target.value;
                        newConfig.utm_target = newTarget;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_target-restrict_bases"
                    // key="restrict-bases"
                    label="Restrict base URLs for utm_targets?"
                    checked={config.restrict_bases}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        newConfig.restrict_bases = e.target.checked;
                        return newConfig;
                      });
                    }}
                  />
                  {config.restrict_bases && (
                    <Form.Group>
                      <Form.Label>
                        <strong>Base URLs</strong>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        // key="utm_target-bases"
                        id="utm_target-bases"
                        placeholder="Enter comma-separated list of URLs to use for restricted utm_target bases"
                        value={baseVal}
                        required
                        pattern="/^(http[s]*)|(^ftp):\/\/ /"
                        onChange={(eventKey) => {
                          addPill(eventKey, 'utm_target');
                        }}
                      />
                      <br />
                      <PillArea
                        pills={config.utm_bases.value}
                        type="utm_target"
                        callback={deletePillValue}
                      />
                    </Form.Group>
                  )}
                </Form.Group>
              </Form>
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Source  NOTE: WE ARE USING THE utm_term values here! */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <strong>utm_source</strong>
            </Accordion.Header>
            <Accordion.Body id="utm_source">
              <Form.Group>
                <Form.Label>
                  <strong>Label</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_source_label"
                  id="utm_source-label"
                  placeholder="Enter utm_source field label"
                  value={
                    config.utm_term.showName
                      ? `${config.utm_term.label} (utm_source)`
                      : `${config.utm_term.label}`
                  }
                  onChange={(e) => {
                    setFieldValue(e, 'utm_term');
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="utm_source-show"
                  // key="show-utm_source"
                  label="Show 'utm_source' in Field Label?"
                  checked={config.utm_term.showName}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newSource = { ...newConfig.utm_term };
                      newSource.showName = e.target.checked;
                      newConfig.utm_term = newSource;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ToolTip Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_source_tooltip"
                  id="utm_source-tooltip"
                  placeholder="Enter utm_source field tooltip"
                  value={config.utm_term.tooltip}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newSource = { ...newConfig.utm_term };
                      newSource.tooltip = e.target.value;
                      newConfig.utm_term = newSource;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ARIA (Accessibility) Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="utm_source-aria"
                  placeholder="Enter utm_source field ARIA (Accessibility) label"
                  value={config.utm_term.ariaLabel}
                  required
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newSource = { ...newConfig.utm_term };
                      newSource.ariaLabel = e.target.value;
                      newConfig.utm_term = newSource;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Error Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_source_error"
                  id="utm_source-error"
                  placeholder="Enter utm_source field error mesage"
                  value={config.utm_term.error}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newSource = { ...newConfig.utm_term };
                      newSource.error = e.target.value;
                      newConfig.utm_term = newSource;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Source Values</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_medium-values"
                  placeholder="Enter comma-separated list of key=value pairs to use"
                  value={termVal}
                  required
                  id="utm_source-values"
                  isInvalid={!sourceValid}
                  onChange={(eventKey) => {
                    addPill(eventKey, 'utm_term');
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  You must provide a key=value pair.
                </Form.Control.Feedback>
                <br />
                <PillArea
                  pills={config.utm_term.value}
                  type="utm_term"
                  callback={deletePillValue}
                />
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Medium */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <strong>utm_medium</strong>
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group>
                <Form.Label>
                  <strong>Label</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="utm_medium-label"
                  // key="utm_medium-label"
                  placeholder="Enter utm_medium field label"
                  value={
                    config.utm_medium.showName
                      ? `${config.utm_medium.label} (utm_medium)`
                      : `${config.utm_medium.label}`
                  }
                  onChange={(e) => {
                    setFieldValue(e, 'utm_medium');
                  }}
                />
                <Form.Check
                  type="checkbox"
                  // key="show-utm_medium"
                  id="show-utm-medium"
                  label="Show 'utm_medium' in Field Label?"
                  checked={config.utm_medium.showName}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newMedium = { ...newConfig.utm_medium };
                      newMedium.showName = e.target.checked;
                      newConfig.utm_medium = newMedium;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ToolTip Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_medium-tooltip"
                  id="utm_medium-tooltip"
                  placeholder="Enter utm_medium field tooltip"
                  value={config.utm_medium.tooltip}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newMedium = { ...newConfig.utm_medium };
                      newMedium.tooltip = e.target.value;
                      newConfig.utm_medium = newMedium;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ARIA (Accessibility) Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_medium-aria"
                  id="utm_medium-aria"
                  placeholder="Enter utm_medium field ARIA (Accessibility) label"
                  value={config.utm_medium.ariaLabel}
                  required
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newMedium = { ...newConfig.utm_medium };
                      newMedium.ariaLabel = e.target.value;
                      newConfig.utm_medium = newMedium;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Error Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_medium-error"
                  id="utm_medium-error"
                  placeholder="Enter utm_medium field error mesage"
                  value={config.utm_medium.error}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newMedium = { ...newConfig.utm_medium };
                      newMedium.error = e.target.value;
                      newConfig.utm_medium = newMedium;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Medium Values</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_medium-values"
                  placeholder="Enter comma-separated list of values to use"
                  value={mediumVal}
                  required
                  id="utm_medium-values"
                  isInvalid={!medValid}
                  onChange={(eventKey) => {
                    addPill(eventKey, 'utm_medium');
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  You must provide a key=value pair.
                </Form.Control.Feedback>
                <br />
                <PillArea
                  pills={config.utm_medium.value}
                  type="utm_medium"
                  callback={deletePillValue}
                />
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Campaign */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <strong>utm_campaign</strong>
            </Accordion.Header>
            <Accordion.Body id="utm_campaign">
              <Form.Group>
                <Form.Label>
                  <strong>Label</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_campaign_label"
                  id="utm_campaign-label"
                  placeholder="Enter utm_campaign field label"
                  value={
                    config.utm_campaign.showName
                      ? `${config.utm_campaign.label} (utm_campaign)`
                      : `${config.utm_campaign.label}`
                  }
                  onChange={(e) => {
                    setFieldValue(e, 'utm_campaign');
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="utm_campaign-show"
                  // key="show-utm_campaign"
                  label="Show 'utm_campaign' in Field Label?"
                  checked={config.utm_campaign.showName}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCampaign = {
                        ...newConfig.utm_campaign,
                      };
                      newCampaign.showName = e.target.checked;
                      newConfig.utm_campaign = newCampaign;
                      return newConfig;
                    });
                  }}
                />
                <br />
                <Form.Label>
                  <strong>ToolTip Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_campaign_tooltip"
                  id="utm_campaign-tooltip"
                  placeholder="Enter utm_campaign field tooltip"
                  value={config.utm_campaign.tooltip}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCampaign = {
                        ...newConfig.utm_campaign,
                      };
                      newCampaign.tooltip = e.target.value;
                      newConfig.utm_campaign = newCampaign;
                      return newConfig;
                    });
                  }}
                />
                <br />
                <Form.Label>
                  <strong>ARIA (Accessibility) Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_campaign_aria"
                  id="utm_campaign-aria"
                  required
                  placeholder="Enter utm_campaign field ARIA (Accessibility) label"
                  value={config.utm_campaign.ariaLabel}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCampaign = {
                        ...newConfig.utm_campaign,
                      };
                      newCampaign.ariaLabel = e.target.value;
                      newConfig.utm_campaign = newCampaign;
                      return newConfig;
                    });
                  }}
                />
                <br />
                <Form.Label>
                  <strong>Error Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_campaign_error"
                  id="utm_campaign-error"
                  placeholder="Enter utm_campaign field error message"
                  value={config.utm_campaign.error}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newCampaign = {
                        ...newConfig.utm_campaign,
                      };
                      newCampaign.error = e.target.value;
                      newConfig.utm_campaign = newCampaign;
                      return newConfig;
                    });
                  }}
                />
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Team */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <strong>team_name</strong>
            </Accordion.Header>
            <Accordion.Body id="team_name">
              <Form.Group>
                <Form.Label>
                  <strong>Label</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="team_name-label"
                  placeholder="Enter team_name field label"
                  value={
                    config.team_name.showName
                      ? `${config.team_name.label} (team_name)`
                      : `${config.team_name.label}`
                  }
                  onChange={(e) => {
                    setFieldValue(e, 'team_name');
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="team_name-show"
                  // key="show-utm_term"
                  label="Show 'team_name' in Field Label?"
                  checked={config.team_name.showName}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.showName = e.target.checked;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ToolTip Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_term_tooltip"
                  id="team_name-tooltip"
                  placeholder="Enter team_name field tooltip"
                  value={config.team_name.tooltip}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.tooltip = e.target.value;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ARIA (Accessibility) Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="team_name-aria"
                  placeholder="Enter team_name field ARIA (Accessibility) label"
                  value={config.team_name.ariaLabel}
                  required
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.ariaLabel = e.target.value;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Error Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="team_name-error"
                  placeholder="Enter team_name field error mesage"
                  value={config.team_name.error}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.team_name };
                      newTeam.error = e.target.value;
                      newConfig.team_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Teams</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_term_terms"
                  placeholder="Enter comma-separated list of key=value pairs for teams to use"
                  value={teamVal}
                  isInvalid={!teamValid}
                  required
                  id="team_name-values"
                  onChange={(eventKey) => {
                    addPill(eventKey, 'team_name');
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  You must provide at least one key=value pair for a team.
                </Form.Control.Feedback>
                <br />
                <PillArea
                  pills={config.team_name.value}
                  type="team_name"
                  callback={deletePillValue}
                />
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Region */}
          <Accordion.Item eventKey="5">
            <Accordion.Header>
              <strong>region_name</strong>
            </Accordion.Header>
            <Accordion.Body id="region_name">
              <Form.Group>
                <Form.Label>
                  <strong>Label</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="region_name-label"
                  placeholder="Enter region_name field label"
                  value={
                    config.region_name.showName
                      ? `${config.region_name.label} (region_name)`
                      : `${config.region_name.label}`
                  }
                  onChange={(e) => {
                    setFieldValue(e, 'region_name');
                  }}
                />
                <Form.Check
                  type="checkbox"
                  id="region_name-show"
                  label="Show 'region_name' in Field Label?"
                  checked={config.region_name.showName}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.region_name };
                      newTeam.showName = e.target.checked;
                      newConfig.region_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ToolTip Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="region_name-tooltip"
                  placeholder="Enter region_name field tooltip"
                  value={config.region_name.tooltip}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.region_name };
                      newTeam.tooltip = e.target.value;
                      newConfig.region_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>ARIA (Accessibility) Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="region_name-aria"
                  placeholder="Enter region_name field ARIA (Accessibility) label"
                  value={config.region_name.ariaLabel}
                  required
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.region_name };
                      newTeam.ariaLabel = e.target.value;
                      newConfig.region_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Error Text</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  id="region_name-error"
                  placeholder="Enter region_name field error mesage"
                  value={config.region_name.error}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      const newTeam = { ...newConfig.region_name };
                      newTeam.error = e.target.value;
                      newConfig.region_name = newTeam;
                      return newConfig;
                    });
                  }}
                />
                <Form.Label>
                  <strong>Regions</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  // key="utm_term_terms"
                  placeholder="Enter comma-separated list of key=value pairs for regions to use"
                  value={regionVal}
                  isInvalid={!regValid}
                  required
                  id="region_name-values"
                  onChange={(eventKey) => {
                    addPill(eventKey, 'region_name');
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  You must provide a key=value pair for a region.
                </Form.Control.Feedback>
                <br />
                <PillArea
                  pills={config.region_name.value}
                  type="region_name"
                  callback={deletePillValue}
                />
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6">
            <Accordion.Header>
              <strong>show_country</strong>
            </Accordion.Header>
            <Accordion.Body id="show_country">
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  id="show_country-show"
                  label="Show Country Selector?"
                  checked={config.show_country}
                  onChange={(e) => {
                    setConfig((prevConfig) => {
                      const newConfig = { ...prevConfig };
                      newConfig.show_country = e.target.checked;
                      return newConfig;
                    });
                  }}
                />
              </Form.Group>
            </Accordion.Body>
          </Accordion.Item>
          {/* UTM Term */}
          {/* <Accordion.Item eventKey="5">
              <Accordion.Header>
                <strong>utm_term</strong>
              </Accordion.Header>
              <Accordion.Body id="utm_term">
                <Form.Group>
                  <Form.Label>
                    <strong>Label</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_term-label"
                    placeholder="Enter utm_term field label"
                    value={
                      config.utm_term.showName
                        ? `${config.utm_term.label} (utm_term)`
                        : `${config.utm_term.label}`
                    }
                    onChange={(e) => {
                      setFieldValue(e, 'utm_term');
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_term-show"
                    label="Show 'utm_term' in Field Label?"
                    checked={config.utm_term.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.showName = e.target.checked;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ToolTip Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_term-tooltip"
                    placeholder="Enter utm_term field tooltip"
                    value={config.utm_term.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.tooltip = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>ARIA (Accessibility) Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_term-aria"
                    placeholder="Enter utm_term field ARIA (Accessibility) label"
                    value={config.utm_term.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.ariaLabel = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Error Text</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="utm_term-error"
                    placeholder="Enter utm_term field error mesage"
                    value={config.utm_term.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.error = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Label>
                    <strong>Terms</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter comma-separated list of terms to use"
                    value={termVal}
                    required
                    id="utm_term-values"
                    onChange={(eventKey) => {
                      addPill(eventKey, 'utm_term');
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide at least one term.
                  </Form.Control.Feedback>
                  <br />
                  <PillArea
                    pills={config.utm_term.value}
                    type="utm_term"
                    callback={deletePillValue}
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item> */}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Close
        </Button>
        <Button type="button" variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ConfigEditor.propTypes = {
  showMe: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};
