const fs = require('fs');

const jsCode = fs.readFileSync('scratch/old_code/user/script.js', 'utf8');

const hookCode = `import { useEffect } from 'react';

export function useStorefrontLogic() {
  useEffect(() => {
    // --- PASTE VANILLA LOGIC ---
    ${jsCode}
    // --- END VANILLA LOGIC ---

    let cleanup = null;
    const timerId = setTimeout(() => {
      if (typeof boot === 'function') {
        cleanup = boot();
      }
    }, 100);

    return () => {
      clearTimeout(timerId);
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, []);
}
`;

fs.writeFileSync('frontend/src/user/hooks/useStorefrontLogic.js', hookCode);
console.log("Updated useStorefrontLogic.js with full JS!");
