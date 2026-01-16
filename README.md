# Rent Car X — Front-end (React)

Repozytorium zawiera warstwę kliencką (front-end) systemu **RentCarX** — aplikację webową typu SPA (Single Page Application) zrealizowaną w **React + TypeScript**, komunikującą się z backendem poprzez **REST API**. Aplikacja udostępnia interfejs dla użytkownika końcowego (rezerwacje i płatności) oraz panel administracyjny.

**Wersja wdrożona (produkcyjna):** https://rentcarx.pl

---

## 1. Funkcjonalności

### 1.1. Użytkownik (część publiczna + konto)

- Przegląd floty pojazdów (lista + filtrowanie).
- Szczegóły pojazdu i rozpoczęcie rezerwacji.
- Rezerwacja pojazdu (formularz danych, daty).
- Inicjowanie procesu płatności i potwierdzenie (`/success`).
- Rejestracja, logowanie, potwierdzanie e-mail.
- Odzyskiwanie hasła i reset hasła.
- Panel konta użytkownika (np. dostęp do swoich danych/rezerwacji — zależnie od backendu).

### 1.2. Administrator (panel admin)

- Widoki administracyjne dostępne z poziomu `/admin` (oraz podstron).
- Zarządzanie użytkownikami, flotą i rezerwacjami.
- Eksporty danych (np. pliki) oraz widoki wspierające integrację płatności (Stripe).
- Widoki monitoringu/operacyjne (np. statusy, rezerwacje oczekujące — zależnie od backendu).

---

## 2. Stos technologiczny

- **React 19** – interfejs użytkownika.
- **TypeScript** – typowanie i mniejsze ryzyko błędów runtime.
- **React Router DOM 7** – routing aplikacji (SPA).
- **Axios** – komunikacja z REST API.
- **react-hook-form + yup + @hookform/resolvers** – obsługa formularzy i walidacja danych.
- **jwt-decode** – odczyt danych z JWT (np. wygasanie/rola).
- **TailwindCSS + PostCSS + Autoprefixer** – warstwa stylów (RWD).
- **React Testing Library + Jest** – testy UI i zachowań użytkownika.
- **gh-pages** – publikacja builda (hosting statyczny).

---

## 3. Wymagania

- **Node.js**: zalecane 18+ (lub aktualne LTS)
- **npm** (wraz z Node)

---

## 4. Instalacja i uruchomienie lokalne

1. Instalacja zależności:

```bash
npm install
```

Uruchomienie aplikacji w trybie developerskim (Hot Reload):

```bash
npm start
```

Aplikacja uruchamia się domyślnie pod adresem:

http://localhost:3000

Skrypty npm (package.json)
Start środowiska developerskiego:

```bash
npm start
```

Uruchomienie testów:

```bash
npm run build
```

Wdrożenie na hosting statyczny (GitHub Pages):

```bash
npm run deploy
```

predeploy automatycznie uruchamia build przed publikacją.

2. Routing aplikacji
   W projekcie zastosowano hash routing (createHashRouter) ze względu na kompatybilność z hostingiem statycznym i ograniczenie problemów z trasami SPA (bez konieczności konfiguracji serwera).

Zdefiniowane trasy (skrót):

Publiczne
/ – HomePage

/car-list – CarListPage

/reservation/:carId – ReservationPage

/success – PaymentSuccessPage

Autoryzacja / Konto
/signin – SignInPage

/confirm-email – EmailConfirmationPage

/login – LogInPage

/forgot-password – ForgotPasswordPage

/reset-password – ResetPasswordPage

/my-account – MyAccountPage

Admin
/admin – Board

/admin/users – AdminUsers

/admin/cars – AdminCars

/admin/reservations – AdminReservations

/admin/exports – AdminExportsPage

/admin/stripe – AdminStripePage

3. Struktura katalogów (skrót)

src/
├─ app/ # bootstrap aplikacji, router
│ ├─ App.tsx
│ ├─ router.tsx
│ └─ PagesRedirectBridge.tsx
├─ assets/ # zasoby statyczne (grafiki itp.)
├─ components/ # komponenty reużywalne (Layout, Form, Modal, itp.)
├─ pages/ # kompletne widoki (Home, Auth, Admin, Reservation...)
├─ services/ # komunikacja z API (podział domenowy)
│ ├─ admin/
│ ├─ auth/
│ ├─ cars/
│ ├─ notifications/
│ ├─ payments/
│ ├─ reservations/
│ ├─ stripe/
│ ├─ request.js # wspólny klient HTTP (axios)
│ └─ \_helpers.js # helpery (np. mapowanie błędów)
├─ constants/ # stałe konfiguracyjne
└─ helpers/ # funkcje pomocnicze

4. Komunikacja z API (warstwa services)
   Warstwa src/services/ izoluje wywołania HTTP od widoków i komponentów. UI importuje metody z usług zamiast wykonywać requesty bezpośrednio w komponentach.

Przykładowe domeny:

cars – pobieranie floty i filtrowanie

reservations – tworzenie/anulowanie rezerwacji, pobieranie list

payments – inicjowanie procesu płatności

auth – rejestracja/logowanie, reset hasła, potwierdzanie e-mail

admin – operacje panelu administracyjnego

stripe – operacje związane z Stripe (np. sync)

Token JWT dołączany jest do żądań autoryzowanych w nagłówku:
Authorization: Bearer <token>

5. Bezpieczeństwo (UI)
   Ograniczanie wielokrotnego wysłania formularzy (blokada przycisku submit podczas operacji).

Token JWT wykorzystywany do utrzymania sesji użytkownika w UI.

6. Wdrożenie (produkcyjne)
   Aplikacja jest publikowana jako build statyczny i udostępniona pod domeną:

https://rentcarx.pl

Pipeline wdrożenia frontu opiera się o skrypty:

npm run build → generacja /build

npm run deploy → publikacja /build przez gh-pages
