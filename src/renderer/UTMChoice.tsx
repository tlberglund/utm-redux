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
import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { FloatingLabel, OverlayTrigger, Tooltip } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { UtmObj, defaultUTMMedium } from './types';

export default function UTMChoice({
  valueChanged,
  targetType,
  enabled,
  id,
  reference,
}: {
  valueChanged: (value: string) => void;
  targetType: string;
  enabled: boolean;
  id: string;
}): JSX.Element {
  const [label, setLabel] = useState<string>('');
  const [values, setValues] = useState<string[]>(['']);
  const [tooltip, setTooltip] = useState<string>('');
  const [ariaLabel, setAriaLabel] = useState<string>('');
  const [errorLabel, setErrorLabel] = useState<string>('');
  const [showName, setShowName] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);
  const [enableChoice, setEnableChoice] = useState<boolean>(true);
  const [choices, setChoices] = useState<JSX.Element[]>([]);
  const ref = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getGroups(vals: string[]): JSX.Element[] {
    const groups: JSX.Element[] = [];
    vals.forEach((val) => {
      groups.push(
        <option key={`${targetType}-${val}`} value={val}>
          {val}
        </option>
      );
    });
    return groups;
  }

  // get the configuration
  useEffect(() => {
    window.electronAPI
      .getParams(null, targetType)
      .then((response: JSON) => {
        const c: UtmObj = JSON.parse(response);
        setAriaLabel(c.ariaLabel);
        setLabel(c.label);
        setErrorLabel(c.error);
        setShowName(c.showName);
        setTooltip(c.tooltip);
        setValues(c.value);
        setChoices(getGroups(c.value));
        return '';
      })
      .catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error(`Error: ${error}`);
      });
  }, [targetType]);

  useEffect(() => {
    setEnableChoice(enabled);
  }, [enabled]);

  return (
      <OverlayTrigger placement="top" overlay={<Tooltip>{tooltip}</Tooltip>}>
      <FloatingLabel label={showName ? `${label} (${targetType})` : label}>
        <Form.Select
          required
          ref={ref}
          aria-label={showName ? `${ariaLabel} (${targetType})` : ariaLabel}
          id={targetType}
          disabled={!enableChoice}
          onChange={(eventKey) => {
            valueChanged(
              eventKey.target.value.replace(/ /g, '_').toLowerCase()
            );
          }}
        >
          <option defaultValue>
            {enableChoice ? 'Choose one ...' : 'Choose a Term first'}
          </option>
          {choices}
        </Form.Select>
      </FloatingLabel>
    </OverlayTrigger>
  );
}

UTMChoice.propTypes = {
  valueChanged: PropTypes.func.isRequired,
  targetType: PropTypes.string.isRequired,
  enabled: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
};
