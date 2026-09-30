# HOME SWEET HOME ONLINE OPEN SOURE LAUNCHER

## Directory File

```
├── build/                # โฟลเดอร์เก็บไอคอนและทรัพยากรสำหรับการ Build
│   └── icon.ico          # ไอคอนโปรแกรม
├── certs/                # โฟลเดอร์เก็บ Root CA Certificate และ SSL Key
├── mods/                 # โฟลเดอร์เก็บมอดต้นทางเพื่อ Sync ไปยังตัวเกม
├── index.html            # หน้าต่าง UI หลัก ดีไซน์แบบ Liquid Glass
├── main.js               # Process หลักของ Electron (Proxy, IPC, File System)
├── preload.js            # สะพานเชื่อมระหว่าง Main Process และ Renderer Process
├── renderer.js           # สคริปต์ควบคุม UI Interaction, Progress Overlay
└── package.json          # ค่าการตั้งค่าโปรเจกต์และ dependencies
```
