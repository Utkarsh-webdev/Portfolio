function sendMessage() {
  const name = document.getElementById("f-name").value.trim();
  const email = document.getElementById("f-email").value.trim();
  const msg = document.getElementById("f-msg").value.trim();
  const status = document.getElementById("f-status");

  if (!name || !email || !msg) {
    status.textContent = "Fill in every field before sending.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${msg}\n\n— ${name} (${email})`);
  window.location.href = `mailto:utkarshjha832@gmail.com?subject=${subject}&body=${body}`;
  status.textContent = "Opening your email client…";
}