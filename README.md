# Aplikacja Fitness Trainer

Pełny stos technologiczny do śledzenia treningów:

- **Backend**: Node.js, Express, Sequelize, PostgreSQL  
- **Frontend**: React, Vite, React Router, Tailwind CSS  
- **Autoryzacja**: JWT  
- **Powiadomienia**: React-Toastify  

---


fitness-trainer-app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   ├── index.js
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api.ts
│   │   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── .env.example
└── .gitignore


Backend
npm run start — uruchomienie serwera

npm run dev — uruchomienie z nodemon

Frontend
npm run dev — uruchomienie Vite

npm run build — build produkcyjny

npm run preview — podgląd builda

🛡 Przebieg autoryzacji
Rejestracja: POST /api/auth/register z ciałem { username, password } → zwraca JWT

Logowanie: POST /api/auth/login z ciałem { username, password } → zwraca JWT


📝 Funkcje
Treningi: CRUD, oznaczanie jako wykonane

Kalendarz: podgląd wg dat

Statystyki: liczby i wykresy

Profil: wiek, waga, wzrost, cele, BMI, BMR, TDEE, makroskładniki

Powiadomienia: sukces/błąd via toasty

Responsywność: mobilny UI dzięki Tailwind

🙋‍♂️ Współpraca
Fork → git clone https://github.com/twoj-username/fitness-trainer-app.git

Branch → git checkout -b feature/nazwa-funkcji

Commit → git commit -m "Opis zmian"

Push → git push origin feature/nazwa-funkcji

Pull Request

