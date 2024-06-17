import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { ListItem } from './ListItem';
import api from '../api/timestamp';
import { Timestamp } from '../types/timestamp';
import { timestampStore } from '../stores/timestamp';
import { observer } from 'mobx-react';

const Container = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  let {
    currentTimestampIndex,
    displayedItems,
    setCurrentTimestampIndex,
    selectedItem,
    setSelectedItem,
    timeUpdateRAFId,
    timestamps,
    setTimestamps,
  } = timestampStore;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    api.getTimestamps().then((result) => sortListItems(result));

    if (canvasRef.current && videoRef.current) {
      canvasRef.current.width = videoRef.current.clientWidth;
      canvasRef.current.height = videoRef.current.clientHeight;
    }
  }, []);

  const sortListItems = (items: Timestamp[]) => {
    const sortedItems = items.sort((item1, item2) => {
      return item1.timestamp - item2.timestamp;
    });
    setTimestamps(sortedItems);
  };

  const handleOnCanvasClick = () => {
    if (videoRef?.current) {
      if (isPlaying) {
        stopTimeUpdateLoop();
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleListItemClick = (item: Timestamp) => {
    const findedIndex = timestamps?.findIndex((tmstmp) => tmstmp.timestamp === item.timestamp);
    if (findedIndex || findedIndex === 0) {
      setCurrentTimestampIndex(findedIndex);
    } else {
      setCurrentTimestampIndex(0);
    }

    setSelectedItem(item);
    if (videoRef?.current) {
      videoRef.current.currentTime = item.timestamp;
    }
  };

  const handleTimeUpdate = async () => {
    timeUpdateRAFId = window.requestAnimationFrame(handleTimeUpdate);
    console.log(timeUpdateRAFId, 'timeUpdateRAFId');

    if (canvasRef.current) {
      if (timestamps && videoRef?.current) {
        const currentTimestamp = timestamps[currentTimestampIndex];
        if (displayedItems.length > 0) {
          const item = displayedItems[0];

          if (item.timestamp + item.duration < videoRef.current.currentTime) {
            let ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx?.clearRect(
                item.zone.left - 1,
                item.zone.top - 1,
                item.zone.width + 2,
                item.zone.height + 2,
              );
            }
            displayedItems.shift();
          }
        }
        if (currentTimestamp.timestamp < videoRef.current.currentTime) {
          let ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.fillStyle = 'green';
            ctx?.fillRect(
              currentTimestamp.zone.left,
              currentTimestamp.zone.top,
              currentTimestamp.zone.width,
              currentTimestamp.zone.height,
            );
          }
          displayedItems.push(currentTimestamp);
          currentTimestampIndex += 1;
        }
      }
    }
  };

  const stopTimeUpdateLoop = () => {
    window.cancelAnimationFrame(timeUpdateRAFId);
  };

  return (
    <div className="container">
      <div className="column">
        <div>
          <video
            onPlay={handleTimeUpdate}
            onPause={stopTimeUpdateLoop}
            ref={videoRef}
            width="900"
            height="600"
            controls
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <canvas onClick={handleOnCanvasClick} ref={canvasRef} />
      </div>
      <div className="column">
        <ul>
          {timestamps?.map((item) => (
            <ListItem
              data={item}
              handleClick={handleListItemClick}
              isSelected={selectedItem?.timestamp === item.timestamp}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default observer(Container);
