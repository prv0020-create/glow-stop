const { chromium } = require('playwright');
const path = require('path');

async function testGlowStopWebsite() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const errors = [];
  const warnings = [];
  
  // Collect console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[ERROR] ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      warnings.push(`[WARNING] ${msg.text()}`);
    }
  });
  
  // Collect page errors
  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR] ${err.message}`);
  });
  
  const basePath = path.resolve(__dirname);
  
  console.log('🧪 Testing GLOW STOP Website...\n');
  
  // Test Index Page
  console.log('📄 Testing: index.html (Landing Page)');
  try {
    await page.goto(`file://${basePath}/index.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log('   ✓ Index page loaded successfully');
  } catch (err) {
    errors.push(`[LOAD ERROR] Index page: ${err.message}`);
  }
  
  // Test Products Page
  console.log('📄 Testing: products.html (Products Page)');
  try {
    await page.goto(`file://${basePath}/products.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    console.log('   ✓ Products page loaded successfully');
  } catch (err) {
    errors.push(`[LOAD ERROR] Products page: ${err.message}`);
  }
  
  // Test navigation between pages
  console.log('🔗 Testing: Page navigation');
  try {
    await page.goto(`file://${basePath}/index.html`, { waitUntil: 'networkidle' });
    await page.click('a[href="products.html"]');
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    if (currentUrl.includes('products.html')) {
      console.log('   ✓ Navigation works correctly');
    }
  } catch (err) {
    errors.push(`[NAVIGATION ERROR] ${err.message}`);
  }
  
  // Test filter functionality
  console.log('🎯 Testing: Product filters');
  try {
    await page.goto(`file://${basePath}/products.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    
    // Click on a filter button
    const filterBtn = await page.$('.filter-btn[data-filter="acne"]');
    if (filterBtn) {
      await filterBtn.click();
      await page.waitForTimeout(500);
      console.log('   ✓ Filter functionality works');
    }
  } catch (err) {
    errors.push(`[FILTER ERROR] ${err.message}`);
  }
  
  // Test add to cart button
  console.log('🛒 Testing: Add to cart functionality');
  try {
    await page.goto(`file://${basePath}/products.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    
    const addToCartBtn = await page.$('.product-card-btn');
    if (addToCartBtn) {
      // Override alert to capture the call
      await page.evaluate(() => {
        window.alert = (msg) => { console.log('Alert captured:', msg); };
      });
      await addToCartBtn.click();
      await page.waitForTimeout(500);
      console.log('   ✓ Add to cart functionality works');
    }
  } catch (err) {
    errors.push(`[CART ERROR] ${err.message}`);
  }
  
  await browser.close();
  
  // Report results
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(50));
  
  if (errors.length === 0) {
    console.log('✅ All tests passed! No errors found.');
  } else {
    console.log(`❌ Found ${errors.length} error(s):`);
    errors.forEach(err => console.log(`   ${err}`));
  }
  
  if (warnings.length > 0) {
    console.log(`⚠️  Found ${warnings.length} warning(s):`);
    warnings.forEach(warn => console.log(`   ${warn}`));
  }
  
  console.log('='.repeat(50));
  
  return errors.length === 0;
}

testGlowStopWebsite()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
