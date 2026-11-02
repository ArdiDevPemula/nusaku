// ===== DASHBOARD NUSAKU v1 =====
// Semua data di bawah ini hanya DATA CONTOH (bukan data asli).

// 1. Pintasan layanan populer
const popularServices = [
  { icon: "🪪", name: "Kependudukan" },
  { icon: "🏥", name: "Kesehatan" },
  { icon: "🎓", name: "Pendidikan" },
  { icon: "📢", name: "Pengaduan" },
  { icon: "🤝", name: "Bantuan Sosial" },
  { icon: "💼", name: "Pekerjaan" }
];

// 2. Riwayat aktivitas contoh (yang terbaru ada di atas)
const activities = [
  { icon: "🪪", title: "Pengajuan Kependudukan", date: "2 Nov 2026", status: "proses" },
  { icon: "📢", title: "Pengaduan Fasilitas Publik", date: "1 Nov 2026", status: "tindakan" },
  { icon: "🏥", title: "Pencarian Fasilitas Kesehatan", date: "30 Okt 2026", status: "selesai" },
  { icon: "🎓", title: "Informasi Beasiswa", date: "28 Okt 2026", status: "selesai" },
  { icon: "🤝", title: "Pengajuan Bantuan Sosial", date: "25 Okt 2026", status: "proses" },
  { icon: "💼", title: "Informasi Pelatihan Kerja", date: "20 Okt 2026", status: "selesai" },
  { icon: "🚌", title: "Informasi Jadwal Transportasi", date: "15 Okt 2026", status: "selesai" },
  { icon: "🌦️", title: "Peringatan Cuaca Wilayah", date: "10 Okt 2026", status: "selesai" }
];

// 3. Teks dan warna untuk setiap status
const statusInfo = {
  proses: { label: "Diproses", className: "db-badge-proses" },
  selesai: { label: "Selesai", className: "db-badge-selesai" },
  tindakan: { label: "Perlu Tindakan", className: "db-badge-tindakan" }
};

// 4. Ambil kotak-kotak yang akan diisi
const shortcutsBox = document.getElementById("dbShortcuts");
const historyBox = document.getElementById("dbHistory");

// 5. Tampilkan pintasan layanan
function renderShortcuts() {
  shortcutsBox.innerHTML = popularServices.map(item => `
    <a class="db-shortcut" href="./index.html#layanan">
      <span class="db-shortcut-icon">${item.icon}</span>
      ${item.name}
    </a>
  `).join("");
}

// 6. Tampilkan riwayat aktivitas (5 teratas)
function renderHistory() {
  if (activities.length === 0) {
    historyBox.innerHTML = '<p class="db-empty">Belum ada aktivitas.</p>';
    return;
  }

  historyBox.innerHTML = activities.slice(0, 5).map(item => {
    const info = statusInfo[item.status];

    return `
      <div class="db-history-item">
        <div class="db-history-icon">${item.icon}</div>
        <div class="db-history-info">
          <strong>${item.title}</strong>
          <small>${item.date}</small>
        </div>
        <span class="db-badge ${info.className}">${info.label}</span>
      </div>
    `;
  }).join("");
}

// 7. Hitung ringkasan pengajuan dari data riwayat
function renderSummary() {
  const count = status => activities.filter(item => item.status === status).length;

  document.getElementById("sumProses").textContent = count("proses");
  document.getElementById("sumSelesai").textContent = count("selesai");
  document.getElementById("sumTindakan").textContent = count("tindakan");
}

// 8. Jalankan semuanya
renderShortcuts();
renderHistory();
renderSummary();
