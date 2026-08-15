import re
from bs4 import BeautifulSoup
import os

with open('scratch/old_code/user/index.html', 'r') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

def convert_to_jsx(tag):
    # Convert tag to string
    html_str = str(tag)
    
    # Basic replacements
    html_str = html_str.replace('class=', 'className=')
    html_str = html_str.replace('for=', 'htmlFor=')
    html_str = re.sub(r'<!--([\s\S]*?)-->', r'{/* \1 */}', html_str)
    
    # Close unclosed tags
    html_str = re.sub(r'<(img|input|br|hr|meta|link)([^>]*?)(?<!/)>', r'<\1\2 />', html_str)
    
    # Handle style attribute
    def replace_style(match):
        styles = match.group(1).split(';')
        style_obj = []
        for s in styles:
            if not s.strip(): continue
            if ':' not in s: continue
            k, v = s.split(':', 1)
            k = k.strip()
            # to camelCase
            parts = k.split('-')
            k_camel = parts[0] + ''.join(x.title() for x in parts[1:])
            style_obj.append(f"{k_camel}: '{v.strip()}'")
        return f"style={{{{{', '.join(style_obj)}}}}}"
    
    html_str = re.sub(r'style="([^"]*)"', replace_style, html_str)
    
    # Remove inline event handlers
    html_str = re.sub(r'onclick="[^"]*"', 'onClick={() => {}}', html_str)
    html_str = re.sub(r'onchange="[^"]*"', 'onChange={() => {}}', html_str)
    
    return html_str

# Header Component: Includes the ann-pop and nav
ann_pop = soup.find(id='annPop')
nav = soup.find(id='mainNav')
header_jsx = f"{convert_to_jsx(ann_pop)}\n{convert_to_jsx(nav)}"

header_code = f"""import React from 'react';
import {{ useCartStore }} from '../../store/useCartStore';

export default function Header() {{
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const openCart = () => {{
    window.dispatchEvent(new Event('openCart'));
  }};

  return (
    <>
      {header_jsx.replace('<button className="nav-cart"', '<button className="nav-cart" onClick={openCart}')}
    </>
  );
}}
"""
with open('frontend/src/user/components/Header.jsx', 'w') as f:
    f.write(header_code)

# Hero Component: section id="home"
hero = soup.find(id='home')
hero_code = f"""import React from 'react';

export default function Hero() {{
  return (
    <>
      {convert_to_jsx(hero)}
    </>
  );
}}
"""
with open('frontend/src/user/components/Hero.jsx', 'w') as f:
    f.write(hero_code)

# How It Works & Story Components
process = soup.find(id='how-it-works')
story = soup.find(id='story')
process_code = f"""import React from 'react';

export default function Process() {{
  return (
    <>
      {convert_to_jsx(process)}
      {convert_to_jsx(story)}
    </>
  );
}}
"""
with open('frontend/src/user/components/Process.jsx', 'w') as f:
    f.write(process_code)

# Footer Component
footer = soup.find('footer')
footer_code = f"""import React from 'react';

export default function Footer() {{
  return (
    <>
      {convert_to_jsx(footer)}
    </>
  );
}}
"""
with open('frontend/src/user/components/Footer.jsx', 'w') as f:
    f.write(footer_code)

# ProductGrid Component
shop = soup.find(id='shop')
# In ProductGrid, we want to map the products.
# Let's just grab the shell of the shop section.
product_grid_code = f"""import React from 'react';
import {{ useProducts }} from '../../hooks/useProducts';
import {{ useCartStore }} from '../../store/useCartStore';

export default function ProductGrid() {{
  const {{ data: response, isLoading }} = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const products = response?.data || [];

  return (
    <section className="shop-section" id="shop">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-badge">Our Products</span>
          <h2 className="section-title">Premium Vehicle Care Lineup</h2>
          <p className="section-desc">Formulated for perfection, trusted by professionals.</p>
        </div>
        
        {{isLoading ? (
          <div className="text-center py-5">Loading products...</div>
        ) : (
          <div className="row g-4" id="productGrid">
            {{products.map(product => (
              <div className="col-lg-3 col-md-6" key={{product._id}}>
                <div className="product-card">
                  {{product.badge && <span className="product-badge">{{product.badge}}</span>}}
                  <div className="product-img-wrapper">
                    <img src={{product.image || "/assets/placeholder.png"}} alt={{product.name}} className="product-img" />
                    <div className="product-actions">
                      <button className="action-btn" aria-label="Quick view"><i className="bi bi-eye"></i></button>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{{product.category}}</div>
                    <h3 className="product-title">{{product.name}}</h3>
                    <div className="product-rating">
                      <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-half"></i>
                      <span className="rating-count">(4.8)</span>
                    </div>
                    <div className="product-bottom">
                      <div className="product-price">₹{{product.price}}</div>
                      <button className="add-to-cart-btn" onClick={{() => addItem(product)}}>Add <i className="bi bi-plus-lg"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}}
          </div>
        )}}
      </div>
    </section>
  );
}}
"""
with open('frontend/src/user/components/ProductGrid.jsx', 'w') as f:
    f.write(product_grid_code)

# Cart Drawer
cart_code = f"""import React, {{ useState, useEffect }} from 'react';
import {{ useCartStore }} from '../../store/useCartStore';

export default function CartDrawer() {{
  const [isOpen, setIsOpen] = useState(false);
  const {{ items, updateQty, removeItem, getCartTotal }} = useCartStore();

  useEffect(() => {{
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openCart', handleOpen);
    return () => window.removeEventListener('openCart', handleOpen);
  }}, []);

  return (
    <>
      <div className={{`cart-overlay ${{isOpen ? 'active' : ''}}`}} onClick={{() => setIsOpen(false)}}></div>
      <div className={{`cart-panel ${{isOpen ? 'active' : ''}}`}}>
        <div className="cart-header">
          <h4 className="cart-title">Your Cart</h4>
          <button className="cart-close" onClick={{() => setIsOpen(false)}} aria-label="Close cart">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="cart-body">
          {{items.length === 0 ? (
            <div className="empty-cart-state">
              <i className="bi bi-cart-x"></i>
              <p>Your cart is empty.</p>
              <button className="btn btn-primary mt-3" onClick={{() => setIsOpen(false)}}>Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-items-container">
              {{items.map(item => (
                <div className="cart-item" key={{item.id}}>
                  <img src={{item.image || "/assets/placeholder.png"}} alt={{item.name}} className="cart-item-img" />
                  <div className="cart-item-info">
                    <h5 className="cart-item-title">{{item.name}}</h5>
                    <div className="cart-item-price">₹{{item.price}}</div>
                    <div className="cart-item-controls">
                      <div className="qty-selector">
                        <button className="qty-btn minus" onClick={{() => updateQty(item.id, item.qty - 1)}}>-</button>
                        <span className="qty-input">{{item.qty}}</span>
                        <button className="qty-btn plus" onClick={{() => updateQty(item.id, item.qty + 1)}}>+</button>
                      </div>
                      <button className="item-remove" onClick={{() => removeItem(item.id)}}><i className="bi bi-trash"></i></button>
                    </div>
                  </div>
                </div>
              ))}}
            </div>
          )}}
        </div>
        
        {{items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{{getCartTotal()}}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <button className="btn btn-primary w-100 checkout-btn">
              Proceed to Checkout
            </button>
          </div>
        )}}
      </div>
    </>
  );
}}
"""
with open('frontend/src/user/components/CartDrawer.jsx', 'w') as f:
    f.write(cart_code)

print("Extracted components successfully!")
