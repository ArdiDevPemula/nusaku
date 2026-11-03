// ===== LACAK PENGAJUAN NUSAKU (PROTOTIPE) =====
// Data pengajuan hanya ada di browser HP ini. Status di sini SIMULASI.

const KUNCI_SESI = "nusaku_sesi";
const KUNCI_PENGAJUAN = "nusaku_pengajuan";

// Teks dan warna untuk setiap status
const statusInfo = {
  proses: { label: "Diproses", className: "db-badge-proses", langkah: "Sedang diproses" },
  selesai: { label: "Selesai", className: "db-badge-selesai", langkah: "Selesai" },
  tindakan: { label: "Perlu Tindakan", className: "db-badge-tindakan", langkah: "Perlu tindakan dari Anda" }
};

const daftarBox = document.getElementById("lacakDaftar");
const kolomCari = document.getElementById("lacakCari");

// ---------- Fungsi bantu ----------

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

// "3 Nov 2026"
function formatTanggal(tanggalIso) {
  const tanggal = new Date(tanggalIso);
  if (isNaN(tanggal)) return "-";
  return tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// "3 Nov 2026, 07.49"
function formatWaktu(tanggalIso) {
  const tanggal = new Date(tanggalIso);
  if (isNaN(tanggal)) return "-";
  return tanggal.toLocaleString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

// ---------- Data ----------

// Pengajuan milik pengguna yang masuk, yang terbaru di atas
function ambilPengajuanSaya() {
  const email = ambilEmailSesi();

  return bacaDaftar(KUNCI_PENGAJUAN)
    .filter(item => item.email === email)
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
}

// Susun langkah-langkah perjalanan status
function buatLangkah(item) {
  const langkah = [{ judul: "Pengajuan dibuat", waktu: item.tanggal }];

  // Kalau belum ada catatan perubahan status, pakai status saat ini
  const riwayat = Array.isArray(item.riwayatStatus) && item.riwayatStatus.length > 0
    ? item.riwayatStatus
    : [{ status: item.status, waktu: item.tanggal }];

  riwayat.forEach(catatan => {
    const info = statusInfo[catatan.status] || statusInfo.proses;
    langkah.push({ judul: info.langkah, waktu: catatan.waktu });
  });

  return langkah;
}

// ---------- Tampilan ----------

function buatKartu(item) {
  const info = statusInfo[item.status] || statusInfo.proses;
  const nomor = amankanTeks(item.id || "-");

  const langkahHtml = buatLangkah(item).map(langkah => `
    <div class="lk-step">
      <span class="lk-dot"></span>
      <div>
        <strong>${amankanTeks(langkah.judul)}</strong>
        <small>${formatWaktu(langkah.waktu)}</small>
      </div>
    </div>
  `).join("");

  const keteranganHtml = item.keterangan
    ? `<div class="lk-row"><span>Keterangan</span><strong>${amankanTeks(item.keterangan)}</strong></div>`
    : "";

  return `
    <details class="lk-item">
      <summary>
        <div class="db-history-icon">${amankanTeks(item.ikon || "📄")}</div>
        <div class="db-history-info">
          <strong>${amankanTeks(item.perihal)}</strong>
          <small>${nomor} · ${formatTanggal(item.tanggal)}</small>
        </div>
        <span class="db-badge ${info.className}">${info.label}</span>
      </summary>

      <div class="lk-body">
        <div class="lk-row"><span>Nomor</span><strong>${nomor}</strong></div>
        <div class="lk-row"><span>Layanan</span><strong>${amankanTeks(item.layanan)}</strong></div>
        <div class="lk-row"><span>Tanggal</span><strong>${formatWaktu(item.tanggal)}</strong></div>
        ${keteranganHtml}

        <h3 class="lk-subtitle">Perjalanan Status</h3>
        <div class="lk-timeline">${langkahHtml}</div>
      </div>
    </details>
  `;
}

function tampilkanDaftar() {
  const semua = ambilPengajuanSaya();
  const kata = kolomCari.value.trim().toLowerCase();

  if (semua.length === 0) {
    daftarBox.innerHTML = '<p class="db-empty">Belum ada pengajuan. Ketuk "+ Ajukan Layanan Baru" untuk mencoba.</p>';
    return;
  }

  const hasil = semua.filter(item =>
    ((item.id || "") + " " + item.perihal + " " + item.layanan).toLowerCase().includes(kata)
  );

  if (hasil.length === 0) {
    daftarBox.innerHTML = '<p class="db-empty">Tidak ada pengajuan yang cocok.</p>';
    return;
  }

  daftarBox.innerHTML = hasil.map(buatKartu).join("");
}

// ---------- Jalankan ----------

kolomCari.addEventListener("input", tampilkanDaftar);
tampilkanDaftar();
