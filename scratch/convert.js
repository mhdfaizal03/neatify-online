const fs = require('fs');

function convertToJSX(html) {
  let jsx = html;
  
  // Basic replacements
  jsx = jsx.replace(/class=/g, 'className=');
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // Handle comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
  
  // Close unclosed tags
  jsx = jsx.replace(/<(img|input|br|hr|meta|link)([^>]*?)(?<!\/)>/g, '<$1$2 />');
  
  // Convert style="background-image: url('...');" to style={{ backgroundImage: "url('...')" }}
  jsx = jsx.replace(/style="([^"]*)"/g, (match, styleString) => {
    const styles = styleString.split(';').filter(s => s.trim());
    const styleObj = {};
    styles.forEach(s => {
      const [key, value] = s.split(':').map(str => str.trim());
      if (key && value) {
        const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
        styleObj[camelKey] = value;
      }
    });
    return `style={${JSON.stringify(styleObj)}}`;
  });
  
  // Convert onclick="function()" to onClick={() => function()}
  jsx = jsx.replace(/onclick="([^"]*)"/g, 'onClick={() => {}}');
  jsx = jsx.replace(/onchange="([^"]*)"/g, 'onChange={() => {}}');
  jsx = jsx.replace(/onsubmit="([^"]*)"/g, 'onSubmit={(e) => e.preventDefault()}');

  return jsx;
}

const userHtml = fs.readFileSync('scratch/old_code/user/index.html', 'utf8');
const bodyMatch = userHtml.match(/<body>([\s\S]*?)<\/body>/);
if (bodyMatch) {
  let bodyContent = bodyMatch[1];
  // Remove script tags at the end
  bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/g, '');
  
  const jsxContent = convertToJSX(bodyContent);
  
  const reactComponent = `import React from 'react';
import '../../user.css';

export default function Storefront() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;
  fs.writeFileSync('frontend/src/user/pages/Storefront.jsx', reactComponent);
  console.log("Converted Storefront");
}

const adminHtml = fs.readFileSync('scratch/old_code/admin/index.html', 'utf8');
const adminBodyMatch = adminHtml.match(/<body>([\s\S]*?)<\/body>/);
if (adminBodyMatch) {
  let adminBodyContent = adminBodyMatch[1];
  adminBodyContent = adminBodyContent.replace(/<script[\s\S]*?<\/script>/g, '');
  const adminJsxContent = convertToJSX(adminBodyContent);
  
  const adminReactComponent = `import React from 'react';
import '../../admin.css';

export default function Admin() {
  return (
    <>
      ${adminJsxContent}
    </>
  );
}
`;
  fs.writeFileSync('frontend/src/admin/pages/Admin.jsx', adminReactComponent);
  console.log("Converted Admin");
}

