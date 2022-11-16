import { useEffect, useRef, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';

import { InertiaPlugin } from '../../gsap-bonus/InertiaPlugin';

const Timeline = memo(({ entries, callback, startingIndex }) => {
  const svgRef = useRef(null);
  const markerContainerRef = useRef(null);

  const SPACER = 40;
  const MARKER_WIDTH = 4;
  const MARKER_MIN_HEIGHT = 20;
  const MARKER_MIN_ALPHA = 0.3;

  const MIN_DRAG_X = -(entries.length - 1) * SPACER;
  const VIEWBOX_WIDTH = SPACER * entries.length;
  const VIEWBOX_HEIGHT = 120;

  const SIZE_WIDTH = VIEWBOX_WIDTH;
  const SIZE_HEIGHT = VIEWBOX_HEIGHT;

  const markerRefs = [];

  const [isMounted, setIsMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [snapArray, setSnapArray] = useState([]);

  const [mtl, setMtl] = useState({
    timeline: gsap.timeline({ paused: true, smoothChildTiming: true })
  });

  // This is a "hacky" work-around because _x is updated on each animation tick.
  // _x is needed by handleAnimationComplete to determine the current entry id and title

  let _x = 0;

  const handleAnimationStart = () => {
    if (isMounted) {
      setIsAnimating(true);
      callback(null, null);
    }
  };

  const handleDragSlider = () => {
    if (isMounted) {
      _x = gsap.getProperty(markerContainerRef.current, 'x');
      gsap.to(mtl.timeline, {
        duration: 0.5,
        time: (_x / MIN_DRAG_X) * (mtl.timeline.duration() - 2) + 1,
        ease: 'elastic(2, 0.75)'
      });
    }
  };

  const handleAnimationComplete = () => {
    const entry = entries[Math.abs(Math.abs(_x / SPACER))];
    if (isMounted) {
      setIsAnimating(false);
      callback(entry.id, entry.title);
    }
  };

  const handleAnimation = (index) => {
    if (!isAnimating) {
      gsap.to(markerContainerRef.current, {
        duration: 2,
        x: snapArray[index],
        onStart: handleAnimationStart,
        onUpdate: handleDragSlider,
        onComplete: handleAnimationComplete,
        ease: 'elastic(1, 0.88)'
      });
    }
  };

  useEffect(() => {
    gsap.registerPlugin(Draggable, InertiaPlugin);

    entries.map((_, index) => {
      setSnapArray((snapArray) => [...snapArray, -index * SPACER]);

      setMtl({
        timeline: mtl.timeline.add(
          gsap
            .timeline()
            .to(markerRefs[index], {
              duration: 1,
              height: VIEWBOX_HEIGHT,
              alpha: 1
            })
            .to(markerRefs[index], {
              duration: 1,
              height: MARKER_MIN_HEIGHT,
              alpha: MARKER_MIN_ALPHA
            }),
          index
        )
      });
    });
    setIsMounted(true);
    setIsAnimating(false);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      const dragInstance = Draggable.create(markerContainerRef.current, {
        type: 'x',
        bounds: {
          minX: MIN_DRAG_X,
          maxX: 0,
          minY: 0,
          maxY: 0
        },
        onStart: handleAnimationStart,
        onDrag: handleDragSlider,
        onDragStart: handleAnimationStart,
        onThrowUpdate: handleDragSlider,
        onThrowComplete: handleAnimationComplete,
        inertia: true,
        minDuration: 1,
        snap: snapArray,
        overshootTolerance: 0,
        dragClickables: true
      })[0];

      handleAnimation(startingIndex);
    }
  }, [isMounted]);

  return (
    <svg ref={svgRef} width={SIZE_WIDTH} height={SIZE_HEIGHT} viewBox={`0,0, ${VIEWBOX_WIDTH},${VIEWBOX_HEIGHT}`}>
      <g transform={`matrix(1,0,0,1,${VIEWBOX_WIDTH / 2} 0)`}>
        <g ref={markerContainerRef}>
          <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} y={0} className="cursor-move" />
          {entries.map((entry, index) => {
            const { weekend } = entry;
            return (
              <g key={index}>
                <rect
                  ref={(ref) => {
                    markerRefs.push(ref);
                  }}
                  x={index * SPACER}
                  opacity={MARKER_MIN_ALPHA}
                  width={MARKER_WIDTH}
                  height={MARKER_MIN_HEIGHT}
                  className={`${weekend ? 'fill-secondary' : 'fill-primary'} cursor-move`}
                />
              </g>
            );
          })}
        </g>
      </g>
    </svg>
  );
});

Timeline.propTypes = {
  /** The diary entries */
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      weekend: PropTypes.oneOfType([PropTypes.bool, PropTypes.instanceOf(undefined)])
    })
  ),
  /** Callback when animation is complete */
  callback: PropTypes.func.isRequired,
  /** The marker to highlight by default */
  startingIndex: PropTypes.number
};

export default Timeline;
