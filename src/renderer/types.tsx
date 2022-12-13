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
// import QRCodeStyling from 'styled-qr-code';
import icon from '../../assets/images/startree_logo-mark_fill-lightning.png';

export type UtmObj = {
  showName: boolean;
  label: string;
  ariaLabel: string;
  tooltip: string;
  error: string;
  value: string[];
};

export type UtmParams = {
  restrict_bases: boolean;
  utm_bases: UtmObj;
  utm_campaign: UtmObj;
  utm_target: UtmObj;
  utm_term: UtmObj;
  utm_medium: UtmObj;
  utm_source: UtmObj;
  bitly_config: BitlyConfig;
};

export type BitlyConfig = {
  label: string;
  ariaLabel: string;
  tooltip: string;
  error: string;
  bitlyToken: string;
  bitlyDomain: string;
  bitlyAddr: string;
  bitlyEnabled: boolean;
};

export const defaultBitlyConfig: BitlyConfig = {
  label: 'Use Bitly',
  ariaLabel: 'Shorten Link with Bitly',
  tooltip: 'Shorten Link with Bitly',
  error: 'No Bitly Token Found',
  bitlyToken: '5ac621cc74757be94d9377b1a516405c7b33e53e',
  bitlyDomain: 'stree.ai',
  bitlyAddr: 'https://api-ssl.bitly.com/v4/shorten',
  bitlyEnabled: false,
};

export const defaultUTMBases = {
  showName: true,
  label: 'UTM Target Base URLs',
  ariaLabel: 'Base URLs for UTM Target',
  tooltip: 'Base URLs for UTM Target',
  error: 'These need to be full URLs',
  value: ['https://foo.com/', 'https://bar.com/', 'https://Foo.Bar.com/'],
};

export const defaultUTMTarget: UtmObj = {
  showName: true,
  label: 'Link Target',
  tooltip: 'Where will this link point to?',
  error: 'Please enter a valid URL',
  ariaLabel: 'Where will this link point to?',
  value: [''],
};

export const defaultUTMTerm: UtmObj = {
  showName: true,
  label: 'Division/Group',
  tooltip: 'What division/Group are you in?',
  error: 'Please choose a valid division/group',
  ariaLabel: 'What division/Group are you in?',
  value: [
    'DevRel',
    'Marketing',
    'Product',
    'Engineering',
    'CTO',
    'CEO',
    'Sales',
    'Other',
  ],
};

export const defaultUTMMedium: UtmObj = {
  showName: true,
  label: 'Referral Type',
  tooltip: 'What kind of referral link is this?',
  error: 'Please choose a valid referral type',
  ariaLabel: 'Referral Type',
  value: [
    'Blog Post',
    'Twitter',
    'LinkedIn',
    'Facebook',
    'dev.to',
    'DZone',
    'Medium',
    'GitHub',
    'GitLab',
    'Stack Overflow',
    'Reddit',
    'Slack',
    'Discord',
    'YouTube',
    'Email',
    'Other',
  ],
};

export const defaultUTMSource: UtmObj = {
  showName: true,
  label: 'Referral Source',
  tooltip: 'Where will you be posting this link?',
  error: 'Please enter a valid referral source',
  ariaLabel: 'Referral Source',
  value: [],
};

export const defaultUTMCampaign: UtmObj = {
  showName: true,
  label: 'Full Name',
  tooltip: 'Enter your full first and last names?',
  error: 'You need to enter your full first and last names please.',
  ariaLabel: 'Enter your Full Name',
  value: [],
};

export const defaultUTMParams: UtmParams = {
  restrict_bases: true,
  utm_bases: defaultUTMBases,
  utm_campaign: defaultUTMCampaign,
  utm_target: defaultUTMTarget,
  utm_term: defaultUTMTerm,
  utm_medium: defaultUTMMedium,
  utm_source: defaultUTMSource,
  bitly_config: defaultBitlyConfig,
};

// export const defaultQRStyle = new QRCodeStyling({
//   width: 180,
//   height: 180,
//   margin: 0,
//   image: icon,
//   type: 'canvas',
//   dotsOptions: {
//     color: '#0B263E',
//     type: 'dots',
//   },
//   imageOptions: {
//     crossOrigin: 'anonymous',
//     imageSize: 0.15,
//     margin: -25,
//   },
//   cornersSquareOptions: {
//     type: 'dot',
//     color: '#0B263E',
//   },
//   cornersDotOptions: {
//     type: 'dot',
//     color: '#0B263E',
//   },
//   backgroundOptions: {
//     color: '#ffffff',
//   },
// });
