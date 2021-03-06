/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 16:24:28
 * @LastEditTime : 2022-02-01 17:23:09
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\play-queue\index.tsx
 * @Description  : 右侧滑出的歌曲列表
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Track } from 'types';
import Queue from './queue';
import Mask from '../mask';
import { ANIMATION_DELAY, THEME } from 'constant';
import { player } from "@/App";
import {useSetRecoilState} from "recoil";
import {tracksInQueueState} from "@/store";

export interface PlayQueueProps {
  visible: boolean;
  onClose(): void;
}

export function PlayQueue(props: PlayQueueProps) {
  const { visible, onClose } = props;

  const [isMounting, setIsMounting] = React.useState(true);
  const [animation, setAnimation] = React.useState('');

  const setTracksInQueue = useSetRecoilState(tracksInQueueState);

  const classnames = [
    'electron-no-drag',
    'component-playlist',
    `animation-${animation}`,
  ];

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setAnimation('slideOutRight');
    onClose();
  };

  /**
   * empty the track list, both player's trackList and track in queue
   */
  const handleEmptyTrackList = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    player.trackList = [];
    setTracksInQueue([]);
  }

  React.useEffect(() => {
    if (visible) {
      if (isMounting) setAnimation('hidden');
      else setAnimation('slideInRight');
    } else {
      if (isMounting) setAnimation('hidden');
      else setAnimation('slideOutRight');
    }
  }, [visible]);

  React.useEffect(() => {
    const timer = setTimeout(
      () => setIsMounting(false),
      ANIMATION_DELAY.normal * 2
    );
    return () => clearTimeout(timer);
  }, []);

  return ReactDOM.createPortal(
    <MyPlayQueue className={classnames.join(' ')}>
      <div className="header">
        <div className="title">
          <span>播放队列</span>
          <span role="button" className="empty" onClick={handleEmptyTrackList}>清空列表</span>
        </div>
        <div className="count">{player.trackList?.length} 首歌曲</div>
      </div>
      <Queue
        track={player.currentTrack}
        tracks={player.trackList}
        onPlay={(track) => player.currentTrack = track}
        onDelete={(track) => player.trackList = delTrack(player.trackList, track)}
      />
      <div className="bottom">
        <div className="close" role="button" onClick={handleClose}>
          <span>收起队列</span>
        </div>
      </div>
      {visible && <Mask onClick={handleClose} depth={999999} />}
    </MyPlayQueue>,
    document.getElementById('root') || document.body
  );
}

function delTrack(ts: Track[], track: Track) {
  const tracks = [];
  for (let i = 0; i < ts.length; i++) {
    if (ts[i].src !== track.src) tracks.push(ts[i]);
  }
  return tracks;
}

const MyPlayQueue = styled.div`
  width: 340px;
  height: 100vh;
  padding: 32px 0 0 0;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999999;
  background-color: #414243;
  color: #f1f1f1;
  &.animation-slideOutRight {
    animation: slideOutRight ${ANIMATION_DELAY.normal / 1000}s;
    animation-fill-mode: forwards;
  }
  &.animation-slideInRight {
    animation: slideInRight ${ANIMATION_DELAY.normal / 1000}s;
    animation-fill-mode: forwards;
  }
  &.animation-hidden {
    display: none;
  }
  .header {
    font-size: 1.3rem;
    padding: 0 32px;
    .title {
      .empty {
        margin: 0 8px;
        padding: 4px 8px;
        font-size: 0.8rem;
        cursor: pointer;
        background-color: #333;
        border-radius: 4px;
      }
    }
    .count {
      font-size: 0.8rem;
      padding: 8px 0;
      color: #777879;
    }
  }
  .queue {
    padding: 16px 0;
    height: calc(100vh - 170px);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: #666;
    }
    .queue-item {
      padding: 8px 16px 8px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      overflow-x: hidden;
      transition: all .25s ease-in-out;
      &:hover {
        background-color: #555;
        .delete {
          visibility: visible;
        }
      }
      .delete {
        margin-right: 4px;
        color: ${THEME.color.error};
        visibility: hidden;
      }
      .no {
        width: 28px;
        margin: 0 8px 0 0;
        text-align: center;
      }
      .info {
        flex-grow: 1;
        .title {
          &-text {
            font-size: 1rem;
          }
        }
        .artist {
          font-size: 0.8rem;
          color: #999;
          margin-top: 4px;
        }
      }
      .indicator {
        margin: 0 16px 0 0;
      }
      .duration {
        font-weight: 200;
        color: #999;
      }
    }
  }
  .bottom {
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 76px;
    padding: 0;
    background-color: #414243;
    .close {
      height: 100%;
      text-align: center;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      &:hover {
        background-color: #515253;
      }
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(100%, 0, 0);
    }
  }
  @keyframes slideInRight {
    from {
      transform: translate3d(100%, 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
`;
