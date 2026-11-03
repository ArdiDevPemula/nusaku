// ===== DASHBOARD NUSAKU =====
// Semua data disimpan di browser HP ini (prototipe). Jangan pakai data asli.

const KUNCI_AKUN = "nusaku_akun";
const KUNCI_SESI = "nusaku_sesi";
const KUNCI_PENGAJUAN = "nusaku_pengajuan";

// ---------- Data tetap ----------

// Pintasan layanan populer
const popularServices = [
  { icon: "🪪", name: "Kependudukan" },
  { icon: "🏥", name: "Kesehatan" },
  { icon: "🎓", name: "Pendidikan" },
  { icon: "📢", name: "Pengaduan" },
  { icon: "🤝", name: "Bantuan Sosial" },
  { icon: "💼", name: "Pekerjaan" }
];

// Teks dan warna untuk setiap status
const statusInfo = {
  proses: { label: "Diproses", className: "db-badge-proses" },
  selesai: { label: "Selesai", className: "db-badge-selesai" },
  tindakan: { label: "Perlu Tindakan", className: "db-badge-tindakan" }
};

// Kotak yang akan diisi
const shortcutsBox = document.getElementById("dbShortcuts");
const historyBox = document.getElementById("dbHistory");

// ---------- Fungsi bantu ----------

// Baca daftar dari penyimpanan browser (selalu menghasilkan daftar)
function bacaDaftar(kunci) {
  try {
    const data = JSON.parse(localStorage.getItem(kunci));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function ambilEmailSesi() {
  try {
    return localStorage.getItem(KUNCI_SESI);
  } catch (error) {
    return null;
  }
}

// Amankan teks buatan pengguna sebelum ditampilkan di halaman
function amankanTeks(teks) {
  return String(teks)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// "Budi Contoh" -> "BC"
function ambilInisial(nama) {
  const kata = nama.trim().split(/\s+/);
  const awal = kata[0].charAt(0);
  const akhir = kata.length > 1 ? kata[kata.length - 1].charAt(0) : "";
  return (awal + akhir).toUpperCase();
}

// Tanggal ISO -> "November 2026"
function formatBulanTahun(tanggalIso) {
  const tanggal = new Date(tanggalIso);
  if (isNaN(tanggal)) return "-";
  return tanggal.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

// Tanggal ISO -> "3 Nov 2026"
function formatTanggal(tanggalIso) {
  const tanggal = new Date(tanggalIso);
  if (isNaN(tanggal)) return "-";
  return tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// ---------- Isi halaman ----------

// Data pengguna yang sedang masuk
function tampilkanPengguna() {
  const email = ambilEmailSesi();
  const pengguna = bacaDaftar(KUNCI_AKUN).find(item => item.email === email);

  if (!pengguna) {
    // Sesi tidak cocok dengan akun mana pun: kembali ke halaman masuk
    try { localStorage.removeItem(KUNCI_SESI); } catch (error) {}
    window.location.replace("./masuk.html");
    return;
  }

  document.getElementById("dbName").textContent = pengguna.nama;
  document.getElementById("dbAvatar").textContent = ambilInisial(pengguna.nama);
  document.getElementById("profNama").textContent = pengguna.nama;
  document.getElementById("profEmail").textContent = pengguna.email;
  document.getElementById("profWilayah").textContent = pengguna.wilayah || "-";
  document.getElementById("profBergabung").textContent = formatBulanTahun(pengguna.bergabung);
}

// Pintasan layanan populer
function tampilkanPintasan() {
  shortcutsBox.innerHTML = popularServices.map(item => `
    <a class="db-shortcut" href="./index.html#layanan">
      <span class="db-shortcut-icon">${item.icon}</span>
      ${item.name}
    </a>
  `).join("");
}

// Ringkasan dan riwayat dari pengajuan milik pengguna yang masuk
function tampilkanPengajuan() {
  const email = ambilEmailSesi();

  const milikSaya = bacaDaftar(KUNCI_PENGAJUAN)
    .filter(item => item.email === email)
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // terbaru di atas

  // Ringkasan
  const hitung = status => milikSaya.filter(item => item.status === status).length;
  document.getElementById("sumProses").textContent = hitung("proses");
  document.getElementById("sumSelesai").textContent = hitung("selesai");
  document.getElementById("sumTindakan").textContent = hitung("tindakan");

  // Riwayat
  if (milikSaya.length === 0) {
    historyBox.innerHTML = '<p class="db-empty">Belum ada pengajuan. Ketuk "+ Ajukan Layanan" untuk mencoba.</p>';
    return;
  }

  let html = milikSaya.slice(0, 5).map(item => {
    const info = statusInfo[item.status] || statusInfo.proses;

    return `
      <div class="db-history-item">
        <div class="db-history-icon">${amankanTeks(item.ikon || "📄")}</div>
        <div class="db-history-info">
          <strong>${amankanTeks(item.perihal)}</strong>
          <small>${amankanTeks(item.layanan)} · ${formatTanggal(item.tanggal)}</small>
        </div>
        <span class="db-badge ${info.className}">${info.label}</span>
      </div>
    `;
  }).join("");

  if (milikSaya.length > 5) {
    html += `<p class="db-note">Menampilkan 5 dari ${milikSaya.length} pengajuan terbaru.</p>`;
  }

  historyBox.innerHTML = html;
}

// ---------- Tombol Keluar ----------

// Hapus sesi saja (akun dan pengajuan tetap tersimpan)
document.getElementById("btnKeluar").addEventListener("click", () => {
  try { localStorage.removeItem(KUNCI_SESI); } catch (error) {}
  window.location.href = "./masuk.html";
});

// ---------- Jalankan ----------

tampilkanPengguna();
tampilkanPintasan();
tampilkanPengajuan();
