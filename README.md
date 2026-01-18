🚀 How to Run the Project Locally

Follow the steps below to set up and run the E-commerce Application on your local machine.

1️⃣ Clone the Repository

Open your terminal and run:

git clone https://github.com/Technology-maker/E-commerce.git


Move into the project folder:

cd E-commerce





2️⃣ Open Project in VS Code & Setup Terminals

Open the project in VS Code:

code .


Open two terminals in VS Code:

Terminal 1: Backend

cd backend


Terminal 2: Frontend

cd frontend






3️⃣ Install Dependencies

Install dependencies for both backend and frontend (run in each terminal):

npm install





4️⃣ Create Environment Variables (Backend)

Navigate to the backend folder and create a .env file.

Add the following content inside backend/.env:

PORT=8000   # You can use any available port

MONGO_URI=mongodb+srv://<YourUserName>:<YourPassword>@cluster0.t07v875.mongodb.net

MAIL_USER=yourgmail@gmail.com
MAIL_PASS=your_gmail_app_password

SECRET_KEY=your_secret_key_here

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_SECRET=xxxxxxxxxxxxxxxx


⚠️ Important

Use a Gmail App Password, not your real Gmail password

Replace all placeholders with your own credentials



5️⃣ Create Environment Variables (Frontend)

Create a .env file inside the frontend folder.

Add the following content:

VITE_RAZORPAY_KEY_ID=rzp_test_w43J86366558ANU50
VITE_API_BASE_URL=http://localhost:8000/api/v1


Make sure the API base URL matches the backend port.





6️⃣ Run the Application

Start both backend and frontend using the same command
(run in both terminals):

npm run dev


✅ This will start:

Backend: http://localhost:8000

Frontend: http://localhost:5173 (or similar)






🎉 You’re All Set!

Now you can:

Browse products

Add items to cart

Place orders

Make payments using Razorpay

Manage products via admin panel





