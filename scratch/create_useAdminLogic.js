const fs = require('fs');

const adminJs = fs.readFileSync('scratch/old_code/admin/admin.js', 'utf8');

const code = `import { useEffect } from 'react';

export function useAdminLogic() {
  useEffect(() => {
    let rafId = null;

    // --- PASTE VANILLA LOGIC ---
    ${adminJs}
    // --- END VANILLA LOGIC ---

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}
`;

fs.writeFileSync('frontend/src/admin/hooks/useAdminLogic.js', code);
console.log("useAdminLogic.js created!");
