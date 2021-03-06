/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-22 12:32:21
 * @LastEditTime : 2022-02-01 17:52:02
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\pages\library\album-modal.tsx
 * @Description  :
 */
import React from 'react';
import { Track, Album } from 'types';
import { isInTracks } from './index';
import { findTitleFromKey } from "./index";

interface Props {
  /**
   * 专辑
   */
  album: Album;
  cover?: string;
  /**
   * 点击关闭专辑预览
   */
  onClose(): void;
  
  /**
   * 挑选一个或多个 track
   * @param tracks
   * @param mode 添加到队列或切歌
   */
  onPick(tracks: Track[], mode: 'add' | 'cut'): void;
  
  /**
   * 播放队列
   */
  tracksInQueue: Track[];
  
  /**
   * 正在播放的 track
   */
  currentTrack?: Track;
}

export function AlbumModal(props: Props) {
  const { album, cover, onClose, onPick, tracksInQueue, currentTrack } = props;

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  const handleAddTo = (e: React.MouseEvent<HTMLSpanElement>, ts?: Track[]) => {
    e.preventDefault();
    e.stopPropagation();
    if (ts) onPick([...ts], 'add');
  };

  const renderItem = (item: Track, index: number) => {
    const isPlaying = currentTrack?.src === item.src;

    let child = (
      <span
        className="add-to"
        onClick={(e) => handleAddTo(e, [item])}
        title="添加到播放列表"
      >
        ✚
      </span>
    );
  
    if (isInTracks(tracksInQueue, item)) {
      child = <span title="已经在播放列表中">✔</span>;
    }
  
    if (isPlaying) {
      child = <span title="正在播放中">♫</span>;
    }

    return (
      <div
        className="album-child"
        key={item?.uuid || index}
        data-title={item.title}
        data-key={item?.uuid || index}
      >
        <div
          className="title"
          style={{ color: isPlaying ? '#1ece9d' : '#aaa' }}
        >
          <div className="title-order">{index + 1 + '.'}</div>
          <div className="title-text">
            <span
              onDoubleClick={(e) => {
                e.preventDefault();
                onPick([item], 'cut');
              }}
              role={'button'}
              title="双击插队播放歌曲"
            >
              {item.title}
            </span>
          </div>
        </div>
        <div className="operator">{child}</div>
      </div>
    );
  };

  return (
    <div className="album-modal-view electron-no-drag">
      <div className="album-header">
        <div className="add-all">
          {isAllTracksInQueue(album.children, tracksInQueue) ? (
            <span>✔ 已全部添加</span>
          ) : (
            <span
              role="button"
              onClick={(e) => {
                handleAddTo(e, album.children);
              }}
            >
              ✚ 全部添加
            </span>
          )}
        </div>
        <div className="close-button" role="button" onClick={handleClose}>
          ✕
        </div>
      </div>

      <div className="album-children">{album.children?.map(renderItem)}</div>

      <div className="album-infos">
        <div className="name">{findTitleFromKey(album.key)}</div>
        <div className="cover">
          <img
            src={`data:image/png;base64,${cover}`}
            alt={album.key}
          />
        </div>
        <div className="count">{album.children?.length} 首歌曲</div>
        <div className="date">
          <span>发行时间</span> {album.children ? album.children[0].date : ''}
        </div>
        <div className="artists">
          <span>艺术家</span> {album.children ? album.children[0].artist : ''}
        </div>
        <div className="path" title={album.children ? album.children[0].src : ''}>
          <span>专辑路径</span> {album.children ? album.children[0].src : ''}
        </div>
      </div>
    </div>
  );
}

function isAllTracksInQueue(albumTracks?: Track[], tracks?: Track[]) {
  let i = 0;
  if (tracks && albumTracks) {
    for (const track of tracks) {
      for (const child of albumTracks) {
        if (child.src === track.src) {
          i += 1;
        }
      }
    }
  }
  return i === albumTracks?.length;
}

