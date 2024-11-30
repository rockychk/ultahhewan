document.addEventListener('DOMContentLoaded', function () {
    // Mulai proses pengambilan data
    fetchDataFromSpreadsheet();
});

function fetchDataFromSpreadsheet() {
    const spinnerText = document.getElementById('spinner-text');
    let timer1, timer2, timer3;

    // Mulai timer untuk pesan "Data sedang diproses..." setelah 0 detik
    timer1 = setTimeout(() => {
        spinnerText.textContent = "Data sedang diproses...";
    }, 0);

    // Mulai timer untuk pesan "Jaringan Anda kurang Oke..." setelah 10 detik
    timer2 = setTimeout(() => {
        spinnerText.textContent = "Jaringan Anda kurang Oke...";
    }, 10000); // 10 detik

    // Mulai timer untuk pesan "Coba matikan jaringan data / wifi..." setelah 1 menit
    timer3 = setTimeout(() => {
        spinnerText.textContent = "Coba matikan jaringan data / wifi anda, lalu hubungkan kembali...";
    }, 60000); // 60 detik (1 menit)

    // Lakukan permintaan ke URL Google Apps Script (ganti dengan URL endpoint Anda)
    fetch('https://script.google.com/macros/s/AKfycbwJnhE46t-cEe7F33ksQWh0CD9q-dGrTSI6abrwxMei7mYnG6F82VbhvLSYNf3jiGc9eQ/exec')
        .then(response => response.json())
        .then(data => {
            // Data berhasil diterima
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);

            // Ganti pesan dan sembunyikan spinner setelah data selesai diproses
            spinnerText.textContent = "Data berhasil dimuat";

            // Tampilkan konten halaman
            document.getElementById('container-1').classList.add('container');

            // Menampilkan data di dalam elemen
            const nameElement = document.getElementById('name');
            const ageElement = document.getElementById('age');
            const recipientElement = document.getElementById('recipient-name');

            // Ambil data pertama (atau bisa disesuaikan jika ada banyak data)
            const dataItem = data[0];

            // Isi elemen dengan data yang diterima
            nameElement.textContent = dataItem.name;
            ageElement.textContent = `akan berusia ${dataItem.age} tahun`;
            recipientElement.textContent = `${dataItem.giftName}`;

            // Hapus spinner setelah animasi selesai
            setTimeout(() => {
                const spinnerOverlay = document.getElementById('spinner-overlay');
                if (spinnerOverlay) {
                    spinnerOverlay.style.opacity = '0';
                    setTimeout(() => spinnerOverlay.remove(), 500); // Hapus spinner setelah animasi selesai
                }
            }, 500); // Menghapus spinner setelah animasi selesai
        })
        .catch(error => {
            // Menangani kesalahan jika permintaan gagal
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            spinnerText.textContent = "Gagal mengambil data. Coba lagi.";
        });
}



// AWAL TAMU UNDANGAN
// Mengecek apakah nama tamu sudah disimpan di LocalStorage
const savedRecipientName = localStorage.getItem('kepada');

// Jika ada, tampilkan nama di elemen h2
if (savedRecipientName) {
  document.getElementById('recipient-name').textContent = savedRecipientName;
}
// AKHIR TAMU UNDANGAN

// Cek apakah halaman di-refresh
if (performance.navigation.type == 1) {
    window.location.href = './index.html';
}

// Fungsi untuk menampilkan kontainer yang dipilih
function showContainer(containerNumber) {
    // Sembunyikan semua kontainer
    document.querySelectorAll('.container').forEach(function(container) {
        container.style.display = 'none';
    });

    // Tampilkan kontainer yang sesuai
    document.getElementById('container-' + containerNumber).style.display = 'block';
}

// Fungsi untuk play/pause musik
var audio = document.getElementById('backgroundMusic');
var playPauseBtn = document.getElementById('playPauseBtn');
var playPauseIcon = document.getElementById('playPauseIcon');

function togglePlayPause() {
    if (audio.paused) {
        audio.play();
        playPauseIcon.classList.remove('bi-play-circle');
        playPauseIcon.classList.add('bi-pause-circle');
    } else {
        audio.pause();
        playPauseIcon.classList.remove('bi-pause-circle');
        playPauseIcon.classList.add('bi-play-circle');
    }
}

const webAppUrl = 'https://script.google.com/macros/s/AKfycbwJnhE46t-cEe7F33ksQWh0CD9q-dGrTSI6abrwxMei7mYnG6F82VbhvLSYNf3jiGc9eQ/exec';  // Ganti dengan URL Google Apps Script Anda

// Menampilkan kontainer pertama saat halaman dimuat dan memutar musik secara otomatis
window.onload = function() {
    // Memulai pemutaran musik secara otomatis
    audio.play();
    playPauseIcon.classList.remove('bi-play-circle');
    playPauseIcon.classList.add('bi-pause-circle'); // Mengubah ikon ke 'Pause' setelah musik mulai

    // Menampilkan kontainer pertama
    showContainer(1);
    fetch(webAppUrl)
        .then(response => response.json())
        .then(data => {
            // Ambil data pertama (misalnya data[0] untuk acara pertama)
            const event = data[0];
            // FUNGSI COPY NOREK
            const copyButton = document.getElementById("copy-button");
            // FUNGSI MUSIC
            //const musicSource = document.getElementById("music-source");
            //musicSource.setAttribute("src", event.music);
            
            // Menampilkan data pada elemen-elemen
            document.getElementById("name").textContent = event.name;
            document.getElementById("age").textContent = `akan berusia ${event.age} Tahun`;
            document.getElementById("event-age").textContent = `${event.age}Th`;
            document.getElementById("event-name").textContent = `Acara Ulang Tahun ${event.name}`;
            
            // Tampilkan hanya tanggal (tanpa bulan dan tahun)
            document.getElementById("event-date").textContent = `${formatDayBasedOnDevice(event.date)}`; 

            document.getElementById("event-day").textContent = getDayOfWeek(event.date);
            document.getElementById("event-month-year").textContent = formatMonthYear(event.date);
            document.getElementById("event-time").textContent = event.time;
            document.getElementById("event-location").textContent = event.location;
            document.getElementById("event-iframe").src = event.iframe;
            document.getElementById("event-map").href = event.map; 
            document.getElementById("event-giftlogo").src = event.giftLogo;
            document.getElementById("event-giftname").textContent = event.giftName; 
            document.getElementById("event-bankaccount").textContent = event.bankAccount;
            copyButton.setAttribute("onclick", `copyToClipboard('${event.bankAccount}')`);
            
            // Ambil link musik langsung dari JSON
            //document.getElementById("music-source").setAttribute("src", event.music);
            //document.getElementById("backgroundMusic").load();


            // You can add more updates here for map, gift, music, etc.
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    
// Fungsi untuk mendapatkan nama hari dari tanggal
function getDayOfWeek(date) {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const d = new Date(date);
    return days[d.getDay()];
}

// Fungsi untuk memformat hanya tanggal (tanpa bulan dan tahun) berdasarkan perangkat (mobile vs desktop)
function formatDayBasedOnDevice(date) {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent); // Deteksi perangkat mobile
    const d = new Date(date);

    if (isMobile) {
        // Format tanggal untuk perangkat mobile (misalnya: dd)
        return String(d.getDate()).padStart(2, '0');
    } else {
        // Format tanggal untuk perangkat desktop (misalnya: dd)
        return String(d.getDate()).padStart(2, '0');
    }
}

    // Format bulan dan tahun (tetap digunakan untuk bagian lain jika perlu)
    function formatMonthYear(date) {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const d = new Date(date);
        return `${months[d.getMonth()]} ${d.getFullYear()}`;
    }

}

// AWAL COUNTDOWN

// Set the date we're counting down to
const countDownDate = new Date("Jan 16, 2025 13:00:00").getTime();

// Update the countdown every 1 second
const countdownFunction = setInterval(function() {
    // Get the current time
    const now = new Date().getTime();

    // Find the distance between now and the countdown date
    const distance = countDownDate - now;

    // Calculate days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the corresponding elements
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    // If the countdown ends, check if it's within 4 hours or more after the event
    if (distance < 0) {
        const eventEndTime = countDownDate + (4 * 60 * 60 * 1000);  // Adding 4 hours to countdown end time
        const currentTime = new Date().getTime();
        
        // Check if the event is still ongoing (within 4 hours after the countdown ends)
        if (currentTime < eventEndTime) {
            document.getElementById("countdown").innerHTML = "Acara sedang Berlangsung";
            document.getElementById("countdown").style.backgroundColor = "rgb(48, 121, 179)";  // Orange background

            // Adding other styles when event ends (before 4 hours)
            document.getElementById("countdown").style.padding = "5px";
            document.getElementById("countdown").style.borderRadius = "10px";
            document.getElementById("countdown").style.width = "70%";
            document.getElementById("countdown").style.color = "white";
            document.getElementById("countdown").style.fontFamily = "'Sour Gummy', sans-serif";
            document.getElementById("countdown").style.marginLeft = "60px";

        } else {
            document.getElementById("countdown").innerHTML = "Acara sudah berakhir";
            document.getElementById("countdown").style.backgroundColor = "red";  // Red background
            
            document.getElementById("countdown").style.padding = "5px";
            document.getElementById("countdown").style.borderRadius = "10px";
            document.getElementById("countdown").style.width = "70%";
            document.getElementById("countdown").style.color = "white";
            document.getElementById("countdown").style.fontFamily = "'Sour Gummy', sans-serif";
            document.getElementById("countdown").style.marginLeft = "60px";
        }
        clearInterval(countdownFunction);  // Stop the countdown function after it ends
    }
}, 1000);

// AKHIR COUNTDOWN

/* AWAL SCRIPT UNTUK FORM DOA DAN UCAPAN */

// Fetch Ucapan
document.addEventListener('DOMContentLoaded', function() {
  fetchUcapan(); 
});

function fetchUcapan() {
  const url = 'https://script.google.com/macros/s/AKfycbxG8lADguQ9oUeckmkaLcHraGKvhBFf2jnyXry3o-_fvwzwGgjxNY_q9RWR2jZ0b18N/exec';
  
  // Menampilkan spinner sebelum mengambil data
  document.getElementById('spinner').style.display = 'block';
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      displayAllUcapan(data);
      // Sembunyikan spinner setelah data selesai dimuat
      document.getElementById('spinner').style.display = 'none';
    })
    .catch(() => {
      // Menyembunyikan spinner jika terjadi kesalahan
      document.getElementById('spinner').style.display = 'none';
    });
}

function displayAllUcapan(ucapanData) {
  const ucapanContainer = document.getElementById('ucapan');
  ucapanContainer.innerHTML = '';
  ucapanData.forEach(ucapan => {
    const ucapanItem = document.createElement('div');
    ucapanItem.classList.add('ucapan-item');
    ucapanItem.innerHTML = `<strong>${ucapan.nama} (${ucapan.kehadiran}):</strong><p>${ucapan.pesan}</p>`;
    ucapanContainer.appendChild(ucapanItem);
  });
}

// Form Popup
document.getElementById('btnBuatUcapan').addEventListener('click', () => {
  document.getElementById('formPopup').style.display = 'block';
});

document.getElementById('btnClosePopup').addEventListener('click', () => {
  document.getElementById('formPopup').style.display = 'none';
});

// Submit Form
document.getElementById('formPernikahan').addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Tampilkan Spinner saat form sedang diproses
  document.getElementById('spinner').style.display = 'block';

  const nama = document.getElementById('nama').value;
  const kehadiran = document.getElementById('kehadiran').value;
  const pesan = document.getElementById('pesan').value;

  fetch('https://script.google.com/macros/s/AKfycbxG8lADguQ9oUeckmkaLcHraGKvhBFf2jnyXry3o-_fvwzwGgjxNY_q9RWR2jZ0b18N/exec', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({ 'nama': nama, 'kehadiran': kehadiran, 'pesan': pesan })
  })
  .then(response => response.text())
  .then(() => {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('formPernikahan').reset();
    displayAlert("Ucapan terkirim!");

    // Menutup form otomatis setelah submit berhasil
    document.getElementById('formPopup').style.display = 'none';
    
    fetchUcapan();
  })
  .catch(() => {
    document.getElementById('respon').innerHTML = 'Terjadi kesalahan, coba lagi nanti.';
    document.getElementById('spinner').style.display = 'none';
  });
});

function displayAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.classList.add('alert-box');
  alertBox.innerHTML = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}

// Copy to clipboard function
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Nomor rekening berhasil disalin!');
    }).catch(err => {
      alert('Gagal menyalin nomor rekening.');
    });
}

/* AKHIR SCRIPT UNTUK FORM DOA DAN UCAPAN */

