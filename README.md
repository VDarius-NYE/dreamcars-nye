# DreamCars Project

Ez a projekt egy webalkalmazás, amely autórajongóknak készült, és a világ legizgalmasabb sportautóit, izomautóit és klasszikusait mutatja be. A felhasználók könnyedén böngészhetnek a különböző autómodellek között, részletes műszaki adatokat olvashatnak, és foglalhatnak is autókat.

---

## Fő funkciók

- **Kezdőlap** kiemelt modellek, valós idejű statisztika és kommentek
- **Autóválasztó** részletes leírással, műszaki adatokkal és képekkel
- **Foglalási rendszer** (foglalás gombbal, ami a foglalási oldalra navigál)
- **Reszponzív, modern design**, illeszkedve a felhasználói igényekhez
- **Könnyű bővíthetőség** és testreszabhatóság

---

## Fejlesztési irányok

- Foglalási rendszer továbbfejlesztése backend támogatással
- Több autómodell hozzáadása és részletesebb adatok
- Felhasználói profil létrehozása és kezelés
- Mobilos felhasználói élmény fokozása
- Többnyelvű támogatás implementálása

---

## Technológiák

- HTML5, CSS3
- JavaScript ES6+
- Reszponzív webdesign

---

## Szerző és kapcsolat

**Projekt készítője:** Juhász Ferenc Dániel, Varga Dárius, Osikóczki Sándor Mátyás - [CTRL+C]

# DreamCars - Gyors Telepítési Útmutató

## Előkövetelmények
- XAMPP telepítve (Apache + MySQL)
- Böngésző (Chrome/Firefox/Edge/Brave)

---

## Telepítés 5 Lépésben

### Adatbázis létrehozása
1. Indítsd el a **XAMPP Control Panel**-t
2. Start: **Apache** és **MySQL**
3. Nyisd meg: `http://localhost/phpmyadmin`
4. Kattints: **Új** (bal oldalt)
5. Adatbázis név: `dreamcars`
6. Kódolás: `utf8mb4_unicode_ci`
7. **Létrehoz** gomb

### SQL Importálás
1. Válaszd ki a `dreamcars` adatbázist
2. **Importálás** fül
3. **Fájl kiválasztása**: `dreamcars_251014.sql`
4. **Indítás** gomb
5. "Import sikeresen befejezve"

### Fájlok Másolása
```
📁 C:/xampp/htdocs/dreamcars-nye-main/
├── 📁 html/
│   ├── index.html
│   ├── cars.html
│   ├── login.html
│   ├── register.html
│   └── booking.html
├── 📁 css/
│   └── style.css
├── 📁 js/
│   ├── main.js
│   ├── auth.js
│   ├── cars.js
│   └── stats.js
├── 📁 php/
│   ├── session_handler.php
│   ├── login.php
│   ├── register.php
│   ├── logout.php
│   ├── check_session.php
│   ├── get_brands.php
│   ├── get_cars.php
│   └── get_stats.php
└── 📁 assets/
    ├── favicon.png
    └── 📁 listImg/
        ├── bmw_m4.jpg
        ├── mustang.jpg
        └── ... (további képek)
```

### Képek Elhelyezése
Másold be az autók képeit az `assets/listImg/` mappába:
- bmw_m4.jpg
- bmw_i8.jpg
- bmw_x5.jpg
- mustang.jpg
- f150_raptor.jpg
- focus_st.jpg
- gtr.jpg
- leaf.jpg
- nissan_370z.jpg

### Böngészőben Megnyitás
Nyisd meg: `http://localhost/dreamcars-nye-main/html/index.html`

---

## Gyors Teszt

### Regisztráció tesztelése:
1. Kattints: **Regisztráció**
2. Tölts ki minden mezőt
3. **Regisztráció** gomb
4. "Sikeres regisztráció!"

### Bejelentkezés tesztelése:
1. Kattints: **Bejelentkezés**
2. Add meg az email-t és jelszót
3. **Belépés** gomb
4. Navigáció frissül → "👤 [Neved]"

### Autók böngészése:
1. Kattints: **Autók**
2. Válassz márkát (BMW/Ford/Nissan)
3. Autók megjelennek grid-ben
4. Kattints: **🎫 Foglalás** gomb bármelyik autónál

### Statisztikák ellenőrzése:
1. Főoldal alján látható:
   - Regisztrált Felhasználók száma
   - Foglalások száma (0 ha még nincs)
   - Autók száma (9)

---

## Gyakori Hibák

### "Access denied for user 'root'@'localhost'"
**Megoldás:** `php/` fájlokban állítsd át:
```php
$password = ""; // Ha van jelszavad, írd be
```

### "Table 'dreamcars.users' doesn't exist"
**Megoldás:** SQL nem lett importálva. Ismételd meg a 2. lépést.

### Képek nem töltődnek be
**Megoldás:** 
- Ellenőrizd: `assets/listImg/` létezik?
- Képek nevei egyeznek az SQL-ben megadottakkal?

### Session nem működik
**Megoldás:**
- `Ctrl + Shift + R` (hard refresh)
- Böngésző cache törlése
- Konzol (F12) → hibák ellenőrzése

### Statisztikák 0-k
**Megoldás:**
- Látogasd meg: `http://localhost/dreamcars-nye-main/php/get_stats.php`
- Ha hibát látsz → SQL import újra
- F12 → Console → hibák

---

## Admin Teszt Fiók (opcionális)

**Hozz létre egy admin fiókot:**
```sql
-- phpMyAdmin-ban futtasd:
INSERT INTO users (fullname, email, password) 
VALUES ('Admin', 'admin@dreamcars.hu', '$2y$10$EAbAw5o90vDa9lWPUc5i0ujEGqsczQeXePp29TJHIvWyFutpNYB6W');
```
**Bejelentkezés:**
- Email: `admin@dreamcars.hu`
- Jelszó: `admin123`

---

## Ellenőrző Lista

- [ ] XAMPP fut (Apache + MySQL)
- [ ] Adatbázis létrejött (`dreamcars`)
- [ ] SQL importálva (9 autó, users tábla)
- [ ] Fájlok a helyükön
- [ ] Képek az `assets/listImg/` mappában
- [ ] `index.html` megnyílik hibák nélkül
- [ ] Regisztráció működik
- [ ] Bejelentkezés működik
- [ ] Navigáció változik bejelentkezés után
- [ ] Autók megjelennek
- [ ] Statisztikák látszanak
- [ ] Foglalás gombok működnek

---

## Kész!

Ha minden pipa akkor a DreamCars teljesen működik!

**Következő lépések:**
- Foglalási rendszer fejlesztése
- Profil oldal
- Admin panel

---

## Gyors Linkek

- Főoldal: `http://localhost/dreamcars-nye-main/html/index.html`
- phpMyAdmin: `http://localhost/phpmyadmin`
- API teszt: `http://localhost/dreamcars-nye-main/php/get_stats.php`
