
const services = [
  {
    icon: "🪪",
    name: "Kependudukan",
    desc: "Informasi KTP, KK, akta kelahiran, dan dokumen kependudukan.",
    requirements: ["Kartu Keluarga", "Dokumen identitas pendukung"],
    procedure: ["Periksa persyaratan", "Hubungi instansi terkait", "Ikuti proses pengajuan resmi"]
  },
  {
    icon: "🏥",
    name: "Kesehatan",
    desc: "Informasi fasilitas kesehatan dan layanan medis.",
    requirements: ["Identitas diri", "Kartu JKN jika diperlukan"],
    procedure: ["Cari fasilitas kesehatan", "Periksa persyaratan", "Hubungi fasilitas terkait"]
  },
  {
    icon: "🎓",
    name: "Pendidikan",
    desc: "Informasi sekolah, beasiswa, dan pendidikan.",
    requirements: ["Identitas siswa", "Dokumen pendidikan"],
    procedure: ["Pilih informasi pendidikan", "Periksa persyaratan", "Hubungi lembaga terkait"]
  },
  {
    icon: "📢",
    name: "Pengaduan",
    desc: "Sampaikan laporan masalah fasilitas publik.",
    requirements: ["Identitas pelapor", "Keterangan laporan", "Foto pendukung jika ada"],
    procedure: ["Siapkan laporan", "Pilih instansi tujuan", "Kirim laporan melalui kanal resmi"]
  },
  {
    icon: "🤝",
    name: "Bantuan Sosial",
    desc: "Informasi program bantuan masyarakat.",
    requirements: ["Identitas keluarga", "Dokumen pendukung sesuai program"],
    procedure: ["Cari program bantuan", "Periksa kriteria penerima", "Hubungi instansi terkait"]
  },
  {
    icon: "💼",
    name: "Pekerjaan",
    desc: "Informasi lowongan dan pelatihan kerja.",
    requirements: ["Identitas diri", "CV jika diperlukan"],
    procedure: ["Cari lowongan", "Periksa kualifikasi", "Ikuti proses pendaftaran"]
  },
  {
    icon: "🚌",
    name: "Transportasi",
    desc: "Informasi transportasi dan perjalanan.",
    requirements: ["Identitas diri jika diperlukan"],
    procedure: ["Pilih informasi transportasi", "Periksa jadwal", "Hubungi penyedia layanan"]
  },
  {
    icon: "🌦️",
    name: "Cuaca & Bencana",
    desc: "Informasi cuaca dan peringatan bencana.",
    requirements: ["Tidak memerlukan dokumen"],
    procedure: ["Pilih wilayah", "Periksa informasi", "Ikuti arahan resmi"]
  },
  {
    icon: "🏛️",
    name: "Pemerintahan",
    desc: "Informasi instansi dan layanan pemerintah.",
    requirements: ["Identitas diri jika diperlukan"],
    procedure: ["Pilih instansi", "Cari layanan", "Hubungi instansi terkait"]
  }
];

const grid = document.getElementById("serviceGrid");
const search = document.getElementById("serviceSearch");
const detail = document.getElementById("serviceDetail");

function renderServices(data) {
  if (data.length === 0) {
    grid.innerHTML = "<p>Layanan tidak ditemukan.</p>";
    return;
  }

  grid.innerHTML = data.map(service => `
    <article class="service-card">
      <div class="service-icon">${service.icon}</div>
      <h3>${service.name}</h3>
      <p>${service.desc}</p>
      <button class="detail-btn" data-name="${service.name}">
        Lihat Detail →
      </button>
    </article>
  `).join("");
}

function showService(name) {
  const service = services.find(item => item.name === name);

  if (!service) return;

  detail.innerHTML = `
    <div class="service-detail-card">
      <button id="closeDetail">✕ Tutup</button>
      <div class="service-icon">${service.icon}</div>
      <h2>${service.name}</h2>
      <p>${service.desc}</p>

      <h3>Persyaratan</h3>
      <ul>
        ${service.requirements.map(item => `<li>${item}</li>`).join("")}
      </ul>

      <h3>Prosedur</h3>
      <ol>
        ${service.procedure.map(item => `<li>${item}</li>`).join("")}
      </ol>

      <p><small>Informasi demonstrasi. Persyaratan resmi mengikuti ketentuan instansi terkait.</small></p>
    </div>
  `;

  document.getElementById("closeDetail").addEventListener("click", () => {
    detail.innerHTML = "";
  });

  detail.scrollIntoView({ behavior: "smooth" });
}

grid.addEventListener("click", event => {
  const button = event.target.closest(".detail-btn");

  if (button) {
    showService(button.dataset.name);
  }
});

search.addEventListener("input", () => {
  const keyword = search.value.toLowerCase().trim();

  const filtered = services.filter(service =>
    service.name.toLowerCase().includes(keyword) ||
    service.desc.toLowerCase().includes(keyword)
  );

  renderServices(filtered);
});

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

renderServices(services);
