Silent Signal - README

Overview

Silent Signal is an innovative emergency and emotion communication system designed to help people communicate without speaking or typing. This app is particularly helpful for individuals who cannot speak due to disabilities, illness, or emergency situations. By using intuitive emojis, colors, and light signals, Silent Signal allows users to quickly send a message to their trusted contacts in moments of distress, without having to read or type anything.

⸻

Features
	•	Non-Verbal Communication: Send emotional and emergency signals using emojis, colors, and light without typing or speaking.
	•	Simple Interface: No learning curve — one tap = one meaning.
	•	Real-Time Notifications: Trusted contacts receive your signals instantly through push notifications.
	•	Color & Emoji Mapping: Different colors and emojis represent specific emotional states or emergency situations.
	•	Haptic Feedback: Each signal is accompanied by a distinct vibration pattern to ensure the user knows the signal has been sent.
	•	No Text: Users interact with simple, intuitive signals (emojis and colors) to communicate feelings like fear, distress, safety, and help.

⸻

Technologies Used
	•	React.js: For building the front-end UI of the application.
	•	TypeScript: For type safety and improved development experience in JavaScript.
	•	Supabase: To handle user authentication, database management, and real-time notifications.
	•	Firebase: For sending push notifications to users when a signal is received.
	•	Haptic Feedback: Using the React Native Haptic Feedback library for vibration feedback.

⸻

Core Design Principles
	•	No typing: Instant communication without the need to type.
	•	No speaking: Designed for situations where verbal communication isn’t possible.
	•	No learning curve: The interface is designed to be intuitive and accessible for everyone.
	•	One action = one meaning: Users can send signals instantly with a single tap.
	•	Emotion first, interface second: Focuses on the emotional state of the user rather than complex features or options.

⸻

User Flow

1. Disguised Home Screen
	•	The app mimics a normal app (e.g., weather, music) for privacy.
	•	To access the signal screen, the user uses a secret gesture (e.g., long press or swipe).

2. Signal Selection
	•	The user taps on an emoji (e.g., 🆘 I need help, 😨 I’m scared, ❤️ I’m safe).
	•	Each emoji triggers a color change and a distinct vibration pattern to confirm the action.

3. Signal Sent Confirmation
	•	After sending the signal, the screen displays a color wash (e.g., red for danger, yellow for help).
	•	Gentle animations and vibration confirm that the signal has been successfully sent.

4. Receiver View
	•	Trusted contacts receive the signal with color, emoji, and motion pulse to understand the urgency or emotional state instantly.

⸻

Installation

Prerequisites
	•	Node.js (for ReactJS and TypeScript setup)
	•	Supabase account (for authentication and real-time database)
	•	Firebase account (for sending push notifications)

Steps to Install
	1.	Clone the Repository

git clone https://github.com/mfbhai10/silent-signal-HackDay-2026-
cd silent-signal-HackDay-2026-


	2.	Install Dependencies

npm install


	3.	Set Up Supabase
	•	Go to Supabase￼ and create a new project.
	•	Create a table for user authentication and real-time signals.
	•	Add your Supabase URL and API key to your app’s environment variables.
	4.	Set Up Firebase
	•	Create a Firebase Project on Firebase Console￼.
	•	Set up Firebase Cloud Messaging for push notifications.
	•	Add your Firebase API key and project credentials to the app’s environment variables.
	5.	Run the App Locally
For development:

npm start


	6.	Build for Production
When you’re ready to deploy:

npm run build



⸻

Directory Structure

/silent-signal
|-- /src
|   |-- /components      # React components for the UI
|   |-- /services       # Logic for interacting with Supabase and Firebase
|   |-- /assets         # Images, icons, and other static files
|   |-- /hooks          # Custom React hooks
|   |-- /utils          # Utility functions (e.g., color-to-emoji mapping)
|-- .env                # Environment variables (Supabase, Firebase keys)
|-- package.json        # Project dependencies and scripts
|-- README.md           # This README file


⸻

How to Use
	1.	Open the App:
When you open the app, the home screen will look like a typical app (e.g., weather or music).
	2.	Activate Silent Mode:
Tap and hold, swipe, or use a secret gesture to unlock the Signal Mode.
	3.	Select a Signal:
Choose from the available emojis that represent your emotional state or emergency situation.
	4.	Confirmation:
The screen will change color, and the app will provide vibration feedback to confirm the signal was sent.
	5.	Receiver Notification:
Trusted contacts will see the signal as a color wash and emoji, with vibration feedback for immediate understanding.

⸻

Future Improvements
	•	Wearable Device Support: Add integration with smartwatches or other wearable devices for enhanced haptic feedback.
	•	Multilingual Support: Though we rely on non-verbal communication, adding language support would increase accessibility.
	•	Customizable Emojis/Signals: Allow users to create and use custom signals based on their needs.

⸻

License

This project is licensed under the MIT License. See the LICENSE￼ file for more information.

⸻

Contact

For questions or feedback, feel free to reach out:
	•	Email: mutasimfuadrafi10@gmail.com￼
	•	GitHub: Silent Signal GitHub Repository￼

⸻

Silent Signal: Helping You Communicate in Silence, When Every Second Counts.
