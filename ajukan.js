// ===== AJUKAN LAYANAN NUSAKU (PROTOTIPE) =====
// Pengajuan hanya disimpan di browser HP ini. Ini SIMULASI,
// tidak dikirim ke instansi mana pun.

const KUNCI_SESI = "nusaku_sesi";
const KUNCI_PENGAJUAN = "nusaku_pengajuan";

// Ambil semua pengajuan yang tersimpan
function ambilPengajuan() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_PENGAJUAN)) || [];
  } catch (error) {
    return [];
  }
}

// Ambil email pengguna yang sedang masuk
function ambilEmailSesi() {
  try {
    return localStorage.getItem(KUNCI_SESI);
  } catch (error) {
    return null;
  }
}

function tampilkanPesan(elemen, teks, jenis) {
  elemen.textContent = teks;
  elemen.className = "auth-message auth-message-" + jenis;
}

const formAjukan = document.getElementById("formAjukan");

formAjukan.addEventListener("submit", event => {
  event.preventDefault(); // cegah halaman dimuat ulang

  const pesan = document.getElementById("pesanAjukan");
  const pilihan = document.getElementById("ajukanLayanan");
  const layanan = pilihan.value;
  const ikon = layanan ? pilihan.selectedOptions[0].dataset.ikon : "";
  const perihal = document.getElementById("ajukanPerihal").value.trim();
  const keterangan = document.getElementById("ajukanKeterangan").value.trim();
  const setuju = document.getElementById("ajukanSetuju").checked;

  // Periksa isian satu per satu
  let masalah = "";

  if (!layanan) masalah = "Pilih jenis layanan dulu.";
  else if (perihal.length < 5) masalah = "Perihal minimal 5 huruf.";
  else if (!setuju) masalah = "Centang dulu pernyataan simulasi.";

  if (masalah) {
    tampilkanPesan(pesan, masalah, "error");
    return;
  }

  const email = ambilEmailSesi();

  if (!email) {
    window.location.replace("./masuk.html");
    return;
  }

  const nomor = "NSK-" + Date.now().toString(36).toUpperCase();
  const daftar = ambilPengajuan();

  daftar.push({
    id: nomor,
    email: email,
    layanan: layanan,
    ikon: ikon,
    perihal: perihal,
    keterangan: keterangan,
    tanggal: new Date().toISOString(),
    status: "proses"
  });

  try {
    localStorage.setItem(KUNCI_PENGAJUAN, JSON.stringify(daftar));
  } catch (error) {
    tampilkanPesan(pesan, "Maaf, pengajuan belum bisa disimpan di browser ini.", "error");
    return;
  }

  tampilkanPesan(pesan, "Pengajuan contoh berhasil dibuat (nomor " + nomor + "). Mengalihkan ke dashboard...", "ok");

  setTimeout(() => {
    window.location.href = "./dashboard.html";
  }, 1800);
});
