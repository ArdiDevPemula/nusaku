// ===== LACAK PENGAJUAN NUSAKU (PROTOTIPE) =====
// Data pengajuan hanya ada di browser HP ini. Status di sini SIMULASI.

const KUNCI_SESI = "nusaku_sesi";
const KUNCI_PENGAJUAN = "nusaku_pengajuan";

// Teks dan warna untuk setiap status
const statusInfo = {
  proses: { label: "Diproses", className: "db-badge-proses", langkah: "Sedang diproses", titik: "lk-dot-proses" },
  selesai: { label: "Selesai", className: "db-badge-selesai", langkah: "Selesai", titik: "lk-dot-selesai" },
  tindakan: { label: "Perlu Tindakan", className: "db-badge-tindakan", langkah: "Perlu tindakan dari Anda", titik: "lk-dot-tindakan" }
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
  const langkah = [{ judul: "Pengajuan dibuat", waktu: item.tanggal, titik: "lk-dot-awal" }];

  // Kalau belum ada catatan perubahan status, pakai status saat ini
  const riwayat = Array.isArray(item.riwayatStatus) && item.riwayatStatus.length > 0
    ? item.riwayatStatus
    : [{ status: item.status, waktu: item.tanggal }];

  riwayat.forEach(catatan => {
    const info = statusInfo[catatan.status] || statusInfo.proses;
    langkah.push({ judul: info.langkah, waktu: catatan.waktu, titik: info.titik });
  });

  return langkah;
}

// SIMULASI: ubah status satu pengajuan lalu simpan
function ubahStatus(id, statusBaru) {
  if (!statusInfo[statusBaru]) return;

  const semua = bacaDaftar(KUNCI_PENGAJUAN);
  const email = ambilEmailSesi();
  const item = semua.find(x => x.id === id && x.email === email);

  if (!item || item.status === statusBaru) return;

  // Catat status lama dulu kalau belum ada riwayat
  if (!Array.isArray(item.riwayatStatus) || item.riwayatStatus.length === 0) {
    item.riwayatStatus = [{ status: item.status, waktu: item.tanggal }];
  }

  item.status = statusBaru;
  item.riwayatStatus.push({ status: statusBaru, waktu: new Date().toISOString() });

  try {
    localStorage.setItem(KUNCI_PENGAJUAN, JSON.stringify(semua));
  } catch (error) {
    alert("Maaf, perubahan status belum bisa disimpan di browser ini.");
  }
}

// ---------- Tampilan ----------

function buatTombolSimulasi(item) {
  const id = amankanTeks(item.id || "");

  return Object.keys(statusInfo).map(kunci => `
    <button type="button" class="lk-sim-btn" data-id="${id}" data-status="${kunci}" ${item.status === kunci ? "disabled" : ""}>
      ${statusInfo[kunci].label}
    </button>
  `).join("");
}

function buatKartu(item) {
  const info = statusInfo[item.status] || statusInfo.proses;
  const nomor = amankanTeks(item.id || "-");

  const langkahHtml = buatLangkah(item).map(langkah => `
    <div class="lk-step">
      <span class="lk-dot ${langkah.titik}"></span>
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
    <details class="lk-item" data-id="${nomor}">
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

        <h3 class="lk-subtitle">Simulasi Ubah Status</h3>
        <p class="lk-sim-note">Hanya untuk uji coba. Di versi sungguhan, status diubah oleh petugas.</p>
        <div class="lk-sim">${buatTombolSimulasi(item)}</div>
      </div>
    </details>
  `;
}

function tampilkanDaftar() {
  // Ingat kartu mana yang sedang terbuka, supaya tidak menutup sendiri
  const terbuka = Array.from(daftarBox.querySelectorAll("details[open]")).map(el => el.dataset.id);

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

  // Buka lagi kartu yang tadi terbuka
  daftarBox.querySelectorAll("details").forEach(el => {
    if (terbuka.includes(el.dataset.id)) el.open = true;
  });
}

// ---------- Jalankan ----------

kolomCari.addEventListener("input", tampilkanDaftar);

// Klik tombol simulasi (satu pendengar untuk semua tombol)
daftarBox.addEventListener("click", event => {
  const tombol = event.target.closest(".lk-sim-btn");
  if (!tombol || tombol.disabled) return;

  ubahStatus(tombol.dataset.id, tombol.dataset.status);
  tampilkanDaftar();
});

tampilkanDaftar();
