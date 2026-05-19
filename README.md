# PetMarket — Backend

Marketplace dla właścicieli zwierząt i specjalistów (weterynarze, behawioryści, groomers).

## Stack

- **Backend:** Python, Flask, SQLAlchemy, Flask-JWT-Extended
- **Frontend:** React + Vite
- **Baza danych:** SQLite (plik lokalny, nie commitowany do repozytorium)

---

## Pierwsze uruchomienie (każda osoba robi to raz)

### 1. Sklonuj repozytorium i przejdź do folderu

```bash
git clone https://github.com/mikitiki/petmarket-backend.git
cd petmarket-backend
```

### 2. Utwórz plik `.env` w katalogu głównym projektu

```
SECRET_KEY=dowolny-tajny-klucz
JWT_SECRET_KEY=dowolny-jwt-klucz
DATABASE_URL=sqlite:///petmarket.db
```

### 3. Zainstaluj zależności

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Wypełnij bazę danych testowymi danymi

```bash
python seed.py
```

Skrypt tworzy bazę z 5 specjalistami i 4 właścicielami. **Hasło wszystkich kont: `123`**

| Rola | Email |
|------|-------|
| Behawiorysta | anna.kowalska@petmarket.pl |
| Weterynarz | jan.nowak@petmarket.pl |
| Groomer | marta.wisniewska@petmarket.pl |
| Behawiorysta | pawel.kaminski@petmarket.pl |
| Weterynarz | zofia.lewandowska@petmarket.pl |
| Właściciel | piotr.zielinski@petmarket.pl |
| Właściciel | katarzyna.mazur@petmarket.pl |
| Właściciel | tomasz.kowal@petmarket.pl |
| Właściciel | alicja.nowak@petmarket.pl |

### 5. Uruchom backend

```bash
python run.py
```

Backend działa na `http://127.0.0.1:8000`

### 6. Uruchom frontend (osobny terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend działa na `http://localhost:5173`

---

## Reset bazy danych

Jeśli chcesz zacząć od zera:

```bash
rm instance/petmarket.db
python seed.py
```

---

## Struktura projektu

```
petmarket-backend/
├── app/
│   ├── __init__.py      # konfiguracja Flask, CORS
│   ├── models.py        # modele bazy danych
│   ├── auth.py          # rejestracja i logowanie
│   ├── specialists.py   # profile specjalistów, zdjęcia
│   ├── bookings.py      # rezerwacje
│   └── services.py      # usługi specjalistów
├── frontend/            # React + Vite
├── static/uploads/      # zdjęcia profilowe
├── seed.py              # dane testowe
├── run.py               # uruchomienie serwera
└── requirements.txt
```
