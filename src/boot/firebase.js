import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDraj3RaCTiGTK_Alsbslb-kbelw9Iyhgw",
  authDomain: "gvc-task.firebaseapp.com",
  databaseURL: "https://gvc-task-default-rtdb.firebaseio.com",
  projectId: "gvc-task",
  storageBucket: "gvc-task.firebasestorage.app",
  messagingSenderId: "194642192267",
  appId: "1:194642192267:web:66bedc6e262d9fce83318e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Hàm gọi đăng nhập bằng popup
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}
