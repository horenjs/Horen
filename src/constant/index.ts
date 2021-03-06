/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 01:51:07
 * @LastEditTime : 2022-05-07 23:40:00
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \Horen\src\constant\index.ts
 * @Description  :
 */
export { DEFAULT_SETTING } from './setting';
export { default as LANG } from './lang';
export { MINI_PLAYER_BOUNDS } from './window';
import { Page } from '../types';
import * as path from 'path';

/**
 * ipc 通信使用的信号字符
 */
const IPC_CODE = {
  track: {
    getTrackList: 'track:get-track-list',
    getAlbumList: 'track:get-album-list',
    getBySrc: 'track:get-by-uuid',
    getAlbumByKey: 'track:get-album-by-key',
    getAlbumCover: 'track:get-album-cover',
    rebuildCache: 'track:rebuild-list',
    msg: 'track:msg',
    lyric: 'track:lyric',
  },
  setting: {
    get: 'setting:get',
    set: 'setting:set',
  },
  dialog: {
    open: 'dialog:get',
  },
  playlist: {
    getList: 'playlist:get-list',
    set: 'playlist:set',
    get: 'playlist:get',
  },
  mainwindow: {
    close: 'mainwindow:close',
    minimize: 'mainwindow:mini',
    setTitle: 'mainwindow:set-title',
    setProgress: 'mainwindow:set-progress',
    setBounds: 'mainwindow:set-bounds',
    getBounds: 'mainwindow:get-bounds',
  },
};

/**
 * 用户目录
 */
const APP_DATA_PATH = process.env.APPDATA || '.';

/**
 * 应用名
 * todo: 应当从 package.json 读取
 */
const APP_NAME = 'horen';

const LOG_PATH = path.join(APP_DATA_PATH, APP_NAME, 'logs');
const COVER_PATH = path.join(APP_DATA_PATH, APP_NAME, 'Cache', 'cover');

/**
 * 可以解析的音频文件格式
 */
const AUDIO_EXTS = [
  'aiff',
  'aac',
  'ape',
  'asf',
  'dsdiff',
  'dsf',
  'flac',
  'mp2',
  'mka',
  'mkv',
  'mp3',
  'mpc',
  'mp4',
  'm4a',
  'm4v',
  'ogg',
  'opus',
  'speex',
  'theora',
  'vorbis',
  'wav',
  'webm',
  'wv',
  'wma',
];

/**
 * 页面
 */
const PAGES: Page[] = [
  {
    name: 'Library',
    path: '/library',
    title: '音乐库',
  },
  {
    name: 'setting',
    path: '/setting',
    title: '设置',
  },
];

/**
 * 动画持续时长
 */
const ANIMATION_DELAY = {
  slow: 500,
  normal: 250,
  fast: 100,
};

/**
 * colors
 */
const THEME = {
  color: {
    primary: '#4CAF50',
    primaryTint: '#81C784',
    error: '#F44336',
    warning: '#FFC107',
    success: '#4CAF50',
    backgroundColorDeep: '#212529',
    backgroundColor: '#313539',
    backgroundColorTint: '#515557',
    frontColorDeep: '#a1a2a3',
    frontColor: '#f1f5f9',
    frontColorTint: '#fff',
  },
};

const NETEASE_API_URL = {
  lrc: 'https://music.163.com/api/song/lyric',
  search: 'https://music.163.com/api/search/get/web',
};

export {
  IPC_CODE,
  APP_DATA_PATH,
  APP_NAME,
  LOG_PATH,
  COVER_PATH,
  AUDIO_EXTS,
  PAGES,
  ANIMATION_DELAY,
  THEME,
  NETEASE_API_URL as API_URL,
};
