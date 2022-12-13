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
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Accordion, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Pill from './pills/Pill';
import { UtmParams, defaultUTMParams } from '../types';

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
  const [mediumVal, setMediumVal] = useState('');
  const [targetValidated, setTargetValidated] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [termPills, setTermPills] = useState<JSX.Element>([]);
  const [mediumPills, setMediumPills] = useState<JSX.Element>([]);
  const [basePills, setBasePills] = useState<JSX.Element>([]);

  // get the configuration
  useEffect(() => {
    window.electronAPI
      .getConfig(null)
      .then((response: JSON) => {
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

  const deletePillValue = (Ptype: string, value: string) => {
    let newPills: JSX.Element[] = [];
    switch (Ptype) {
      case 'term':
        newPills = termPills.filter((p) => p.key !== value);
        setTermPills(newPills);
        break;
      case 'medium':
        newPills = mediumPills.filter((p) => p.key !== value);
        setMediumPills(newPills);
        break;
      case 'base':
        newPills = basePills.filter((p) => p.key !== value);
        setBasePills(newPills);
        break;
      default:
        break;
    }
  };
  /* delete a Target pill. This is used as a callback to the Pill component */
  const deleteBasePill = ({ target }: { target: string }) => {
    const oldBases: string[] = config.utm_bases.value;
    oldBases.forEach((v: string, index): void => {
      if (v === target) {
        oldBases.splice(index, 1);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTarget = {
            ...newConfig.utm_bases,
          };
          newTarget.value = oldBases;
          newConfig.utm_bases = newTarget;
          return newConfig;
        });
      }
    });
  };

  useEffect(() => {
    const newPills: JSX.Element[] = [];
    config.utm_bases.value.forEach((v: string) => {
      newPills.push(
        <Pill key={`bases-${v}`} id={v} value={v} callback={deleteBasePill} />
      );
    });
    setBasePills(newPills);
  }, [config.utm_bases.value]);

  /* delete a Term pill. This is used as a callback to the Pill component */
  const deleteTermPill = ({ target }: { target: string }) => {
    const oldTerms: string[] = config.utm_term.value;
    oldTerms.forEach((term: string, index) => {
      if (term === target) {
        oldTerms.splice(index, 1);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newTerm = {
            ...newConfig.utm_term,
          };
          newTerm.value = oldTerms;
          newConfig.utm_term = newTerm;
          return newConfig;
        });
      }
    });
  };

  useEffect(() => {
    const pills = config.utm_term.value.map((term) => (
      <Pill
        id={term}
        value={term}
        callback={deleteTermPill}
        key={`term-pill-${term}`}
      />
    ));
    setTermPills(pills);
  }, [config.utm_term.value]);

  /* delete a Medium pill. This is used as a callback to the Pill component */
  const deleteMediumPill = ({ target }: { target: string }) => {
    const oldMediums: string[] = config.utm_medium.value;
    oldMediums.forEach((term: string, index) => {
      if (term === target) {
        oldMediums.splice(index, 1);
        setConfig((prevConfig) => {
          const newConfig = { ...prevConfig };
          const newMedium = {
            ...newConfig.utm_medium,
          };
          newMedium.value = oldMediums;
          newConfig.utm_medium = newMedium;
          return newConfig;
        });
      }
    });
  };
  useEffect(() => {
    const pills = config.utm_medium.value.map((term) => (
      <Pill
        id={term}
        value={term}
        callback={deleteMediumPill}
        key={`med-pill-${term}`}
      />
    ));
    setMediumPills(pills);
  }, [config.utm_medium.value]);

  // function makePills({
  //   pillType,
  //   value,
  // }: {
  //   pillType: string;
  //   value: string[];
  // }): JSX.Element[] {
  //   if (value === undefined) {
  //     return <></>;
  //   }
  //   const pills: JSX.Element[] = [];
  //   value.forEach((v: string) => {
  //     let cb = null;
  //     switch (pillType) {
  //       case 'utm_target':
  //         cb = deleteTargetPill;
  //         break;
  //       case 'utm_term':
  //         cb = deleteTermPill;
  //         break;
  //       case 'utm_medium':
  //         cb = deleteMediumPill;
  //         break;
  //       default:
  //         break;
  //     }

  //     pills.push(<Pill id={`${type}-${v}`} value={v} callback={cb} />);
  //   });
  //   return { pills };
  // }

  /* Add a new Target pill. This is used as a callback to the Pill component */
  // function termPillElements (terms) => {
  //   terms.value.map((term: string, index) => (
  //   <Pill
  //     id={`utm_term-${index}`}
  //     value={term}
  //     type="utm_term"
  //     callback={deleteTermPill}
  //   />
  // ));

  // const mediumPillElements = config.utm_medium.value.map(
  //   (med: string, index) => (
  //     <Pill
  //       id={`utm_medium-${index}`}
  //       value={med}
  //       type="utm_medium"
  //       callback={deleteMediumPill}
  //     />
  //   )
  // );

  // const targetPillElements = config.utm_target.value.map(
  //   (tar: string, index) => (
  //     <Pill
  //       id={`utm_target-${index}`}
  //       value={tar}
  //       type="utm_target"
  //       callback={deleteTargetPill}
  //     />
  //   )
  // );

  /* add a pill. This is used as a callback to the values field in targets, terms and mediums */
  const createTermPills = (event: EventKey) => {
    const v = event.target.value;
    const form = event.currentTarget;
    const t = event.target.id;
    setTermVal(event.target.value);
    if (!event.target.value.includes(',')) {
      return;
    }
    const val = v.replace(/,/g, '');
    // const i = val.toLowerCase().replace(/ /g, '-');
    const terms: string[] = config.utm_term.value;
    terms.push(val);
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      const newTerm = {
        ...newConfig.utm_term,
      };
      newTerm.value = terms;
      newConfig.utm_term = newTerm;
      return newConfig;
    });
    setTermVal('');
  };
  const createMediumPills = (event: EventKey) => {
    const v = event.target.value;
    const form = event.currentTarget;
    const t = event.target.id;
    setMediumVal(event.target.value);
    if (!event.target.value.includes(',')) {
      return;
    }
    const val: string = v.replace(/,/g, '');
    // const id = val.toLowerCase().replaceAll(' ', '-');
    const mediums: string[] = config.utm_medium.value;
    mediums.push(val);
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      const newMedium = {
        ...newConfig.utm_medium,
      };
      newMedium.value = mediums;
      newConfig.utm_medium = newMedium;
      return newConfig;
    });
    setMediumVal('');
  };
  const createTargetPills = (event: EventKey) => {
    const v = event.target.value;
    const form = event.currentTarget;
    const t = event.target.id;
    setBaseVal(event.target.value);
    if (!event.target.value.includes(',')) {
      return;
    }
    const val: string = v.replace(/,/g, '');
    if (val.search(/^http[s]*:\/\/|^ftp:\/\/ /) !== 0) {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      setTargetValidated(true);
      return;
    }
    // let tID: string = val.replace(/^(http[s]*:\/\/)|(^ftp):\/\/ /g, '');
    // tID = tID.replace(/[`~!@#$%^&*()_+={|\\\/?.,<>'";:} ]+/g, '-');
    const bases: string[] = config.utm_target.value;
    bases.push(val);
    setConfig((prevConfig) => {
      const newConfig = { ...prevConfig };
      const newTarget = {
        ...newConfig.utm_target,
      };
      newTarget.value = bases;
      newConfig.utm_target = newTarget;
      return newConfig;
    });
    setBaseVal('');
  };

  /* handle closing without saving */
  const handleCancel = () => {
    handleClose();
    // eslint-disable-next-line react/destructuring-assignment
    setShow(!show);
    callback(!show);
  };

  function callDone() {
    setShow(!show);
    callback(!show);
  }
  /* handle the save button */
  const handleSave = (event: Event) => {
    const form = event.currentTarget;
    if (form != null && form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setTargetValidated(true);
    const c = JSON.stringify(config);
    window.electronAPI
      .saveConfig(null, c)
      .then((response: JSON) => {
        callDone();
        return '';
      })
      .catch((error: unknown) => {
        console.log(`Error: ${error}`);
      });
  };

  return (
    <>
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
                        setConfig((prevConfig) => {
                          const newConfig = { ...prevConfig };
                          const newTarget = {
                            ...newConfig.utm_target,
                          };
                          newTarget.label = e.target.value;
                          newConfig.utm_target = newTarget;
                          return newConfig;
                        });
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
                            createTargetPills(eventKey);
                          }}
                        />
                        {/* <Form.Control.Feedback type="invalid">
                          Invalid URL! Please use a complete URL with http or
                          https.
                        </Form.Control.Feedback> */}
                        <br />
                        <div id="utm_bases-values">{basePills}</div>
                      </Form.Group>
                    )}
                  </Form.Group>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
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
                      config.utm_source.showName
                        ? `${config.utm_source.label} (utm_source)`
                        : `${config.utm_source.label}`
                    }
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.label = e.target.value;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_source-show"
                    // key="show-utm_source"
                    label="Show 'utm_source' in Field Label?"
                    checked={config.utm_source.showName}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.showName = e.target.checked;
                        newConfig.utm_source = newSource;
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
                    value={config.utm_source.tooltip}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.tooltip = e.target.value;
                        newConfig.utm_source = newSource;
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
                    value={config.utm_source.ariaLabel}
                    required
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.ariaLabel = e.target.value;
                        newConfig.utm_source = newSource;
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
                    value={config.utm_source.error}
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newSource = { ...newConfig.utm_source };
                        newSource.error = e.target.value;
                        newConfig.utm_source = newSource;
                        return newConfig;
                      });
                    }}
                  />
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
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
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newCampaign = {
                          ...newConfig.utm_campaign,
                        };
                        newCampaign.label = e.target.value;
                        newConfig.utm_campaign = newCampaign;
                        return newConfig;
                      });
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
            <Accordion.Item eventKey="3">
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
                    // key="utm_term_label"
                    id="utm_term-label"
                    placeholder="Enter utm_term field label"
                    value={
                      config.utm_term.showName
                        ? `${config.utm_term.label} (utm_term)`
                        : `${config.utm_term.label}`
                    }
                    onChange={(e) => {
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newTerm = { ...newConfig.utm_term };
                        newTerm.label = e.target.value;
                        newConfig.utm_term = newTerm;
                        return newConfig;
                      });
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    id="utm_term-show"
                    // key="show-utm_term"
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
                    // key="utm_term_tooltip"
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
                    // key="utm_term_aria"
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
                    // key="utm_term_error"
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
                    // key="utm_term_terms"
                    placeholder="Enter comma-separated list of terms to use"
                    value={termVal}
                    required
                    id="utm_term-values"
                    onChange={(eventKey) => {
                      createTermPills(eventKey);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide at least one term.
                  </Form.Control.Feedback>
                  <br />
                  <div id="utm_term-pills">{termPills}</div>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
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
                      setConfig((prevConfig) => {
                        const newConfig = { ...prevConfig };
                        const newMedium = { ...newConfig.utm_medium };
                        newMedium.label = e.target.value;
                        newConfig.utm_medium = newMedium;
                        return newConfig;
                      });
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
                    onChange={(eventKey) => {
                      createMediumPills(eventKey);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    You must provide at least one value.
                  </Form.Control.Feedback>
                  <br />
                  <div key="utm_medium-pills" id="utm_medium-pills">
                    {mediumPills}
                  </div>
                </Form.Group>
              </Accordion.Body>
            </Accordion.Item>
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
    </>
  );
}

ConfigEditor.propTypes = {
  showMe: PropTypes.bool.isRequired,
};
