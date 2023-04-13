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

import { IProps } from 'react-qrcode-logo';
import logo from '../../assets/images/logo-mark_fill.png';

export type UtmKeyValue = {
  key: string;
  value: string;
};

export type UtmObj = {
  showName: boolean;
  label: string;
  ariaLabel: string;
  tooltip: string;
  error: string;
  value: UtmKeyValue[];
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
  showName: false,
  label: 'StarTree Property',
  ariaLabel: 'StarTree Property',
  tooltip: 'Which StarTree web property will this link point to?',
  error: 'These need to be full URLs',
  value: [
    { key: 'https://startree.ai/', value: 'https://startree.ai' },
    { key: 'https://dev.startree.ai/', value: 'https://dev.startree.ai' },
    { key: 'https://rtasummit.com/', value: 'https://rtasummit.com' },
  ],
};

export const defaultUTMTeamName: UtmObj = {
  showName: false,
  label: 'Team',
  tooltip: 'What StarTree team are you on?',
  error: 'Please enter a valid team name',
  ariaLabel: 'Team Name',
  value: [
    { key: 'dr', value: 'Developer Relations' },
    { key: 'el', value: 'Executive Leaders' },
    { key: 'en', value: 'Engineering' },
    { key: 'ep', value: 'External Paid' },
    { key: 'ga', value: 'Gartner' },
    { key: 'i2', value: 'Influ2 Ad' },
    { key: 'ip', value: 'Internal Paid' },
    { key: 'mk', value: 'Marketing' },
    { key: 'pr', value: 'Product' },
    { key: 'sa', value: 'Sales' },
    { key: 'so', value: 'Social' },
  ],
};

export const defaultUTMRegionName: UtmObj = {
  showName: false,
  label: 'Region',
  tooltip: 'What region will this target?',
  error: 'Please enter a valid region name',
  ariaLabel: 'Region Name',
  value: [
    { key: 'na', value: 'North America' },
    { key: 'apac', value: 'APAC' },
    { key: 'emea', value: 'EMEA' },
    { key: 'gl', value: 'Global' },
  ],
};

export const defaultUTMTarget: UtmObj = {
  showName: false,
  label: 'URL Parameters',
  tooltip: 'Additional URL parameters to append to the link',
  error: 'Please enter a valid URL Parameter',
  ariaLabel: 'Add any additional URL parameters',
  value: [{ key: '', value: '' }],
};

export const defaultUTMTerm: UtmObj = {
  showName: false,
  label: 'Source',
  tooltip: `What's the Campaign Source? This would be where you're posting the link, usually.`,
  error: 'Please choose a valid source',
  ariaLabel: `What's the Campaign Source?`,
  value: [
    { key: 'adwords', value: 'Adwords' },
    { key: 'angel', value: 'Angel' },
    { key: 'baidu', value: 'Baidu' },
    { key: 'bing', value: 'Bing' },
    { key: 'conf-talk', value: 'Conference Talk' },
    { key: 'discord', value: 'Discord' },
    { key: 'duckduckgo', value: 'Duck Duck Go' },
    { key: 'dev-to', value: 'Dev.To' },
    { key: 'dzone', value: 'DZone' },
    { key: 'facebook', value: 'Facebook' },
    { key: 'github', value: 'GitHub' },
    { key: 'gitlab', value: 'GitLab' },
    { key: 'google', value: 'Google' },
    { key: 'hacker-news', value: 'Hacker News' },
    { key: 'in-person', value: 'In Person' },
    { key: 'linkedin', value: 'LinkedIn' },
    { key: 'medium', value: 'Medium' },
    { key: 'meetup', value: 'Meetup' },
    { key: 'otta', value: 'Otta' },
    { key: 'reddit', value: 'Reddit' },
    { key: 'simplify', value: 'Simplify' },
    { key: 'slack', value: 'Slack' },
    { key: 'stack-overflow', value: 'Stack Overflow' },
    { key: 'techmeme', value: 'Techmeme' },
    { key: 'twitter', value: 'Twitter' },
    { key: 'youtube', value: 'YouTube' },
  ],
};

export const defaultUTMMedium: UtmObj = {
  showName: false,
  label: 'Referral Type',
  tooltip:
    "What kind of referral link is this? This is usually how you're distributing the link.",
  error: 'Please choose a valid referral type',
  ariaLabel: 'Referral Type',
  value: [
    { key: 'cpc', value: 'Cost Per Click' },
    { key: 'direct', value: 'Direct' },
    { key: 'display', value: 'Display' },
    { key: 'email', value: 'Email' },
    { key: 'event', value: 'Event' },
    { key: 'organic', value: 'Organic' },
    { key: 'paid-search', value: 'Paid Search' },
    { key: 'paid-social', value: 'Paid Social' },
    { key: 'qr', value: 'QR' },
    { key: 'referral', value: 'Referral' },
    { key: 'retargeting', value: 'Retargeting' },
    { key: 'social', value: 'Social' },
    { key: 'ppc', value: 'Pay Per Click' },
    { key: 'linq', value: 'Linq' },
  ],
};

export const defaultUTMSource: UtmObj = {
  showName: false,
  label: 'Referral Source',
  tooltip: 'Where will you be posting this link?',
  error: 'Please enter a valid referral source',
  ariaLabel: 'Referral Source',
  value: [{ key: '', value: '' }],
};

export const defaultUTMCampaign: UtmObj = {
  showName: false,
  label: 'Campaign',
  tooltip: 'Enter a campaign name',
  error: 'Please enter a valid campaign name',
  ariaLabel: 'Campaign Name',
  value: [{ key: '', value: '' }],
};

export const defaultUTMParams: UtmParams = {
  restrict_bases: true,
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

export type LinkData = {
  longLink: string;
  shortLink: string;
  uuid: string;
  teamName: string;
  regionName: string;
  campaign: string;
  source: string;
  medium: string;
  term: string;
  target: string;
  base: string;
  countryName: string;
  date: string;
};

export type QRSettings = {
  QRProps: IProps;
  QRType: string;
};

export const DefaultQRStyle: IProps = {
  value: 'https://www.example.com/',
  ecLevel: 'H',
  size: 220,
  quietZone: 0,
  enableCORS: true,
  bgColor: '#FFFFFF',
  fgColor: 'rgba(11, 38, 62, 1)',
  logoImage: '',
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
};

export const defaultQRSettings: QRSettings = {
  QRProps: DefaultQRStyle,
  QRType: 'png',
};
