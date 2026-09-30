window.addEventListener('DOMContentLoaded', async () => {
  // --- 1. ดึง Elements ทั้งหมด ---
  const btnDropdown = document.getElementById('btn-dropdown');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const btnPlay = document.getElementById('btn-play');

  const overlay = document.getElementById('progress-overlay');
  const fill = document.getElementById('progress-fill');
  const percent = document.getElementById('percent-text');
  const statusText = document.getElementById('status-text');
  const btnCancel = document.getElementById('btn-cancel');
  const btnFinish = document.getElementById('btn-finish');

  // --- Elements สำหรับระบบเปลี่ยนเวอร์ชันเกม ---
  const btnBrowseFolder = document.getElementById('btn-browse-folder');
  const btnSaveVersion = document.getElementById('btn-save-version');
  const folderPathDisplay = document.getElementById('folder-path-display');
  const currentVersionDisplay = document.getElementById('current-version-display');
  const inputVersion = document.getElementById('input-version');
  const versionStatusText = document.getElementById('version-status-text');

  let selectedGameFolderPath = '';

  // --------------------------------------------------
  // 🔒 1.1 ล็อกปุ่ม Play ทันทีเมื่อเปิด Launcher ขึ้นมา
  // --------------------------------------------------
  if (btnPlay) {
    btnPlay.disabled = true;
    btnPlay.style.opacity = '0.3';
    btnPlay.style.filter = 'grayscale(100%)';
    btnPlay.style.cursor = 'not-allowed';
    btnPlay.style.pointerEvents = 'none';
  }

  // เปิด Progress Overlay อัตโนมัติเพื่อแสดงสถานะการเตรียมไฟล์มอด
  if (overlay) {
    overlay.classList.remove('hidden');
    if (btnFinish) btnFinish.classList.add('disabled');
  }

  // --------------------------------------------------
  // 🔄 1.2 ฟังก์ชันรับ Event สถานะ % การคัดลอกมอด
  // --------------------------------------------------
  window.electronAPI?.onSyncProgress((data) => {
    const { percent: currentPercent, status } = data;

    if (fill) fill.style.width = `${currentPercent}%`;
    if (percent) percent.innerText = `${currentPercent}%`;
    if (statusText) statusText.innerText = status;

    // เมื่อครบ 100% ให้ปลดล็อกปุ่ม PLAY
    if (currentPercent >= 100) {
      if (btnPlay) {
        btnPlay.disabled = false;
        btnPlay.style.opacity = '1';
        btnPlay.style.filter = 'none';
        btnPlay.style.cursor = 'pointer';
        btnPlay.style.pointerEvents = 'auto';
      }
      if (btnFinish) {
        btnFinish.classList.remove('disabled');
      }
    }
  });

  // เรียกขอ Path ไดเรกทอรีเกมเพื่อเริ่มแทนที่มอด
  const currentGamePath = await window.electronAPI?.getCurrentGamePath();
  if (currentGamePath) {
    selectedGameFolderPath = currentGamePath;
    window.electronAPI?.startSyncMods(currentGamePath);
  } else {
    // กรณีที่ยังไม่ได้เลือกไฟล์/โฟลเดอร์เกม
    if (statusText) statusText.innerText = 'กรุณาเลือกโฟลเดอร์เกมก่อนเริ่มต้น';
    if (btnPlay) {
      btnPlay.disabled = false;
      btnPlay.style.opacity = '1';
      btnPlay.style.filter = 'none';
      btnPlay.style.cursor = 'pointer';
      btnPlay.style.pointerEvents = 'auto';
    }
  }

  // --- 2. ระบบ Dropdown Menu (ปุ่ม v) ---
  if (btnDropdown && dropdownMenu) {
    btnDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      dropdownMenu.classList.add('hidden');
    });
  }

  // --- 3. ปุ่มเมนูย่อยทั้ง 5 ปุ่ม ---
  document.getElementById('menu-show-log')?.addEventListener('click', () => {
    window.electronAPI?.showLog();
  });

  document.getElementById('menu-open-folder')?.addEventListener('click', () => {
    window.electronAPI?.openFolder();
  });

  document.getElementById('menu-download-mod')?.addEventListener('click', () => {
    window.electronAPI?.downloadMod();
  });

  document.getElementById('menu-read-patch')?.addEventListener('click', () => {
    window.electronAPI?.readPatch();
  });

  document.getElementById('menu-repair')?.addEventListener('click', async () => {
    dropdownMenu?.classList.add('hidden');
    const currentPath = await window.electronAPI?.getCurrentGamePath();
    if (currentPath) {
      if (btnPlay) {
        btnPlay.disabled = true;
        btnPlay.style.opacity = '0.3';
        btnPlay.style.filter = 'grayscale(100%)';
        btnPlay.style.cursor = 'not-allowed';
        btnPlay.style.pointerEvents = 'none';
      }
      if (overlay) overlay.classList.remove('hidden');
      window.electronAPI?.startSyncMods(currentPath);
    }
  });

  // --- 4. ปุ่ม PLAY ---
  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (!btnPlay.disabled) {
        window.electronAPI?.launchGame();
      }
    });
  }

  // --- 5. ปุ่มควบคุมหน้าต่าง (Minimize / Close) ---
  document.getElementById('btn-minimize')?.addEventListener('click', () => {
    window.electronAPI?.minimize();
  });

  document.getElementById('btn-close')?.addEventListener('click', () => {
    window.electronAPI?.close();
  });

  // --- 7. ปุ่มสแกน Overlay (Cancel / Finish) ---
  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      overlay?.classList.add('hidden');
    });
  }

  if (btnFinish) {
    btnFinish.addEventListener('click', (e) => {
      if (!e.target.classList.contains('disabled')) {
        overlay?.classList.add('hidden');
      }
    });
  }

  // ==================================================
  // ⚙️ --- 8. ระบบเลือกโฟลเดอร์เกม & เปลี่ยนเวอร์ชัน ---
  // ==================================================
  
  // 8.1 กดเลือกโฟลเดอร์เกม (MOBW)
  if (btnBrowseFolder) {
    btnBrowseFolder.addEventListener('click', async () => {
      const result = await window.electronAPI?.selectGameFolder();

      if (result?.success) {
        selectedGameFolderPath = result.folderPath;
        
        if (folderPathDisplay) folderPathDisplay.innerText = selectedGameFolderPath;
        if (currentVersionDisplay) currentVersionDisplay.innerText = result.currentVersion;
        if (inputVersion) inputVersion.value = result.currentVersion;
        
        if (versionStatusText) {
          versionStatusText.innerText = 'เลือกโฟลเดอร์สำเร็จแล้ว กำลังซิงค์มอด...';
          versionStatusText.style.color = '#00ff66';
        }

        // เมื่อเลือกโฟลเดอร์ใหม่สำเร็จ ให้เริ่มคัดลอกไฟล์มอดเข้าโฟลเดอร์ใหม่ทันที
        if (btnPlay) {
          btnPlay.disabled = true;
          btnPlay.style.opacity = '0.3';
          btnPlay.style.filter = 'grayscale(100%)';
          btnPlay.style.cursor = 'not-allowed';
          btnPlay.style.pointerEvents = 'none';
        }
        if (overlay) overlay.classList.remove('hidden');
        window.electronAPI?.startSyncMods(selectedGameFolderPath);

      } else if (result?.message) {
        if (versionStatusText) {
          versionStatusText.innerText = result.message;
          versionStatusText.style.color = '#ff4444';
        }
      }
    });
  }

  // 8.2 กดบันทึกเวอร์ชันใหม่ลง DefaultGame.ini
  if (btnSaveVersion) {
    btnSaveVersion.addEventListener('click', async () => {
      const newVersion = inputVersion?.value?.trim();

      if (!selectedGameFolderPath) {
        alert('กรุณาเลือกโฟลเดอร์เกม (MOBW) ก่อนครับ!');
        return;
      }

      if (!newVersion) {
        alert('กรุณากรอกเวอร์ชันที่ต้องการเปลี่ยน!');
        return;
      }

      const result = await window.electronAPI?.saveVersion({
        folderPath: selectedGameFolderPath,
        newVersion: newVersion
      });

      if (result?.success) {
        if (versionStatusText) {
          versionStatusText.innerText = result.message;
          versionStatusText.style.color = '#00ff66';
        }
        if (currentVersionDisplay) currentVersionDisplay.innerText = newVersion;
      } else if (result?.message) {
        if (versionStatusText) {
          versionStatusText.innerText = result.message;
          versionStatusText.style.color = '#ff4444';
        }
      }
    });
  }
});

// --- 9. ระบบเช็กสถานะเซิร์ฟเวอร์ ---
async function onServerChange() {
  const serverSelect = document.getElementById('serverSelect');
  if (!serverSelect) return;

  const selectedValue = serverSelect.value;
  const [ip, port] = selectedValue.split(':');
  
  const isOnline = await window.electronAPI?.checkServerPing(ip, parseInt(port));
  
  const statusText = document.getElementById('statusText');
  if (statusText) {
    if (isOnline) {
      statusText.innerText = 'ONLINE';
      statusText.style.color = '#4CAF50';
    } else {
      statusText.innerText = 'OFFLINE';
      statusText.style.color = '#F44336';
    }
  }
}

onServerChange();