import { test, expect } from '@playwright/test';

// TS_login: Login เจ้าของตลาด (owner) 3 test cases
// หมายเหตุ: หน้า Login มีหัวข้อ "ยินดีต้อนรับ" อยู่แล้วตั้งแต่ยังไม่ login
// จึงตรวจเพิ่มด้วยปุ่ม "ออกจากระบบ" ที่มีเฉพาะหลัง login สำเร็จ

test('TC01 Login เจ้าของตลาด สำเร็จ', async ({ page }) => {
  // 1. เปิดหน้า Login
  await page.goto('http://localhost:5173/');
  // 2. กรอกหมายเลขโทรศัพท์
  await page.getByLabel('หมายเลขโทรศัพท์มือถือ').fill('0800000000');
  // 3. กรอกรหัสผ่าน
  await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('uCrwVaBW39o_0G0Q5QwAVrqr');
  // 4. กดปุ่มเข้าสู่ระบบ
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  // 5. ตรวจสอบว่า Login สำเร็จ: เข้าหน้าระบบแล้ว มีปุ่มออกจากระบบ
  await expect(page.getByRole('button', { name: 'ออกจากระบบ' })).toBeVisible();
});

test('TC02 Login เจ้าของตลาด ใส่เบอร์โทรผิด', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  // เบอร์ถูกรูปแบบ 10 หลัก แต่ไม่มีในระบบ
  await page.getByLabel('หมายเลขโทรศัพท์มือถือ').fill('0899999999');
  await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('uCrwVaBW39o_0G0Q5QwAVrqr');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  // ต้องขึ้นข้อความแจ้งเตือน และยังไม่เข้าสู่ระบบ
  await expect(page.getByRole('alert')).toHaveText('หมายเลขโทรศัพท์หรือรหัสผ่านไม่ถูกต้อง');
  await expect(page.getByRole('button', { name: 'ออกจากระบบ' })).not.toBeVisible();
});

test('TC03 Login เจ้าของตลาด ใส่ password ผิด', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByLabel('หมายเลขโทรศัพท์มือถือ').fill('0800000000');
  // รหัสผ่านยาวพอ 8 ตัว แต่ไม่ถูกต้อง
  await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('wrongpass123');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  await expect(page.getByRole('alert')).toHaveText('หมายเลขโทรศัพท์หรือรหัสผ่านไม่ถูกต้อง');
  await expect(page.getByRole('button', { name: 'ออกจากระบบ' })).not.toBeVisible();
});