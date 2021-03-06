/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-28 18:20:34
 * @LastEditTime : 2022-02-01 17:42:18
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\play-show\index.tsx
 * @Description  :
 */
import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { LyricScript, Track } from 'types';
import TrackInfo from './track-info';
import { ANIMATION_DELAY } from 'constant';
import { LyricPanel } from '@/components/lyric-panel';
import { TrackDC } from "@/data-center";
import defaultCover from "@/static/image/default-cover";

interface Props {
  visible: boolean;
  onClose(): void;
  currentTrack: Track;
  seek: number;
}

export default function PlayShow(props: Props) {
  const { visible, onClose, currentTrack, seek } = props;

  /**
   * current track lyric
   */
  const [lyrics, setLyrics] = React.useState<LyricScript[]>([]);
  const [cover, setCover] = React.useState<string>();
  const [isMounting, setIsMounting] = React.useState(true);
  const [ani, setAni] = React.useState('hidden');

  const cls = ['play-show', `ani-${ani}`, 'electron-no-drag'];

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  React.useEffect(() => {
    if (visible) {
      if (isMounting) setAni('hidden');
      else setAni('slideInDown');
    } else {
      if (isMounting) setAni('hidden');
      else setAni('slideOutDown');
    }
  }, [visible]);

  React.useEffect(() => {
    const timer = setTimeout(
      () => setIsMounting(false),
      ANIMATION_DELAY.normal * 2
    );
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (currentTrack) {
      (async () => {
        const { src = '' } = currentTrack;
        const lrcs = await TrackDC.lyric(src);
        if (lrcs.code === 1) setLyrics(lrcs.data);
        else setLyrics([]);
      })();

      const key = currentTrack.albumKey;
      if (key) {
        (async () => {
          const co = await TrackDC.getAlbumCover(key);
          const c = co.code === 1 ? co.data : currentTrack.picture || defaultCover;
          setCover(c);
        })()
      } else {
        setCover(defaultCover);
      }
    } else {
      setCover(defaultCover);
    }
  }, [currentTrack]);

  return ReactDOM.createPortal(
    <MyPlayShow className={cls.join(' ')}>
      <div className="header electron-no-drag">
        <div
          onClick={handleClose}
          role="button"
          className="close electron-no-drag"
        >
          ???
        </div>
      </div>
      <div className="left electron-no-drag">
        <TrackInfo track={currentTrack} cover={cover} />
      </div>
      <div className="right">
        <div className="lyric">
          <LyricPanel lyrics={lyrics} seek={seek || 0} />
        </div>
      </div>
    </MyPlayShow>,
    document.getElementById('root') || document.body
  );
}

const MyPlayShow = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  padding: 0 0 64px 0;
  background-color: #313233;
  display: flex;
  z-index: 998;
  flex-wrap: wrap;
  border-radius: 8px;
  &.ani-hidden {
    display: none;
  }
  &.ani-slideInDown {
    animation: slide-in-down ${ANIMATION_DELAY.normal / 1000}s;
    animation-fill-mode: forwards;
  }
  &.ani-slideOutDown {
    animation: slide-out-down ${ANIMATION_DELAY.normal / 1000}s;
    animation-fill-mode: forwards;
  }
  .header {
    width: 100%;
    height: 32px;
    .close {
      display: inline-block;
      font-size: 1.5rem;
      font-weight: 600;
      color: #717273;
      cursor: pointer;
      margin: 8px 0 0 12px;
      &:hover {
        color: #a1a2a3;
      }
    }
  }
  .left {
    width: 50%;
    height: calc(100% - 44px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    width: 50%;
    height: calc(100% - 32px);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c1c2c3;
    padding: 0;
    .lyric {
      height: calc(100% - 128px);
      overflow-y: auto;
      text-align: center;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  @keyframes slide-in-down {
    from {
      transform: translate3d(0, 100%, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes slide-out-down {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, 100%, 0);
    }
  }
`;
