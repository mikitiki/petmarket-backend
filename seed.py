"""
Skrypt do wypełnienia bazy danych testowymi danymi.
Uruchom: python seed.py
Hasło wszystkich użytkowników: 123
"""
from app import create_app, db
from app.models import User, SpecialistProfile, Service, Booking
import bcrypt

def hash_password(plain):
    return bcrypt.hashpw(plain.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
from datetime import date, timedelta

app = create_app()

SPECIALISTS = [
    {
        "email": "anna.kowalska@petmarket.pl",
        "name": "Anna Kowalska",
        "city": "Warszawa",
        "specialization": "Behawiorysta",
        "bio": "Certyfikowany behawiorysta zwierząt z 8-letnim doświadczeniem. Specjalizuję się w problemach lękowych psów i kotów.",
        "services": [
            {"name": "Konsultacja behawioralna", "description": "Pierwsza wizyta diagnostyczna", "price": 150.0, "duration": 60},
            {"name": "Trening psa", "description": "Nauka podstawowych komend i korekta zachowania", "price": 100.0, "duration": 45},
            {"name": "Trening kota", "description": "Redukcja agresji i lęków u kotów", "price": 120.0, "duration": 60},
        ],
    },
    {
        "email": "jan.nowak@petmarket.pl",
        "name": "Jan Nowak",
        "city": "Kraków",
        "specialization": "Weterynarz",
        "bio": "Lekarz weterynarii z 12 lat praktyki. Specjalizacja w chirurgii małych zwierząt i medycynie wewnętrznej.",
        "services": [
            {"name": "Wizyta ogólna", "description": "Badanie kliniczne i konsultacja", "price": 80.0, "duration": 30},
            {"name": "Szczepienia", "description": "Pakiet szczepień profilaktycznych", "price": 120.0, "duration": 20},
            {"name": "USG jamy brzusznej", "description": "Badanie ultrasonograficzne", "price": 200.0, "duration": 45},
        ],
    },
    {
        "email": "marta.wisniewska@petmarket.pl",
        "name": "Marta Wiśniewska",
        "city": "Wrocław",
        "specialization": "Groomer",
        "bio": "Profesjonalny groomer z 5-letnim stażem. Obsługuję wszystkie rasy psów i kotów. Uczestnik krajowych konkursów groomerskich.",
        "services": [
            {"name": "Strzyżenie psa małego", "description": "Psy do 10 kg", "price": 80.0, "duration": 60},
            {"name": "Strzyżenie psa dużego", "description": "Psy powyżej 10 kg", "price": 140.0, "duration": 90},
            {"name": "Kąpiel i suszenie", "description": "Kąpiel, suszenie, czesanie", "price": 60.0, "duration": 45},
        ],
    },
    {
        "email": "pawel.kaminski@petmarket.pl",
        "name": "Paweł Kamiński",
        "city": "Gdańsk",
        "specialization": "Behawiorysta",
        "bio": "Behawiorysta i trener psów pracujący metodami pozytywnymi. Prowadzę grupy szkoleniowe i indywidualne sesje.",
        "services": [
            {"name": "Sesja indywidualna", "description": "Trening 1:1 z psem i właścicielem", "price": 130.0, "duration": 60},
            {"name": "Kurs podstawowy", "description": "5 sesji — posłuszeństwo i socjalizacja", "price": 500.0, "duration": 60},
        ],
    },
    {
        "email": "zofia.lewandowska@petmarket.pl",
        "name": "Zofia Lewandowska",
        "city": "Poznań",
        "specialization": "Weterynarz",
        "bio": "Weterynarz egzotyczny — specjalizacja w gadach, ptakach i małych ssakach. Przyjmuję też psy i koty.",
        "services": [
            {"name": "Wizyta — zwierzę egzotyczne", "description": "Badanie i konsultacja", "price": 100.0, "duration": 30},
            {"name": "Wizyta — pies/kot", "description": "Badanie kliniczne", "price": 70.0, "duration": 20},
        ],
    },
]

OWNERS = [
    {"email": "piotr.zielinski@petmarket.pl"},
    {"email": "katarzyna.mazur@petmarket.pl"},
    {"email": "tomasz.kowal@petmarket.pl"},
    {"email": "alicja.nowak@petmarket.pl"},
]

today = date.today()

with app.app_context():
    db.create_all()

    # Użytkownicy — specjaliści
    specialist_users = []
    for s in SPECIALISTS:
        u = User(email=s["email"], password_hash=hash_password("123"), role="specialist")
        db.session.add(u)
        specialist_users.append((u, s))

    # Użytkownicy — właściciele
    owner_users = []
    for o in OWNERS:
        u = User(email=o["email"], password_hash=hash_password("123"), role="owner")
        db.session.add(u)
        owner_users.append(u)

    db.session.flush()

    # Profile specjalistów + usługi
    profiles = []
    for user, data in specialist_users:
        profile = SpecialistProfile(
            user_id=user.id,
            name=data["name"],
            city=data["city"],
            specialization=data["specialization"],
            bio=data["bio"],
            photo_url="",
        )
        db.session.add(profile)
        db.session.flush()

        svcs = []
        for svc_data in data["services"]:
            svc = Service(
                specialist_id=profile.id,
                name=svc_data["name"],
                description=svc_data["description"],
                price=svc_data["price"],
                duration=svc_data["duration"],
            )
            db.session.add(svc)
            svcs.append(svc)

        db.session.flush()
        profiles.append((profile, svcs))

    # Rezerwacje testowe
    bookings_data = [
        # (owner_index, specialist_index, service_index, days_from_today, time, status)
        (0, 0, 1, 3,  "10:00", "potwierdzona"),
        (0, 1, 0, 5,  "09:00", "oczekująca"),
        (1, 0, 0, 7,  "11:00", "oczekująca"),
        (1, 2, 2, 2,  "14:00", "potwierdzona"),
        (2, 1, 1, 10, "12:00", "oczekująca"),
        (2, 3, 0, 4,  "15:00", "potwierdzona"),
        (3, 4, 0, 6,  "09:00", "oczekująca"),
        (0, 2, 0, -5, "10:00", "potwierdzona"),  # przeszła
        (1, 1, 0, -3, "13:00", "anulowana"),
        (3, 0, 2, 14, "16:00", "oczekująca"),
    ]

    for owner_idx, spec_idx, svc_idx, days, time, status in bookings_data:
        profile, svcs = profiles[spec_idx]
        booking_date = (today + timedelta(days=days)).isoformat()
        b = Booking(
            owner_id=owner_users[owner_idx].id,
            specialist_id=profile.id,
            service_id=svcs[svc_idx].id if svc_idx < len(svcs) else None,
            date=booking_date,
            time=time,
            status=status,
        )
        db.session.add(b)

    db.session.commit()
    print("\n✓ Baza danych wypełniona!\n")
    print("SPECJALIŚCI (hasło: 123)")
    print("-" * 45)
    for u, data in specialist_users:
        print(f"  {data['specialization']:15} {u.email}")
    print("\nWŁAŚCICIELE (hasło: 123)")
    print("-" * 45)
    for u in owner_users:
        print(f"  {u.email}")
    print()
