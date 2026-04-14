import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ Your admin email address
const ADMIN_EMAIL = "bhandeadarsh2006@gmail.com";

async function setAdminClaim() {
  const user = await admin.auth().getUserByEmail(ADMIN_EMAIL);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`✅ Admin claim set for: ${user.email} (uid: ${user.uid})`);
  process.exit(0);
}

setAdminClaim().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
