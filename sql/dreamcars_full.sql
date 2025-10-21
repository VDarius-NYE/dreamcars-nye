-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Okt 21. 12:19
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `dreamcars`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `car_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_price` int(11) NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `car_id`, `start_date`, `end_date`, `total_price`, `status`, `created_at`) VALUES
(1, 1, 4, '2025-10-30', '2025-10-30', 110000, 'confirmed', '2025-10-20 06:56:16'),
(2, 1, 4, '2025-10-29', '2025-10-29', 110000, 'confirmed', '2025-10-21 08:00:14'),
(3, 1, 10, '2025-10-22', '2025-10-22', 75000, 'confirmed', '2025-10-21 10:06:33');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `cars`
--

CREATE TABLE `cars` (
  `id` int(11) NOT NULL,
  `marka` varchar(50) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `img` varchar(255) NOT NULL,
  `desc` text DEFAULT NULL,
  `evjarat` int(11) NOT NULL,
  `uzemanyag` tinyint(4) NOT NULL COMMENT '1=Benzin, 2=Dízel, 3=Elektromos',
  `ar` int(11) NOT NULL COMMENT 'Ft/nap'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `cars`
--

INSERT INTO `cars` (`id`, `marka`, `nev`, `img`, `desc`, `evjarat`, `uzemanyag`, `ar`) VALUES
(1, 'BMW', 'BMW M4', 'bmw_m4.jpg', 'Német sportkupé, 510 lóerővel.', 2023, 1, 95000),
(2, 'Ford', 'Mustang GT', 'mustang.jpg', 'Klasszikus amerikai izomautó.', 2022, 1, 87000),
(3, 'Nissan', 'GT-R R35', 'gtr.jpg', 'Legendás japán szupersportautó.', 2021, 1, 120000),
(4, 'BMW', 'BMW i8', 'bmw_i8.jpg', 'Hibrid sportkocsi futurisztikus dizájnnal.', 2024, 3, 110000),
(5, 'Ford', 'F-150 Raptor', 'f150_raptor.jpg', 'Terepjáró pickup extrém teljesítménnyel.', 2023, 2, 78000),
(6, 'Nissan', 'Leaf', 'leaf.jpg', 'Elektromos családi autó, környezetbarát.', 2025, 3, 45000),
(7, 'BMW', 'X5', 'bmw_x5.jpg', 'Prémium SUV luxus felszereltséggel.', 2024, 2, 82000),
(8, 'Ford', 'Focus ST', 'focus_st.jpg', 'Sportos kompakt autó dinamikus vezetéshez.', 2022, 1, 52000),
(9, 'Nissan', '370Z', 'nissan_370z.jpg', 'Sportos kupé izgalmas vezetési élménnyel.', 2023, 1, 68000),
(10, 'Dodge', 'Challenger', 'dodge_challenger_1760694243.jpg', '2023 Dodge Challenger, 303 lóerő, igazi amerikai izomautó', 2023, 1, 75000);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `hasBookings` tinyint(4) DEFAULT 0,
  `isAdmin` tinyint(1) DEFAULT 0 COMMENT '0=Nem admin, 1=Admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `fullname`, `email`, `phone`, `password`, `hasBookings`, `isAdmin`) VALUES
(1, 'Varga Dárius', 'darovarga@gmail.com', '305840612', '$2y$10$Mk.0ymwvNE85ZHm0JinMB.TlRCAHsYP/Ad2doLSr7iGnScfBt61Oe', 0, 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `car_id` (`car_id`);

--
-- A tábla indexei `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_marka` (`marka`),
  ADD KEY `idx_evjarat` (`evjarat`),
  ADD KEY `idx_uzemanyag` (`uzemanyag`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT a táblához `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
