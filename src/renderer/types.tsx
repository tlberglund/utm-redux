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

export type UtmObj = {
  showName: boolean;
  label: string;
  ariaLabel: string;
  tooltip: string;
  error: string;
  value: string[];
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

export type UtmParams = {
  restrict_bases: boolean;
  show_country: boolean;
  utm_bases: UtmObj;
  utm_campaign: UtmObj;
  utm_target: UtmObj;
  utm_term: UtmObj;
  utm_medium: UtmObj;
  utm_source: UtmObj;
  team_name: UtmObj;
  region_name: UtmObj;
  bitly_config: BitlyConfig;
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

export const defaultUTMTeamName: UtmObj = {
  showName: true,
  label: 'Team Name',
  tooltip: 'What is your team name?',
  error: 'Please enter a valid team name',
  ariaLabel: 'Team Name',
  value: [
    'Developer Relations',
    'Executive Leadership',
    'Engineering',
    'External Paid',
    'Influ2',
    'Internal Paid',
    'Marketing',
    'Product',
    'Sales',
    'Social',
  ],
};

export const defaultUTMRegionName: UtmObj = {
  showName: true,
  label: 'Region Name',
  tooltip: 'What is your region name?',
  error: 'Please enter a valid region name',
  ariaLabel: 'Region Name',
  value: ['North America', 'APAC', 'EMEA', 'Global'],
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
  label: 'Source',
  tooltip: `What's the Campaign Source?`,
  error: 'Please choose a valid source',
  ariaLabel: `What's the Campaign Source?`,
  value: [
    'Adwords',
    'Angel',
    'Baidu',
    'Bing',
    'Discord',
    'DuckDuckGo',
    'Dev To',
    'DZone',
    'Facebook',
    'GitHub',
    'GitLab',
    'Google',
    'LinkedIn',
    'Medium',
    'Otta',
    'Reddit',
    'Simplify',
    'Slack',
    'Stack Overflow',
    'Techmeme',
    'Twitter',
    'Youtube',
  ],
};

export const defaultUTMMedium: UtmObj = {
  showName: true,
  label: 'Referral Type',
  tooltip: 'What kind of referral link is this?',
  error: 'Please choose a valid referral type',
  ariaLabel: 'Referral Type',
  value: [
    'CPC',
    'Direct',
    'Display',
    'Email',
    'Event',
    'Organic',
    'Paid Search',
    'Paid Social',
    'QR',
    'Referral',
    'Retargeting',
    'Social',
    'PPC',
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
  label: 'Campaign',
  tooltip: 'Enter a campaign name',
  error: 'Please enter a valid campaign name',
  ariaLabel: 'Campaign Name',
  value: [],
};

export const defaultUTMParams: UtmParams = {
  restrict_bases: false,
  show_country: true,
  utm_bases: defaultUTMBases,
  utm_campaign: defaultUTMCampaign,
  utm_target: defaultUTMTarget,
  utm_term: defaultUTMTerm,
  utm_medium: defaultUTMMedium,
  utm_source: defaultUTMSource,
  bitly_config: defaultBitlyConfig,
  team_name: defaultUTMTeamName,
  region_name: defaultUTMRegionName,
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
