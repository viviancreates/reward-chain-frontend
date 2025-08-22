# Notes on building this frontend

On folder structure:
src/
  ├── api/        # backend calls
  ├── components/ # small reusable UI parts (Form, Input, Button)
  ├── views/      # screens (Register, Dashboard, Rewards)
  ├── styles/     # CSS files
  ├── utils/      # helper logic
  ├── App.jsx
  └── main.jsx

src/
  ├── components/
  │   ├── RegisterForm.jsx   # inputs & form logic for register
  │   ├── LoginForm.jsx      # inputs & form logic for login
  │   └── SharedInput.jsx    # optional reusable input field
  ├── views/
  │   ├── Register.jsx       # screen wrapper that renders `<RegisterForm />`
  │   └── Login.jsx          # screen wrapper that renders `<LoginForm />`
 