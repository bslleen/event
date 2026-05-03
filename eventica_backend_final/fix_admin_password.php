<?php
// شغّل هذا الملف مرة واحدة في المتصفح ثم احذفه !
include "db.php";
$hash = password_hash('Bouchra1.', PASSWORD_DEFAULT);
$conn->query("UPDATE users SET password='$hash' WHERE username='bouchra'");
echo "✅ Done — كلمة السر حُوّلت إلى hash. احذف هذا الملف الآن!";
?>
