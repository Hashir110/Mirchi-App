-- Menu Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  location TEXT NOT NULL,
  order_type TEXT DEFAULT 'Delivery',
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  total DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "categories_select" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "categories_insert" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "categories_update" ON categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "categories_delete" ON categories FOR DELETE TO authenticated USING (true);

-- RLS Policies for menu_items (public read)
CREATE POLICY "menu_items_select" ON menu_items FOR SELECT TO public USING (true);
CREATE POLICY "menu_items_insert" ON menu_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "menu_items_update" ON menu_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "menu_items_delete" ON menu_items FOR DELETE TO authenticated USING (true);

-- RLS Policies for orders (authenticated CRUD)
CREATE POLICY "orders_select" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "orders_insert" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "orders_update" ON orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "orders_delete" ON orders FOR DELETE TO authenticated USING (true);

-- RLS Policies for order_items (authenticated CRUD)
CREATE POLICY "order_items_select" ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "order_items_update" ON order_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "order_items_delete" ON order_items FOR DELETE TO authenticated USING (true);

-- Seed Categories
INSERT INTO categories (name, slug, icon, description, sort_order) VALUES
('Pizza', 'pizza', 'pizza', 'Wood-fired artisan pizzas', 1),
('Pasta', 'pasta', 'utensils', 'Creamy Italian pasta dishes', 2),
('BBQ', 'bbq', 'flame', 'Smoky grilled BBQ specialties', 3),
('Fast Food', 'fast-food', 'zap', 'Quick bites & burgers', 4),
('Desi', 'desi', 'chef-hat', 'Authentic South Asian cuisine', 5);

-- Seed Menu Items - Pizza
INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) VALUES
((SELECT id FROM categories WHERE slug = 'pizza'), 'Fajita Pizza', 'Spicy fajita chicken with bell peppers and onions', 1299.00, 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'pizza'), 'Tikka Pizza', 'Classic chicken tikka with aromatic spices', 1199.00, 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'pizza'), 'Pepperoni Pizza', 'Loaded with premium pepperoni slices', 1399.00, 'https://images.pexels.com/photos/11467291/pexels-photo-11467291.jpeg?auto=compress&cs=tinysrgb&w=400', false),
((SELECT id FROM categories WHERE slug = 'pizza'), 'BBQ Chicken Pizza', 'BBQ sauce base with grilled chicken', 1349.00, 'https://images.pexels.com/photos/2232433/pexels-photo-2232433.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'pizza'), 'Supreme Pizza', 'All toppings - meat lovers delight', 1599.00, 'https://images.pexels.com/photos/16068713/pexels-photo-16068713.jpeg?auto=compress&cs=tinysrgb&w=400', false);

-- Seed Menu Items - Pasta
INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) VALUES
((SELECT id FROM categories WHERE slug = 'pasta'), 'Creamy Alfredo', 'Rich white sauce pasta with parmesan', 899.00, 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'pasta'), 'Spicy Arrabiata', 'Red sauce pasta with chili flakes', 799.00, 'https://images.pexels.com/photos/12720664/pexels-photo-12720664.jpeg?auto=compress&cs=tinysrgb&w=400', false),
((SELECT id FROM categories WHERE slug = 'pasta'), 'Chicken Carbonara', 'Creamy sauce with bacon and chicken', 1099.00, 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'pasta'), 'Seafood Pasta', 'Shrimp and calamari in garlic sauce', 1299.00, 'https://images.pexels.com/photos/9215460/pexels-photo-9215460.jpeg?auto=compress&cs=tinysrgb&w=400', false);

-- Seed Menu Items - BBQ
INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) VALUES
((SELECT id FROM categories WHERE slug = 'bbq'), 'Mixed Grill Platter', 'Assorted grilled meats for 2', 2499.00, 'https://images.pexels.com/photos/7649174/pexels-photo-7649174.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'bbq'), 'BBQ Chicken Wings', '12 pieces of smoky wings', 999.00, 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'bbq'), 'Seekh Kebab', 'Minced beef skewers - 6 pieces', 1199.00, 'https://images.pexels.com/photos/7649174/pexels-photo-7649174.jpeg?auto=compress&cs=tinysrgb&w=400', false),
((SELECT id FROM categories WHERE slug = 'bbq'), 'Lamb Chops', 'Herb-crusted grilled lamb', 1599.00, 'https://images.pexels.com/photos/4750253/pexels-photo-4750253.jpeg?auto=compress&cs=tinysrgb&w=400', true);

-- Seed Menu Items - Fast Food
INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) VALUES
((SELECT id FROM categories WHERE slug = 'fast-food'), 'Zinger Burger', 'Crispy chicken with special sauce', 699.00, 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'fast-food'), 'Beef Burger', 'Premium beef patty with cheese', 799.00, 'https://images.pexels.com/photos/2274657/pexels-photo-2274657.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'fast-food'), 'Loaded Fries', 'Cheese and bacon topped fries', 499.00, 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400', false),
((SELECT id FROM categories WHERE slug = 'fast-food'), 'Chicken Nuggets', 'Crispy nuggets - 12 pieces', 549.00, 'https://images.pexels.com/photos/2274657/pexels-photo-2274657.jpeg?auto=compress&cs=tinysrgb&w=400', true);

-- Seed Menu Items - Desi
INSERT INTO menu_items (category_id, name, description, price, image_url, is_popular) VALUES
((SELECT id FROM categories WHERE slug = 'desi'), 'Chicken Biryani', 'Aromatic rice with spiced chicken', 899.00, 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'desi'), 'Butter Chicken', 'Creamy tomato-based curry', 999.00, 'https://images.pexels.com/photos/4750253/pexels-photo-4750253.jpeg?auto=compress&cs=tinysrgb&w=400', true),
((SELECT id FROM categories WHERE slug = 'desi'), 'Nihari', 'Slow-cooked beef stew', 1099.00, 'https://images.pexels.com/photos/7649174/pexels-photo-7649174.jpeg?auto=compress&cs=tinysrgb&w=400', false),
((SELECT id FROM categories WHERE slug = 'desi'), 'Karahi Gosht', 'Wok-cooked lamb curry', 1199.00, 'https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=400', true);

-- Indexes for performance
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);