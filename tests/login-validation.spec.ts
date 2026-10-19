import { test, expect } from '@playwright/test';

// TS_login_validation: ตรวจการกรอกข้อมูลไม่ครบ/ผิดรูปแบบ 3 test cases
// ช่องกรอกมี required, pattern เบอร์ 10 หลัก และ minLength 8
// เบราว์เซอร์จึงไม่ยอมส่งฟอร์ม และผู้ใช้ต้องยังอยู่หน้า Login

test('TC04 เบอร์โทรไม่ครบ 10 หลัก ส่งฟอร์มไม่ได้', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  const phone = page.getByLabel('หมายเลขโทรศัพท์มือถือ');
  await phone.fill('08123');
  await page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร').fill('uCrwVaBW39o_0G0Q5QwAVrqr');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  // ช่องเบอร์โทรไม่ผ่านการตรวจ และยังไม่เข้าสู่ระบบ
  expect(await phone.evaluate((el: HTMLInputElement) => el.checkValidity())).toBe(false);
  await expect(page.getByRole('button', { name: 'ออกจากระบบ' })).not.toBeVisible();
});

test('TC05 รหัสผ่านสั้นกว่า 8 ตัวอักษร ส่งฟอร์มไม่ได้', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByLabel('หมายเลขโทรศัพท์มือถือ').fill('0800000000');
  const password = page.getByPlaceholder('อย่างน้อย 8 ตัวอักษร');
  await password.fill('1234');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  expect(await password.evaluate((el: HTMLInputElement) => el.checkValidity())).toBe(false);
  await expect(page.getByRole('button', { name: 'ออกจากระบบ' })).not.toBeVisible();
});

test('TC06 ไม่กรอกข้อมูลเลย ส่งฟอร์มไม่ได้', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ' }).click();
  const phone = page.getByLabel('หมายเลขโทรศัพท์มือถือ');
  expect(await phone.evaluate((el: HTMLInputElement) => el.checkValidity())).toBe(false);
  await expect(page.getByRole('button', { name: 'ออกจากระบบ' })).not.toBeVisible();
});