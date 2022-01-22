/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 02:19:07
 * @LastEditTime : 2022-01-22 13:28:31
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\packages\horen\renderer\pages\library\index.tsx
 * @Description  :
 */
import { FileDC } from '../../data-center';
import React from 'react';
import styled from 'styled-components';
import { Track } from 'types';
import { AlbumModal } from './album-modal';
import { AlbumView } from './album-viewer';

export interface Album {
  name: string;
  children: Track[];
  [key: string]: any;
}

export interface LibraryProps {
  onAddTo?(t: Track[]): void;
}

const Library: React.FC<LibraryProps> = (props) => {
  const { onAddTo } = props;

  const [albums, setAlbums] = React.useState<Album[]>([]);
  const [album, setAlbum] = React.useState<Album>();

  const handleOpenAlbum = (a: Album) => {
    setAlbum(a);
  };

  const handleAddTo = (t: Track) => {
    if (onAddTo) onAddTo([t]);
  };

  const handleCloseAlbumModal = () => setAlbum(undefined);

  React.useEffect(() => {
    const p = 'D:\\Music\\周杰伦全集\\01 正式专辑\\01 2000.JAY';
    (async () => {
      const files = await FileDC.getList(p);

      const abs: Album[] = [
        {
          name: 'Uncategory',
          children: [],
        },
      ];

      console.log(files);

      for (let file of files) {
        const meta = await FileDC.get(file);
        const al = meta.album;

        const newTrack: Track = {
          ...meta,
          src: file,
          title: meta?.title || file.split('\\').pop(),
        };

        if (al) {
          // 遍历暂时存放专辑的列表与传入的专辑进行对比
          const exact = abs.filter((a) => a.name === al);
          // 如果暂存列表中有这个专辑名 就将这个 Track push 到第一个匹配的专辑
          if (exact.length) exact[0].children.push(newTrack);
          // 如有没有这个专辑名 则新建一个
          else abs.push({ name: al, children: [newTrack] });
        } else {
          // 如果专辑名为空 则传入 Uncategory 专辑
          abs[0].children.push(newTrack);
        }
      }

      setAlbums(abs);
    })();
  }, []);

  return (
    <MyLib className="component-library">
      <div className="header">
        <h1>Library</h1>
      </div>

      <div className="albums">
        {albums.length &&
          albums.map((value) => (
            <AlbumView
              album={value}
              onOpen={handleOpenAlbum}
              key={value.name}
            />
          ))}
      </div>

      {album && (
        <AlbumModal
          album={album}
          onAddTo={handleAddTo}
          onClose={handleCloseAlbumModal}
        />
      )}

      {album && <div className="mask"></div>}
    </MyLib>
  );
};

const MyLib = styled.div`
  padding: 32px 48px;
  height: 100%;
  overflow: auto;
  background-color: #313233;
  color: #f1f1f1;
  .albums {
    display: flex;
    flex-wrap: wrap;
    .album {
      display: inline-block;
      height: 272px;
      width: 192px;
      margin: 8px 16px 8px 0;
      cursor: pointer;
      img {
        width: 100%;
        height: calc(100% - 70px);
        object-fit: cover;
        border-radius: 4px;
      }
      .info {
        .name {
          color: #f1f1f1;
        }
        .artist {
          color: #aaa;
          font-size: 0.8rem;
          margin: 4px 0;
        }
      }
    }
  }
  .album-view {
    display: flex;
    flex-wrap: wrap;
    position: fixed;
    width: 620px;
    max-height: 480px;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -35%);
    padding: 0 32px 32px 32px;
    background-color: #313233;
    color: #aaa;
    box-shadow: 2px 2px 16px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    z-index: 9999;
    .album-close {
      width: 100%;
      padding: 16px 0;
      text-align: right;
      .close-button {
        display: inline-block;
        cursor: pointer;
        &:hover {
          color: #f1f1f1;
        }
      }
    }
    .album-children {
      width: calc(100% - 296px);
      max-height: 408px;
      margin: 0 64px 0 0;
      padding-right: 8px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      overflow-y: hidden;
      &:hover {
        overflow-y: auto;
      }
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: #4a4b4c;
      }
      .album-child {
        width: 100%;
        padding: 6px 8px 6px 0;
        cursor: pointer;
        text-align: left;
        display: flex;
        &:hover {
          background-color: #2a2b2c;
          .operator {
            visibility: visible;
          }
        }
        .title {
          display: flex;
          align-items: center;
          flex-grow: 1;
          &-order {
            width: 32px;
            text-align: right;
            padding: 0 16px 0 0;
          }
          &-text {
            width: calc(100% - 32px);
          }
        }
        .operator {
          font-size: 1.5rem;
          visibility: hidden;
        }
      }
    }
    .album-infos {
      width: 192px;
      line-height: 2;
      font-size: 0.9rem;
      .name {
        width: 100%;
        color: #f1f1f1;
        text-align: center;
        margin: 0 0 16px 0;
        font-size: 1.2rem;
        font-weight: 500;
      }
      .cover img {
        width: 192px;
        height: 192px;
        object-fit: cover;
        border-radius: 4px;
      }
      .count,
      .artists,
      .date,
      .path {
        span {
          display: inline-block;
          margin-right: 8px;
          width: 60px;
          text-align: right;
          color: #bfbfbf;
        }
      }
      .count {
        margin: 4px 0;
        color: #ccc;
        text-align: center;
      }
      .path {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
`;

export default Library;
