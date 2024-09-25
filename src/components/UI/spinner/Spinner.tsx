import React, { useEffect, useMemo, useRef } from 'react';
import { Spinner as SpinJsSpinner } from 'spin.js';
import 'spin.js/spin.css';

interface SpinnerProps {
  isLoading: boolean;
}

const SpinnerComponent: React.FC<SpinnerProps> = ({ isLoading }) => {
  const spinnerRef = useRef<SpinJsSpinner | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  const opts = useMemo(() => ({
    lines: 8,
    length: 12,
    width: 4,
    scale: 0.55,
  }), []);

  useEffect(() => {
    if (isLoading) {
      const target = divRef.current;
      if (target) {
        const spinner = new SpinJsSpinner(opts).spin(target);

        spinnerRef.current = spinner;
      }
    } else {
      const spinner = spinnerRef.current;
      if (spinner) {
        spinner.stop();
      }
    }
  }, [isLoading, opts]);

  return <div ref={divRef} style={{  position: 'relative' }} />;
};

export default SpinnerComponent;
