import { motion } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

  const keyframes = {};
  keys.forEach(k => {
    keyframes[k] = [from[k], ...steps.map(s => s[k])];
  });
  return keyframes;
};

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = t => t,
  onAnimationComplete,
  onLoop,
  loop = false,
  stepDuration = 0.35
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const ref = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!loop) {
            observer.unobserve(ref.current);
          } else {
            // Reset animation when it comes back into view for looping
            setInView(false);
            setTimeout(() => setInView(true), 50);
          }
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin, loop]);
  
  // Handle loop animation
  useEffect(() => {
    if (!inView || !loop) return;
    
    // Calculate total animation duration
    const letterDuration = stepDuration * 1000; // Duration for each letter's animation
    const totalTypeTime = (text.length - 1) * delay; // Time for all letters to appear
    const totalAnimationTime = totalTypeTime + letterDuration; // Total time until last letter is fully visible
    const loopDelay = 2000; // 2 second delay after full text is shown
    
    let timeoutId;
    let intervalId;
    
    const startNextLoop = () => {
      // First, let the full animation complete
      timeoutId = setTimeout(() => {
        // Then wait for the loop delay
        const resetTimeoutId = setTimeout(() => {
          setInView(false);
          
          // Update loop count after animation completes
          setLoopCount(prev => {
            const newCount = prev + 1;
            onLoop?.(newCount);
            return newCount;
          });
          
          // Small delay before restarting animation
          setTimeout(() => setInView(true), 100);
        }, loopDelay);
        
        // Clean up this timeout if component unmounts
        return () => clearTimeout(resetTimeoutId);
      }, totalAnimationTime);
    };
    
    // Initial start
    startNextLoop();
    
    // Calculate total time for one complete cycle
    const totalCycleTime = totalAnimationTime + loopDelay + 200; // Added buffer time
    
    // Set up the interval for subsequent loops
    intervalId = setInterval(() => {
      setInView(false);
      setTimeout(() => setInView(true), 100);
      startNextLoop();
    }, totalCycleTime);
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [inView, loop, text, delay, stepDuration, onLoop]);

  const defaultFrom = useMemo(
    () =>
      direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
    [direction]
  );

  const defaultTo = useMemo(
    () => [
      {
        filter: 'blur(5px)',
        opacity: 0.5,
        y: direction === 'top' ? 5 : -5
      },
      { filter: 'blur(0px)', opacity: 1, y: 0 }
    ],
    [direction]
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;

  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * (stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {elements.map((segment, index) => {
        const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

        const spanTransition = {
          duration: totalDuration,
          times,
          delay: (index * delay) / 1000
        };
        spanTransition.ease = easing;

        return (
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            key={index}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={spanTransition}
            onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
          >
            {segment === ' ' ? '\u00A0' : segment}
            {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
          </motion.span>
        );
      })}
    </p>
  );
};

export default BlurText;
