// ===== AUTH NUSAKU (PROTOTIPE) =====
// Data akun hanya disimpan di browser HP ini (localStorage).
// Ini HANYA untuk belajar. Jangan pakai data asli.

const KUNCI_AKUN = "nusaku_akun";
const KUNCI_SESI = "nusaku_sesi";

// ---------- Fungsi bantu ----------

function ambilAkun() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_AKUN)) || [];
  } catch (error) {
    return [];
  }
}

function simpanAkun(daftar) {
  localStorage.setItem(KUNCI_AKUN, JSON.stringify(daftar));
}

// Kata sandi diacak (hash) dulu, jadi tidak tersimpan apa adanya
async function acakSandi(email, sandi) {
  const teks = new TextEncoder().encode(email + ":" + sandi);
  const hasil = await crypto.subtle.digest("SHA-256", teks);
  return Array.from(new Uint8Array(hasil))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

function emailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function tampilkanPesan(elemen, teks, jenis) {
  elemen.textContent = teks;
  elemen.className = "auth-message auth-message-" + jenis;
}

// ---------- Halaman DAFTAR ----------

const formDaftar = document.getElementById("formDaftar");

if (formDaftar) {
  formDaftar.addEventListener("submit", async event => {
    event.preventDefault(); // cegah halaman dimuat ulang

    const pesan = document.getElementById("pesanDaftar");
    const nama = document.getElementById("daftarNama").value.trim();
    const email = document.getElementById("daftarEmail").value.trim().toLowerCase();
    const wilayah = document.getElementById("daftarWilayah").value.trim();
    const sandi = document.getElementById("daftarSandi").value;
    const sandi2 = document.getElementById("daftarSandi2").value;
    const setuju = document.getElementById("daftarSetuju").checked;

    // Periksa isian satu per satu
    let masalah = "";

    if (nama.length < 2) masalah = "Nama minimal 2 huruf.";
    else if (!emailValid(email)) masalah = "Format email belum benar.";
    else if (sandi.length < 6) masalah = "Kata sandi minimal 6 karakter.";
    else if (sandi !== sandi2) masalah = "Kata sandi dan ulangannya tidak sama.";
    else if (!setuju) masalah = "Centang dulu pernyataan prototipe.";

    if (masalah) {
      tampilkanPesan(pesan, masalah, "error");
      return;
    }

    const akun = ambilAkun();

    if (akun.some(item => item.email === email)) {
      tampilkanPesan(pesan, "Email ini sudah terdaftar. Silakan masuk.", "error");
      return;
    }

    try {
      const sandiAcak = await acakSandi(email, sandi);

      akun.push({
        nama: nama,
        email: email,
        wilayah: wilayah,
        sandiAcak: sandiAcak,
        bergabung: new Date().toISOString()
      });

      simpanAkun(akun);
      tampilkanPesan(pesan, "Akun berhasil dibuat! Mengalihkan ke halaman masuk...", "ok");

      setTimeout(() => {
        window.location.href = "./masuk.html";
      }, 1500);
    } catch (error) {
      tampilkanPesan(pesan, "Maaf, akun belum bisa dibuat di browser ini.", "error");
    }
  });
}

// ---------- Halaman MASUK ----------

const formMasuk = document.getElementById("formMasuk");

if (formMasuk) {
  formMasuk.addEventListener("submit", async event => {
    event.preventDefault();

    const pesan = document.getElementById("pesanMasuk");
    const email = document.getElementById("masukEmail").value.trim().toLowerCase();
    const sandi = document.getElementById("masukSandi").value;

    if (!email || !sandi) {
      tampilkanPesan(pesan, "Isi email dan kata sandi dulu.", "error");
      return;
    }

    try {
      const sandiAcak = await acakSandi(email, sandi);
      const akun = ambilAkun().find(
        item => item.email === email && item.sandiAcak === sandiAcak
      );

      if (!akun) {
        tampilkanPesan(pesan, "Email atau kata sandi salah.", "error");
        return;
      }

      localStorage.setItem(KUNCI_SESI, akun.email);
      tampilkanPesan(pesan, "Berhasil masuk! Membuka dashboard...", "ok");

      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 800);
    } catch (error) {
      tampilkanPesan(pesan, "Maaf, belum bisa masuk di browser ini.", "error");
    }
  });
}
